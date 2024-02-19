import { BigNumber } from "ethers";

export type TokenInfo = {
    address: string;
    chainId: number;
    symbol: string;
    decimals: number;
    name: string;
    coinKey: string; //lifi
    coinGeckoId?: string; //coingecko
    logoURI: string;
    priceUSD: string;
    balance?: BigNumber;
}

export type MarketData = {
    price: number;
    marketCap: number;
    volumen24: number;
}

export type TokenData = {
    token: TokenInfo;
    tokenData: MarketData | undefined;
}


//Rebalance
export interface RebalanceSwap {
    tokenIn: string;
    amountIn: string;
    tokenOut: string;
}

export interface TokenInfoRebalanceInput extends TokenInfo {
    percentage: number;
}