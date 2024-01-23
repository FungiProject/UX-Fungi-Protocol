import { NATIVE_TOKEN_ADDRESS } from "../../config/tokens";
import { TokenPrices, TokensData, InfoTokens, TokenData, TokenInfo } from "./types";
import { BigNumber } from "ethers";
import { expandDecimals } from "../../lib/numbers";

export function getTokenData(tokensData?: TokensData, address?: string, convertTo?: "wrapped" | "native") {
  if (!address || !tokensData?.[address]) {
    return undefined;
  }

  const token = tokensData[address];

  if (convertTo === "wrapped" && token.isNative && token.wrappedAddress) {
    return tokensData[token.wrappedAddress];
  }

  if (convertTo === "native" && token.isWrapped) {
    return tokensData[NATIVE_TOKEN_ADDRESS];
  }

  return token;
}

export function convertToContractPrice(price: BigNumber, tokenDecimals: number) {
    return price.div(expandDecimals(1, tokenDecimals));
  }

export function convertToContractTokenPrices(prices: TokenPrices, tokenDecimals: number) {
    return {
      min: convertToContractPrice(prices.minPrice, tokenDecimals),
      max: convertToContractPrice(prices.maxPrice, tokenDecimals),
    };
}

export function parseContractPrice(price: BigNumber, tokenDecimals: number) {
  return price.mul(expandDecimals(1, tokenDecimals));
}

export function convertToUsd(
  tokenAmount: BigNumber | undefined,
  tokenDecimals: number | undefined,
  price: BigNumber | undefined
) {
  if (!tokenAmount || typeof tokenDecimals !== "number" || !price) {
    return undefined;
  }

  return tokenAmount.mul(price).div(expandDecimals(1, tokenDecimals));
}

export function getMidPrice(prices: TokenPrices) {
  return prices.minPrice.add(prices.maxPrice).div(2);
}

export function convertToTokenAmount(
  usd: BigNumber | undefined,
  tokenDecimals: number | undefined,
  price: BigNumber | undefined
) {
  if (!usd || typeof tokenDecimals !== "number" || !price?.gt(0)) {
    return undefined;
  }

  return usd.mul(expandDecimals(1, tokenDecimals)).div(price);
}

/**
 * Used to adapt Synthetics tokens to InfoTokens where it's possible
 */
export function adaptToV1InfoTokens(tokensData: TokensData): InfoTokens {
  const infoTokens = Object.keys(tokensData).reduce((acc, address) => {
    const tokenData = getTokenData(tokensData, address)!;

    acc[address] = adaptToV1TokenInfo(tokenData);

    return acc;
  }, {} as InfoTokens);

  return infoTokens;
}

/**
 * Used to adapt Synthetics tokens to InfoTokens where it's possible
 */
export function adaptToV1TokenInfo(tokenData: TokenData): TokenInfo {
  return {
    ...tokenData,
    minPrice: tokenData.prices?.minPrice,
    maxPrice: tokenData.prices?.maxPrice,
  };
}
