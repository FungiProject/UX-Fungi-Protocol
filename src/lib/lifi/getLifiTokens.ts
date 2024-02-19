import axios from "axios";
import { TokenInfo } from "@/domain/tokens/types";
import { getChainIdLifi } from "./getChainIdLifi";

/**
 * Retrieves the list of tokens supported by LifI on the specified chain.
 * 
 * @param {number} chainId - The identifier of the blockchain chain.
 * @returns {Promise<TokenInfo[]>} A Promise that resolves to an array of TokenInfo objects representing the supported tokens.
 */
export const getLifiTokens = async ( chainId: number): Promise<TokenInfo[]> => {
  
    const result = await axios.get(
         `https://li.quest/v1/tokens?chains=${getChainIdLifi(chainId)}`
     );
 
     return result.data.tokens[chainId]
 
 };