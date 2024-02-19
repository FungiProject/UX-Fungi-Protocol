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

  const swapsResolved = await Promise.all(promises);

  const userOps: UserOperation[] = [];
  swaps.forEach((swap, index) => {
    //need approve if is not native
    if(swap.tokenIn !== ethers.constants.AddressZero) {
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
function computeTokensUsd(balances: TokenInfo[]):TokenInfoTotalUsd[]  {

  const balancesUsdValue: TokenInfoTotalUsd[] = balances.map(token=>{
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
  //ordenamos de mayor a menor los balances y los porcentajes de los rebalances para empezar con ellos con los porcentajes mas grandes
  const balanceTokensSorted = balancesToken.sort((a, b) => {
    if (a.totalValueUsd && b.totalValueUsd) {
      return b.totalValueUsd - a.totalValueUsd;
    } else {
      return 0;
    }
  });
  const rebalancesSorted = rebalances.sort(
    (a, b) => b.percentage - a.percentage
  );

  //Añadimos el campo usdAvailable que será el que lleve la cuenta de la cantidad que falta sin userOp
  interface BalanceTokenParamsWithUsdAvailable extends TokenInfoTotalUsd {
    usdAvailable: number;
  }
  const balanceTokensMap: BalanceTokenParamsWithUsdAvailable[] =
    balanceTokensSorted.map((a) => ({
      ...a,
      usdAvailable: a.totalValueUsd || 0,
    }));

  let swaps: RebalanceSwap[] = [];

  rebalancesSorted.forEach((rebalance) => {
    let amountUsdByPercentaje = totalUsd * (rebalance.percentage / 100); //cantidad en usd que corresponde al porcentaje del rebalanceo, ira menguando conforme se generan las userop

    for (let i = 0; i < balanceTokensMap.length; i++) {
      const balanceToken = balanceTokensMap[i];
      if (amountUsdByPercentaje === 0) {
        break;
      }

      if (balanceToken.usdAvailable > 0) {
        if (amountUsdByPercentaje > balanceToken.usdAvailable) {
          swaps.push({
            tokenIn: balanceToken.address,
            amountIn: ethers.utils
              .parseUnits(
                (
                  (balanceToken.usdAvailable / Number(balanceToken.priceUSD!)).toFixed(15)
                ).toString(),
                balanceToken.decimals
              )
              .toString(),
            tokenOut: rebalance.address,
          });

          balanceToken.usdAvailable = 0;
          amountUsdByPercentaje =
            amountUsdByPercentaje - balanceToken.usdAvailable;
        } else if (amountUsdByPercentaje > 0) {
          swaps.push({
            tokenIn: balanceToken.address,
            amountIn: ethers.utils
              .parseUnits(
                (
                  (amountUsdByPercentaje / Number(balanceToken.priceUSD!)).toFixed(15)
                ).toString(),
                balanceToken.decimals
              )
              .toString(),
            tokenOut: rebalance.address,
          });

          balanceToken.usdAvailable =
            balanceToken.usdAvailable - amountUsdByPercentaje;
          amountUsdByPercentaje = 0;
        }
      }
    }
  });

  return swaps;
}


