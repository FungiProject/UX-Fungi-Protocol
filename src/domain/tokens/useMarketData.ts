import { TokenInfo, TokenData } from "./types";
import { getCoinGeckoTokensId } from "@/lib/coingecko/getTokenList";
import { getTokensMarketData} from "@/lib/coingecko/getMarketData";


export async function fillCoinGeckoTokenId(chainId: number, tokens: TokenInfo[]) {

    const coingeckoIds = await getCoinGeckoTokensId(chainId, tokens.map(token => token.address));

    tokens.forEach(token => {
        token.coinGeckoId = coingeckoIds[token.address.toLowerCase()] || '';
    });

    return tokens;
}

export async function getTokenMarketData(chainId: number, tokens: TokenInfo[]){
    await fillCoinGeckoTokenId(chainId,tokens); //TODO deberia llamarse cuando se forma el tokenInfo

    const coingeckoIds = tokens.map(token=>token.coinGeckoId)

    if (coingeckoIds.length === 0) {
        return;
    }

    const coingeckoIdsClean = tokens.map(token => token.coinGeckoId)
    .filter(id => id !== '' && id !== null && id !== undefined);

    const tokensDataCoinGecko =  await getTokensMarketData(coingeckoIdsClean)

    const tokensData: TokenData[] = []

    if(tokensDataCoinGecko){
        tokens.forEach(token =>{
            const tokenDataCG = tokensDataCoinGecko.find(t => t.id === token.coinGeckoId);
            
            let newToken: TokenData = {token: token, tokenData: undefined}

            if(tokenDataCG && newToken) {
                newToken.tokenData = {
                    price: tokenDataCG.current_price,
                    marketCap: tokenDataCG.market_cap,
                    volumen24: tokenDataCG.total_volume,
                }
            }
            tokensData.push(newToken)
        })
    }

    return tokensData

}



