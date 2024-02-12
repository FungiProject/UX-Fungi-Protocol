import { BigNumber, ethers } from "ethers";
import { chains } from "./chainsLifi";
import { tokens } from "./tokensLifi";
import { TokenBalance, TokenRebalanceInput } from "@/components/Cards/Rebalancer";}
import axios from "axios";
import { createApproveTokensUserOp } from "../gmx/domain/tokens/approveTokensUserOp";
import { UserOperation } from "../gmx/lib/userOperations/types";


interface RebalanceSwap {
    tokenIn: string,
    amountIn: string,
    tokenOut: string
}

export function computeRebalance(balances: TokenBalance[], rebalances: TokenRebalanceInput[]): RebalanceSwap[] {

    computeTokensUsd(balances);

    const totalUsd = computeTotalValueUsdBalance(balances)

    const swaps: RebalanceSwap[] = getRebalanceSwaps(totalUsd, balances, rebalances);

    return swaps;
}


export async function getUserOpSwapLifi(chainId: number, scAccount: string, swaps: RebalanceSwap[]): Promise<UserOperation[]> {

    const chain = getChainIdLiFi(chainId)

    const promises = swaps.map(swap => getLiFiSwapQuote(chain!, swap.amountIn, swap.tokenIn, chain!, swap.tokenOut, scAccount))

    const swapsResolved = await Promise.all(promises)

    const userOps: UserOperation[] = []
    swaps.forEach((swap, index) => {

        //Approve
        userOps.push(createApproveTokensUserOp({ tokenAddress: swap.tokenIn, spender: swapsResolved[index].estimate.approvalAddress, amount: BigNumber.from(swap.amountIn) }))
        //Swap
        userOps.push({ target: swapsResolved[index].transactionRequest.to, data: swapsResolved[index].transactionRequest.data, value: swapsResolved[index].transactionRequest.value })

    })

    return userOps
}


//Obtiene el valor en usd del monto total del balance de este token
function computeTokensUsd(balances: TokenBalance[]) {

    balances.forEach((token) => {
        token.totalValueUsd = parseInt(token.priceUSD) * parseInt(ethers.utils.formatUnits(token.balance, token.decimals));
    });

}

function computeTotalValueUsdBalance(balances: TokenBalance[]) {
    return balances.reduce((accumulator, current) => current.totalValueUsd + accumulator, 0)
}


function getRebalanceSwaps(totalUsd: number, balancesToken: TokenBalance[], rebalances: TokenRebalanceInput[]): RebalanceSwap[] {

    //ordenamos de mayor a menor los balances y los porcentajes de los rebalances para empezar con ellos con los porcentajes mas grandes
    const balanceTokensSorted = balancesToken.sort((a, b) => {
        if (a.totalValueUsd && b.totalValueUsd) {
            return b.totalValueUsd - a.totalValueUsd;
        } else {
            return 0;
        }
    });
    const rebalancesSorted = rebalances.sort((a, b) => b.percentage - a.percentage);

    //Añadimos el campo usdAvailable que será el que lleve la cuenta de la cantidad que falta sin userOp
    interface BalanceTokenParamsWithUsdAvailable extends TokenBalance {
        usdAvailable: number;
    }
    const balanceTokensMap: BalanceTokenParamsWithUsdAvailable[] = balanceTokensSorted.map(a => ({ ...a, usdAvailable: a.totalValueUsd || 0 }))

    let swaps: RebalanceSwap[] = [];

    rebalancesSorted.forEach(rebalance => {

        let amountUsdByPercentaje = totalUsd * (rebalance.percentage / 100); //cantidad en usd que corresponde al porcentaje del rebalanceo, ira menguando conforme se generan las userop

        for (let i = 0; i < balanceTokensMap.length; i++) {

            const balanceToken = balanceTokensMap[i];
            if (amountUsdByPercentaje === 0) { break }

            if (balanceToken.usdAvailable > 0) {
                if (amountUsdByPercentaje > balanceToken.usdAvailable) {

                    swaps.push({
                        tokenIn: balanceToken.address,
                        amountIn: ethers.utils.parseUnits(
                            (balanceToken.usdAvailable / parseInt(balanceToken.priceUSD!)).toString(),
                            balanceToken.decimals
                        ).toString(),
                        tokenOut: rebalance.address
                    })

                    balanceToken.usdAvailable = 0;
                    amountUsdByPercentaje = amountUsdByPercentaje - balanceToken.usdAvailable
                } else if (amountUsdByPercentaje > 0) {

                    swaps.push({
                        tokenIn: balanceToken.address,
                        amountIn: ethers.utils.parseUnits(
                            (amountUsdByPercentaje / parseInt(balanceToken.priceUSD!)).toString(),
                            balanceToken.decimals
                        ).toString(),
                        tokenOut: rebalance.address
                    }
                    )

                    balanceToken.usdAvailable = balanceToken.usdAvailable - amountUsdByPercentaje;
                    amountUsdByPercentaje = 0
                }
            }
        }
    })

    return swaps;
}

//Obtiene la key de la chain de lifi desde el chainId
function getChainIdLiFi(chainId: number): string | undefined {
    const chain = chains.find(chain => chain.id === chainId);
    return chain ? chain.key : undefined;
}

//Obtiene el address del token con el coinKey de lify
function getTokenAddressLifi(chainId: string, coinKey: string) {
    const token = tokens[chainId].find(token => token.coinKey === coinKey);
    return token ? token.address ? ethers.constants.AddressZero
}

export const getLiFiSwapQuote = async (
    fromChain: string,
    fromAmount: string,
    fromToken: string,
    toChain: string,
    toToken: string,
    fromAddress: string,
) => {
    const result = await axios.get('https://li.quest/v1/quote', {
        params: {
            fromChain,
            fromAmount,
            fromToken,
            toChain,
            toToken,
            fromAddress,
        }
    });
    return result.data;
}