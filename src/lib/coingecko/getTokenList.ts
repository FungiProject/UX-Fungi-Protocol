import axios from "axios"
import { CoinGeckoToken } from "./types";
import { getCoinGeckoChainByChainId } from "./utils";


export async function getTokenList(): Promise<CoinGeckoToken[]> {
    try{
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/list?include_platform=true`);
        
        return response.data;
       
    } catch(error){
        console.error(error)
        return []
    }
}

export async function getCoinGeckoTokensId(chainId: number, address: string[]) {
    const coingeckoChain = getCoinGeckoChainByChainId(chainId);

    if (!coingeckoChain) {
        return []
    }

    const tokenList = await getTokenList();

    const filteredTokens = tokenList.filter(token =>
        address.some(a =>
            (token.platforms[coingeckoChain]?.toLowerCase() || '') === a.toLowerCase()
        )
    );

    const coinGeckoIds = {};
    filteredTokens.forEach(token => {
        const lowercaseKey = token.platforms[coingeckoChain]?.toLowerCase() || '';
        coinGeckoIds[lowercaseKey] = token.id;
    });
    
    return coinGeckoIds;

}
