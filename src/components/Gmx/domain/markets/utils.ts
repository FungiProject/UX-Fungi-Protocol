import { getByKey } from "../../lib/objects";
import { TokensData, TokenData, TokenPrices, Token, convertToUsd, getMidPrice, convertToTokenAmount } from "../tokens";
import { BigNumber } from "ethers";
import { expandDecimals } from "../../lib/numbers"
import { USD_DECIMALS, PRECISION } from "../../lib/legacy"
import { ContractMarketPrices, Market, MarketInfo } from "./types";
import { NATIVE_TOKEN_ADDRESS } from "../../config/tokens";

export function getMarketFullName(p: { longToken: Token; shortToken: Token; indexToken: Token; isSpotOnly: boolean }) {
  const { indexToken, longToken, shortToken, isSpotOnly } = p;

  return `${getMarketIndexName({ indexToken, isSpotOnly })} [${getMarketPoolName({ longToken, shortToken })}]`;
}

export function getMarketIndexName(p: { indexToken: Token; isSpotOnly: boolean }) {
  const { indexToken, isSpotOnly } = p;

  if (isSpotOnly) {
    return `SWAP-ONLY`;
  }

  return `${indexToken.baseSymbol || indexToken.symbol}/USD`;
}

export function getMarketPoolName(p: { longToken: Token; shortToken: Token }) {
  const { longToken, shortToken } = p;

  if (longToken.address === shortToken.address) {
    return longToken.symbol;
  }

  return `${longToken.symbol}-${shortToken.symbol}`;
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

export function getContractMarketPrices(tokensData: TokensData, market: Market): ContractMarketPrices | undefined {
  const indexToken = getByKey(tokensData, market.indexTokenAddress);
  const longToken = getByKey(tokensData, market.longTokenAddress);
  const shortToken = getByKey(tokensData, market.shortTokenAddress);

  if (!indexToken || !longToken || !shortToken) {
    return undefined;
  }

  return {
    indexTokenPrice: convertToContractTokenPrices(indexToken.prices, indexToken.decimals),
    longTokenPrice: convertToContractTokenPrices(longToken.prices, longToken.decimals),
    shortTokenPrice: convertToContractTokenPrices(shortToken.prices, shortToken.decimals),
  };
}

export function getDepositCollateralCapacityAmount(marketInfo: MarketInfo, isLong: boolean) {
  const poolAmount = isLong ? marketInfo.longPoolAmount : marketInfo.shortPoolAmount;
  const maxPoolAmount = getMaxPoolAmountForDeposit(marketInfo, isLong);

  const capacityAmount = maxPoolAmount.sub(poolAmount);

  return capacityAmount.gt(0) ? capacityAmount : BigNumber.from(0);
}

export function getMaxPoolAmountForDeposit(marketInfo: MarketInfo, isLong: boolean) {
  const maxAmountForDeposit = isLong ? marketInfo.maxLongPoolAmountForDeposit : marketInfo.maxShortPoolAmountForDeposit;
  const maxAmountForSwap = isLong ? marketInfo.maxLongPoolAmount : marketInfo.maxShortPoolAmount;

  return maxAmountForDeposit.lt(maxAmountForSwap) ? maxAmountForDeposit : maxAmountForSwap;
}

export function getMintableMarketTokens(marketInfo: MarketInfo, marketToken: TokenData) {
  const longDepositCapacityAmount = getDepositCollateralCapacityAmount(marketInfo, true);
  const shortDepositCapacityAmount = getDepositCollateralCapacityAmount(marketInfo, false);

  const longDepositCapacityUsd = getDepositCollateralCapacityUsd(marketInfo, true);
  const shortDepositCapacityUsd = getDepositCollateralCapacityUsd(marketInfo, false);

  const mintableUsd = longDepositCapacityUsd.add(shortDepositCapacityUsd);
  const mintableAmount = usdToMarketTokenAmount(marketInfo, marketToken, mintableUsd);

  return {
    mintableAmount,
    mintableUsd,
    longDepositCapacityUsd,
    shortDepositCapacityUsd,
    longDepositCapacityAmount,
    shortDepositCapacityAmount,
  };
}

export function usdToMarketTokenAmount(marketInfo: MarketInfo, marketToken: TokenData, usdValue: BigNumber) {
  const supply = marketToken.totalSupply!;
  const poolValue = marketInfo.poolValueMax!;
  // if the supply and poolValue is zero, use 1 USD as the token price
  if (supply.eq(0) && poolValue.eq(0)) {
    return convertToTokenAmount(usdValue, marketToken.decimals, expandDecimals(1, USD_DECIMALS))!;
  }

  // if the supply is zero and the poolValue is more than zero,
  // then include the poolValue for the amount of tokens minted so that
  // the market token price after mint would be 1 USD
  if (supply.eq(0) && poolValue.gt(0)) {
    return convertToTokenAmount(usdValue.add(poolValue), marketToken.decimals, expandDecimals(1, USD_DECIMALS))!;
  }

  if (poolValue.eq(0)) {
    return BigNumber.from(0);
  }

  return supply.mul(usdValue).div(poolValue);
}

export function getMaxPoolUsdForDeposit(marketInfo: MarketInfo, isLong: boolean) {
  const token = isLong ? marketInfo.longToken : marketInfo.shortToken;
  const maxPoolAmount = getMaxPoolAmountForDeposit(marketInfo, isLong);

  return convertToUsd(maxPoolAmount, token.decimals, getMidPrice(token.prices))!;
}

export function getDepositCollateralCapacityUsd(marketInfo: MarketInfo, isLong: boolean) {
  const poolUsd = getPoolUsdWithoutPnl(marketInfo, isLong, "midPrice");
  const maxPoolUsd = getMaxPoolUsdForDeposit(marketInfo, isLong);

  const capacityUsd = maxPoolUsd.sub(poolUsd);

  return capacityUsd.gt(0) ? capacityUsd : BigNumber.from(0);
}

export function getPoolUsdWithoutPnl(
  marketInfo: MarketInfo,
  isLong: boolean,
  priceType: "minPrice" | "maxPrice" | "midPrice"
) {
  const poolAmount = isLong ? marketInfo.longPoolAmount : marketInfo.shortPoolAmount;
  const token = isLong ? marketInfo.longToken : marketInfo.shortToken;

  let price: BigNumber;

  if (priceType === "minPrice") {
    price = token.prices?.minPrice;
  } else if (priceType === "maxPrice") {
    price = token.prices?.maxPrice;
  } else {
    price = getMidPrice(token.prices);
  }

  return convertToUsd(poolAmount, token.decimals, price)!;
}

export function getSellableMarketToken(marketInfo: MarketInfo, marketToken: TokenData) {
  const { longToken, shortToken, longPoolAmount, shortPoolAmount } = marketInfo;
  const longPoolUsd = convertToUsd(longPoolAmount, longToken.decimals, longToken.prices.maxPrice)!;
  const shortPoolUsd = convertToUsd(shortPoolAmount, shortToken.decimals, shortToken.prices.maxPrice)!;
  const longCollateralLiquidityUsd = getAvailableUsdLiquidityForCollateral(marketInfo, true);
  const shortCollateralLiquidityUsd = getAvailableUsdLiquidityForCollateral(marketInfo, false);

  const factor = expandDecimals(1, 8);

  if (
    longPoolUsd.isZero() ||
    shortPoolUsd.isZero() ||
    longCollateralLiquidityUsd.isZero() ||
    shortCollateralLiquidityUsd.isZero()
  ) {
    return {
      maxLongSellableUsd: BigNumber.from(0),
      maxShortSellableUsd: BigNumber.from(0),
      total: BigNumber.from(0),
    };
  }

  const ratio = longPoolUsd.mul(factor).div(shortPoolUsd);
  let maxLongSellableUsd: BigNumber;
  let maxShortSellableUsd: BigNumber;

  if (shortCollateralLiquidityUsd.mul(ratio).div(factor).lte(longCollateralLiquidityUsd)) {
    maxLongSellableUsd = shortCollateralLiquidityUsd.mul(ratio).div(factor);
    maxShortSellableUsd = shortCollateralLiquidityUsd;
  } else {
    maxLongSellableUsd = longCollateralLiquidityUsd;
    maxShortSellableUsd = longCollateralLiquidityUsd.div(ratio).mul(factor);
  }

  const maxLongSellableAmount = usdToMarketTokenAmount(marketInfo, marketToken, maxLongSellableUsd);
  const maxShortSellableAmount = usdToMarketTokenAmount(marketInfo, marketToken, maxShortSellableUsd);

  return {
    maxLongSellableUsd,
    maxShortSellableUsd,
    maxLongSellableAmount,
    maxShortSellableAmount,
    totalUsd: maxLongSellableUsd.add(maxShortSellableUsd),
    totalAmount: maxLongSellableAmount.add(maxShortSellableAmount),
  };
}

export function getAvailableUsdLiquidityForCollateral(marketInfo: MarketInfo, isLong: boolean) {
  const poolUsd = getPoolUsdWithoutPnl(marketInfo, isLong, "minPrice");

  if (marketInfo.isSpotOnly) {
    return poolUsd;
  }

  const reservedUsd = getReservedUsd(marketInfo, isLong);
  const maxReserveFactor = isLong ? marketInfo.reserveFactorLong : marketInfo.reserveFactorShort;

  if (maxReserveFactor.eq(0)) {
    return BigNumber.from(0);
  }

  const minPoolUsd = reservedUsd.mul(PRECISION).div(maxReserveFactor);

  const liqudiity = poolUsd.sub(minPoolUsd);

  return liqudiity;
}

export function getReservedUsd(marketInfo: MarketInfo, isLong: boolean) {
  const { indexToken } = marketInfo;

  if (isLong) {
    return convertToUsd(marketInfo.longInterestInTokens, marketInfo.indexToken.decimals, indexToken.prices.maxPrice)!;
  } else {
    return marketInfo.shortInterestUsd;
  }
}

export function getTokenPoolType(marketInfo: MarketInfo, tokenAddress: string) {
  const { longToken, shortToken } = marketInfo;

  if (tokenAddress === longToken.address || (tokenAddress === NATIVE_TOKEN_ADDRESS && longToken.isWrapped)) {
    return "long";
  }

  if (tokenAddress === shortToken.address || (tokenAddress === NATIVE_TOKEN_ADDRESS && shortToken.isWrapped)) {
    return "short";
  }

  return undefined;
}

export function marketTokenAmountToUsd(marketInfo: MarketInfo, marketToken: TokenData, amount: BigNumber) {
  const supply = marketToken.totalSupply!;
  const poolValue = marketInfo.poolValueMax!;

  const price = supply.eq(0)
    ? expandDecimals(1, USD_DECIMALS)
    : poolValue.mul(expandDecimals(1, marketToken.decimals)).div(supply);

  return convertToUsd(amount, marketToken.decimals, price)!;
}


