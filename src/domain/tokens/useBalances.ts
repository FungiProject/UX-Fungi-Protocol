import { BigNumber } from "ethers";
import { AlchemyMultichainClient } from "@/lib/alchemy/AlchemyMultichainClient";
import { TokenBalance } from "alchemy-sdk";
import { TokenInfo } from "./types";
import { getLifiTokens } from "@/lib/lifi/getLifiTokens";
import { getTokenBalancesAlchemy } from "@/lib/alchemy/alchemyCalls";

/**
 * Retrieves the token balances for a given address using the provided AlchemyMultichainClient for the specified chain.
 * 
 * This function fetches token balances from Alchemy API for the specified `address` on the specified `chainId`.
 * It then converts the balance data into an array of TokenInfo objects.
 * 
 * @param {AlchemyMultichainClient} alchemyClient - The AlchemyMultichainClient instance used to make API requests.
 * @param {number} chainId - The identifier of the blockchain chain.
 * @param {string} address - The address for which to retrieve token balances.
 * @returns {Promise<TokenInfo[] | undefined>} A Promise that resolves to an array of TokenInfo objects representing token balances for the specified address, or undefined if the balance data is unavailable.
 */
export async function getTokenBalances(alchemyClient: AlchemyMultichainClient | undefined, chainId: number | undefined, address: string):Promise<TokenInfo[] | undefined> {

    if(!alchemyClient || !chainId! || !address){
        return
    }

    const tokenBalanceAlchemy = await getTokenBalancesAlchemy(alchemyClient, chainId, address);

    if(!tokenBalanceAlchemy){
        return 
    }

    return await useConvertBalanceToTokenInfo(chainId,tokenBalanceAlchemy);
}


const useConvertBalanceToTokenInfo = async (chainId: number, tokensBalance: TokenBalance[]): Promise<TokenInfo[]> => {
    const tokens = await getLifiTokens(chainId);

    const filteredTokensWithBalance: TokenInfo[] = tokens
        .filter(token => tokensBalance.some(tb => tb.contractAddress.toLowerCase() === token.address.toLowerCase()))
        .map(token => {
            const balanceData = tokensBalance.find(tb => tb.contractAddress.toLowerCase() === token.address.toLowerCase());
            return {
                ...token,
                balance: balanceData ? BigNumber.from(balanceData.tokenBalance) : BigNumber.from(0)
            };
        });

    return filteredTokensWithBalance

}

