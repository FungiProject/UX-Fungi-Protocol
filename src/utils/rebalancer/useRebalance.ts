import { BigNumber, ethers } from "ethers";
import { networks } from "./assetPlataformCoingecko";
import { chains } from "./chainsLifi";
import axios from "axios";


interface BalanceTokenParams {
    token: string,
    tokenLifIId: string,
    chainId: string,
    balance: BigNumber,
    decimals: BigNumber,
    priceUsd?: number,
    usdValue?: number,
}

interface TotalUsdByChainId {
    [chainId: string]: number;
}

interface BalanceTokenByChain {
    [chainId: string]: BalanceTokenParams[]
}

interface RebalanceParams {
    token: string, //lifi
    percentaje: number
}


export default async function computeRebalance(params: BalanceTokenParams[], rebalances: RebalanceParams[]) {

    const { totalUsdByChain, balanceTokensByChain } = await getUsdValuByChainId(params)

    const userOperationsSwap = Object.keys(totalUsdByChain).map( chainId=>{ 
        return rebalance(chainId, totalUsdByChain[chainId], balanceTokensByChain[chainId], rebalances)
    })
    
}

interface BalanceTokenParamsWithUsdAvailable extends BalanceTokenParams {
    usdAvailable: number;
}

async function rebalance(chainId: string, totalUsdByChain: number, balancesToken: BalanceTokenParams[], rebalances: RebalanceParams[]): number{

    const balanceTokensSorted = balancesToken.sort((a, b) => {
        if (a.usdValue && b.usdValue ) {
            return b.usdValue - a.usdValue;
        } else {
            return 0;
        }
    });

    //Añadimos el campo usdAvailable que será el que lleve la cuenta de la cantidad que falta sin userOp
    const balanceTokensMap: BalanceTokenParamsWithUsdAvailable[] = balanceTokensSorted.map(a=>({...a, usdAvailable: a.usdValue || 0 }))

    const rebalancesSorted = rebalances.sort((a, b) => b.percentaje - a.percentaje);

    let userOp:{}[] = [];

    rebalancesSorted.forEach(rebalance=>{
      
        let amountUsdByPercentaje =  totalUsdByChain * (rebalance.percentaje/100); //cantidad en usd que corresponde al porcentaje del rebalanceo, ira menguando conforme se generan las userop

        for (let i = 0; i < balanceTokensMap.length; i++) {
            
            const balanceToken = balanceTokensMap[i];
            if(amountUsdByPercentaje===0){break}
            
            if(balanceToken.usdAvailable>0){
                if(amountUsdByPercentaje>balanceToken.usdAvailable){
                    
                    userOp.push(
                        getUserOpSwap(
                            chainId, 
                            balanceToken.token, 
                            ethers.utils.parseUnits(
                                (balanceToken.usdAvailable/balanceToken.priceUsd!).toString(),
                                balanceToken.decimals
                            ).toString(), 
                            rebalance.token
                        )
                    )
                    
                    balanceToken.usdAvailable = 0;
                    amountUsdByPercentaje = amountUsdByPercentaje-balanceToken.usdAvailable
                } else if(amountUsdByPercentaje>0) {

                    userOp.push(
                        getUserOpSwap(
                            chainId, 
                            balanceToken.token, 
                            ethers.utils.parseUnits(
                                (amountUsdByPercentaje/balanceToken.priceUsd!).toString(),
                                balanceToken.decimals
                            ).toString(), 
                            rebalance.token
                        )
                    )

                    balanceToken.usdAvailable = balanceToken.usdAvailable - amountUsdByPercentaje;
                    amountUsdByPercentaje = 0
                }
            }
        }
    })

    return 0;
}

function getUserOpSwap(chaindId: string, tokenIn: string, amountIn: string, tokenOut: string): {}{

    return {}
}

async function getUsdValuByChainId(params: BalanceTokenParams[]): Promise<{totalUsdByChain,balanceTokensByChain}> {
    await getValueUsd(params);

    let balanceTokensByChain: BalanceTokenByChain = {}
    let totalUsdByChain: TotalUsdByChainId =  {}

    params.forEach(balanceToken => {
        if (!totalUsdByChain[balanceToken.chainId]) {
            totalUsdByChain[balanceToken.chainId] = 0;
        }
    })

    const chainsWithBalance = Object.keys(totalUsdByChain);

    chainsWithBalance.forEach(chainId=>{
        const paramsWithMatchingChainId = params.filter(param => param.chainId === chainId);
        balanceTokensByChain[chainId] = paramsWithMatchingChainId
        totalUsdByChain[chainId] = paramsWithMatchingChainId.reduce((accumulator, currentValue) => accumulator + (currentValue?.usdValue || 0), 0);
    })

    return {totalUsdByChain, balanceTokensByChain}
}

//Obtenemos el precio en usd de cada uno de los tokens y calculamos su valor en la cartera
async function getValueUsd(params: BalanceTokenParams[]) {

    const promises = params.map(async (token) => {
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/simple/token_price/${getChainIdLiFi(token.chainId)}?contract_addresses=${token.token}&vs_currencies=usd`
            );
            if (response.status === 200) {
                const data = response.data;
                const priceInUSD = data[token.token]?.usd;
                if (priceInUSD !== undefined) {
                    token.priceUsd = priceInUSD
                    token.usdValue = parseInt(ethers.utils.formatUnits(token.decimals))*priceInUSD 
                } else {
                    throw Error("Value could not be obtained")
                }
            }
        } catch (error) {
            console.error(error)
        }
    });

    await Promise.all(promises);
}


function getChainIdLiFi(chainId: number): string | undefined {
    const chain = chains.find(chain => chain.id === chainId);
    return chain ? chain.key : undefined;
}