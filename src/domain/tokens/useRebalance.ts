import { BigNumber, ethers } from "ethers";
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { UserOperation } from "../../utils/gmx/lib/userOperations/types";
import { TokenInfo } from "@/domain/tokens/types";
import { getChainIdLifi } from "@/lib/lifi/getChainIdLifi";
import { TokenInfoRebalanceInput, RebalanceSwap } from "@/domain/tokens/types";
import { getLiFiSwapQuote } from "@/lib/lifi/getQuote";

export interface TokenInfoTotalUsd extends TokenInfo {
  totalValueUsd?: number;
}

export function computeRebalance(
  balances: TokenInfo[],
  rebalances: TokenInfoRebalanceInput[]
): RebalanceSwap[] {
  //Calculamos el valor de cada balance en usdc
  const tokenInfoBalanceUsd = computeTokensUsd(balances);

  //Eliminamos lo que tengan un balance bajo porque falla lifi
  const tokenInfoRemoveLow = removeTokenLowBalance(tokenInfoBalanceUsd)

  //Calculamos la suma de todos los balances en usd
  const totalUsd = computeTotalValueUsdBalance(tokenInfoRemoveLow);

  const swaps: RebalanceSwap[] = getRebalanceSwaps(
    totalUsd,
    tokenInfoRemoveLow,
    rebalances
  );

  console.log("Swaps calculados Rebalance");
  console.log(swaps);

  return swaps;
}

function removeTokenLowBalance(balances: TokenInfoTotalUsd[]) {

  const newTokensBalances = balances.filter(token => {
    if (token.totalValueUsd && token.totalValueUsd > 0.05) {
      return true;
    }
    return false;
  })
  return newTokensBalances;
}

export async function getUserOpRebalance(
  chainId: number,
  scAccount: string,
  swaps: RebalanceSwap[]
): Promise<UserOperation[]> {
  const chain = getChainIdLifi(chainId);

  const promises = swaps.map((swap) =>
    getLiFiSwapQuote(
      chain!,
      swap.amountIn,
      swap.tokenIn,
      chain!,
      swap.tokenOut,
      scAccount
    )
  );

  console.log("Promises: ", promises);

  const swapsResolved = await Promise.all(promises);

  const userOps: UserOperation[] = [];
  swaps.forEach((swap, index) => {
    //need approve if is not native
    if (swap.tokenIn !== ethers.constants.AddressZero) {
      //Approve
      userOps.push(
        createApproveTokensUserOp({
          tokenAddress: swap.tokenIn,
          spender: swapsResolved[index].estimate.approvalAddress,
          amount: BigNumber.from(swap.amountIn),
        })
      );
    }
    //Swap
    userOps.push({
      target: swapsResolved[index].transactionRequest.to,
      data: swapsResolved[index].transactionRequest.data,
      value: swapsResolved[index].transactionRequest.value,
    });
  });

  return userOps;
}

//Obtiene el valor en usd del monto total del balance de este token
function computeTokensUsd(balances: TokenInfo[]): TokenInfoTotalUsd[] {

  const balancesUsdValue: TokenInfoTotalUsd[] = balances.map(token => {
    return {
      ...token,
      totalValueUsd: Number(token.priceUSD) *
        Number(ethers.utils.formatUnits(token.balance || "0", token.decimals))
    }
  })

  return balancesUsdValue;
}


function computeTotalValueUsdBalance(balances: TokenInfoTotalUsd[]) {
  return balances.reduce(
    (accumulator, current) =>
      current.totalValueUsd
        ? current.totalValueUsd + accumulator
        : 0 + accumulator,
    0
  );
}


function getRebalanceSwaps(
  totalUsd: number,
  balancesToken: TokenInfoTotalUsd[],
  rebalances: TokenInfoRebalanceInput[]
): RebalanceSwap[] {

  const { balanceTokensSorted, rebalancesSorted } = sortTokenBalanceAndRebalance(balancesToken, rebalances);

  //Añadimos el campo usdAvailable que será el que lleve la cuenta de la cantidad que falta sin userOp
  interface BalanceTokenParamsWithUsdAvailable extends TokenInfoTotalUsd {
    usdAvailable: number;
  }
  const balanceTokensMap: BalanceTokenParamsWithUsdAvailable[] =
    balanceTokensSorted.map((a) => ({
      ...a,
      usdAvailable: a.totalValueUsd || 0,
    }));

  //Añadimos el campo usdRemain que será el que lleve la cuenta de la cantidad que falta para rellenar el rebalance. Al inicio va a ser el porcentaje convertido a usd, //cantidad en usd que corresponde al porcentaje del rebalanceo, ira menguando conforme se generan las userop
  interface TokenInfoRebalanceInputWithUsdRemain extends TokenInfoTotalUsd {
    amountUsdByPercentaje: number;
  }
  const rebalancesSortedWithUsdRemain: TokenInfoRebalanceInputWithUsdRemain[] =
    rebalancesSorted.map((a) => ({
      ...a,
      amountUsdByPercentaje: totalUsd * (a.percentage / 100),
    }));

  let swaps: RebalanceSwap[] = [];


  //Primero vamos a buscar si hay algún token que tengamos en balance y que exista en rebalance para no generar swap innecesarios. Por lo que vamos a buscar ese balance y restarselo al amountUsdByPercentaje
  rebalancesSortedWithUsdRemain.forEach((rebalance) => {
    const index = balanceTokensMap.findIndex(t => t.address == rebalance.address);
    if (index != -1) {
      if (rebalance.amountUsdByPercentaje > balanceTokensMap[index].usdAvailable) {
        rebalance.amountUsdByPercentaje = rebalance.amountUsdByPercentaje - balanceTokensMap[index].usdAvailable;
        balanceTokensMap[index].usdAvailable = 0;
      } else if (rebalance.amountUsdByPercentaje > 0) {
        balanceTokensMap[index].usdAvailable = balanceTokensMap[index].usdAvailable - rebalance.amountUsdByPercentaje;
        rebalance.amountUsdByPercentaje = 0;
      }
    }
  })

  rebalancesSortedWithUsdRemain.forEach((rebalance) => {

    for (let i = 0; i < balanceTokensMap.length; i++) {
      balanceTokensMap[i];
      if (rebalance.amountUsdByPercentaje === 0) {
        break;
      }

      if (balanceTokensMap[i].usdAvailable > 0) {
        if (rebalance.amountUsdByPercentaje > balanceTokensMap[i].usdAvailable) {
          if (balanceTokensMap[i].address != rebalance.address) {
            swaps.push({
              tokenIn: balanceTokensMap[i].address,
              amountIn: ethers.utils
                .parseUnits(
                  (
                    (balanceTokensMap[i].usdAvailable / Number(balanceTokensMap[i].priceUSD!)).toFixed(5)
                  ).toString(),
                  balanceTokensMap[i].decimals
                )
                .toString(),
              tokenOut: rebalance.address,
            });
          }

          rebalance.amountUsdByPercentaje =
            rebalance.amountUsdByPercentaje - balanceTokensMap[i].usdAvailable;
          balanceTokensMap[i].usdAvailable = 0;
        } else if (rebalance.amountUsdByPercentaje > 0) {
          if (balanceTokensMap[i].address != rebalance.address) {
            swaps.push({
              tokenIn: balanceTokensMap[i].address,
              amountIn: ethers.utils.parseUnits(((rebalance.amountUsdByPercentaje / Number(balanceTokensMap[i].priceUSD!)).toFixed(5)).toString(), balanceTokensMap[i].decimals)
                .toString(),
              tokenOut: rebalance.address,
            });
          }

          balanceTokensMap[i].usdAvailable =
            balanceTokensMap[i].usdAvailable - rebalance.amountUsdByPercentaje;
          rebalance.amountUsdByPercentaje = 0;
        }
      }
    }
  });

  console.log("Swaps generados");
  console.log(swaps);

  return swaps;
}

function sortTokenBalanceAndRebalance(
  balancesToken: TokenInfoTotalUsd[],
  rebalances: TokenInfoRebalanceInput[]) {

  //ordenamos de mayor a menor los balances y los porcentajes de los rebalances para empezar con ellos con los porcentajes mas grandes
  const balanceTokensSorted = balancesToken.sort((a, b) => {
    if (a.totalValueUsd && b.totalValueUsd) {
      return b.totalValueUsd - a.totalValueUsd;
    } else {
      return 0;
    }
  });

  // Construimos rebalancesSorted basándonos en el orden de los tokens en balanceTokensSorted
  const rebalancesSorted: TokenInfoRebalanceInput[] = [];
  for (const tokenInfo of balanceTokensSorted) {
    const rebalance = rebalances.find(rebalance => rebalance.address === tokenInfo.address);
    if (rebalance) {
      rebalancesSorted.push(rebalance);
    }
  }

  // Agregar los rebalances que no se encontraron al final de rebalancesSorted
  for (const rebalance of rebalances) {
    if (!rebalancesSorted.includes(rebalance)) {
      rebalancesSorted.push(rebalance);
    }
  }

  return { balanceTokensSorted, rebalancesSorted };
}


