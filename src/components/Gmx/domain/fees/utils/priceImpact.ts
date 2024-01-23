import { BigNumber } from "ethers";
import { MarketInfo, getTokenPoolType } from "../../markets";
import { TokenData, getMidPrice, convertToUsd } from "../../tokens";
import { bigNumberify, expandDecimals, roundUpMagnitudeDivision } from "@/components/Gmx/lib/numbers";
import { convertToTokenAmount } from "../../tokens";


export function getPriceImpactForSwap(
    marketInfo: MarketInfo,
    tokenA: TokenData,
    tokenB: TokenData,
    usdDeltaTokenA: BigNumber,
    usdDeltaTokenB: BigNumber,
    opts: { fallbackToZero?: boolean } = {}
  ) {
    const tokenAPoolType = getTokenPoolType(marketInfo, tokenA.address);
    const tokenBPoolType = getTokenPoolType(marketInfo, tokenB.address);
  
    if (
      tokenAPoolType === undefined ||
      tokenBPoolType === undefined ||
      (tokenAPoolType === tokenBPoolType && !marketInfo.isSameCollaterals)
    ) {
      throw new Error(`Invalid tokens to swap ${marketInfo.marketTokenAddress} ${tokenA.address} ${tokenB.address}`);
    }
  
    const [longToken, shortToken] = tokenAPoolType === "long" ? [tokenA, tokenB] : [tokenB, tokenA];
    const [longDeltaUsd, shortDeltaUsd] =
      tokenAPoolType === "long" ? [usdDeltaTokenA, usdDeltaTokenB] : [usdDeltaTokenB, usdDeltaTokenA];
  
    const { longPoolUsd, shortPoolUsd, nextLongPoolUsd, nextShortPoolUsd } = getNextPoolAmountsParams({
      marketInfo,
      longToken,
      shortToken,
      longPoolAmount: marketInfo.longPoolAmount,
      shortPoolAmount: marketInfo.shortPoolAmount,
      longDeltaUsd,
      shortDeltaUsd,
    });
  
    const priceImpactUsd = getPriceImpactUsd({
      currentLongUsd: longPoolUsd,
      currentShortUsd: shortPoolUsd,
      nextLongUsd: nextLongPoolUsd,
      nextShortUsd: nextShortPoolUsd,
      factorPositive: marketInfo.swapImpactFactorPositive,
      factorNegative: marketInfo.swapImpactFactorNegative,
      exponentFactor: marketInfo.swapImpactExponentFactor,
      fallbackToZero: opts.fallbackToZero,
    });
  
    if (priceImpactUsd.gt(0)) {
      return priceImpactUsd;
    }
  
    const virtualInventoryLong = marketInfo.virtualPoolAmountForLongToken;
    const virtualInventoryShort = marketInfo.virtualPoolAmountForShortToken;
  
    if (!virtualInventoryLong.gt(0) || !virtualInventoryShort.gt(0)) {
      return priceImpactUsd;
    }
  
    const virtualInventoryParams = getNextPoolAmountsParams({
      marketInfo,
      longToken,
      shortToken,
      longPoolAmount: virtualInventoryLong,
      shortPoolAmount: virtualInventoryShort,
      longDeltaUsd,
      shortDeltaUsd,
    });
  
    const priceImpactUsdForVirtualInventory = getPriceImpactUsd({
      currentLongUsd: virtualInventoryParams.longPoolUsd,
      currentShortUsd: virtualInventoryParams.shortPoolUsd,
      nextLongUsd: virtualInventoryParams.nextLongPoolUsd,
      nextShortUsd: virtualInventoryParams.nextShortPoolUsd,
      factorPositive: marketInfo.swapImpactFactorPositive,
      factorNegative: marketInfo.swapImpactFactorNegative,
      exponentFactor: marketInfo.swapImpactExponentFactor,
      fallbackToZero: opts.fallbackToZero,
    });
  
    return priceImpactUsdForVirtualInventory.lt(priceImpactUsd!) ? priceImpactUsdForVirtualInventory : priceImpactUsd;
  }

  export function getNextPoolAmountsParams(p: {
    marketInfo: MarketInfo;
    longToken: TokenData;
    shortToken: TokenData;
    longPoolAmount: BigNumber;
    shortPoolAmount: BigNumber;
    longDeltaUsd: BigNumber;
    shortDeltaUsd: BigNumber;
  }) {
    const { marketInfo, longToken, shortToken, longPoolAmount, shortPoolAmount, longDeltaUsd, shortDeltaUsd } = p;
  
    const longPrice = getMidPrice(longToken.prices);
    const shortPrice = getMidPrice(shortToken.prices);
  
    const longPoolUsd = convertToUsd(longPoolAmount, longToken.decimals, longPrice)!;
    const shortPoolUsd = convertToUsd(shortPoolAmount, shortToken.decimals, shortPrice)!;
  
    const longPoolUsdAdjustment = convertToUsd(marketInfo.longPoolAmountAdjustment, longToken.decimals, longPrice)!;
    const shortPoolUsdAdjustment = convertToUsd(marketInfo.shortPoolAmountAdjustment, shortToken.decimals, shortPrice)!;
  
    const nextLongPoolUsd = longPoolUsd.add(longDeltaUsd).add(longPoolUsdAdjustment);
    const nextShortPoolUsd = shortPoolUsd.add(shortDeltaUsd).add(shortPoolUsdAdjustment);
  
    return {
      longPoolUsd,
      shortPoolUsd,
      nextLongPoolUsd,
      nextShortPoolUsd,
    };
  }

  /**
 * @see https://github.com/gmx-io/gmx-synthetics/blob/updates/contracts/pricing/SwapPricingUtils.sol
 */
export function getPriceImpactUsd(p: {
    currentLongUsd: BigNumber;
    currentShortUsd: BigNumber;
    nextLongUsd: BigNumber;
    nextShortUsd: BigNumber;
    factorPositive: BigNumber;
    factorNegative: BigNumber;
    exponentFactor: BigNumber;
    fallbackToZero?: boolean;
  }) {
    const { nextLongUsd, nextShortUsd } = p;
  
    if (nextLongUsd.lt(0) || nextShortUsd.lt(0)) {
      if (p.fallbackToZero) {
        return BigNumber.from(0);
      } else {
        throw new Error("Negative pool amount");
      }
    }
  
    const currentDiff = p.currentLongUsd.sub(p.currentShortUsd).abs();
    const nextDiff = nextLongUsd.sub(nextShortUsd).abs();
  
    const isSameSideRebalance = p.currentLongUsd.lt(p.currentShortUsd) === nextLongUsd.lt(nextShortUsd);
  
    let impactUsd: BigNumber;
  
    if (isSameSideRebalance) {
      const hasPositiveImpact = nextDiff.lt(currentDiff);
      const factor = hasPositiveImpact ? p.factorPositive : p.factorNegative;
  
      impactUsd = calculateImpactForSameSideRebalance({
        currentDiff,
        nextDiff,
        hasPositiveImpact,
        factor,
        exponentFactor: p.exponentFactor,
      });
    } else {
      impactUsd = calculateImpactForCrossoverRebalance({
        currentDiff,
        nextDiff,
        factorPositive: p.factorPositive,
        factorNegative: p.factorNegative,
        exponentFactor: p.exponentFactor,
      });
    }
  
    return impactUsd;
  }

  /**
 *  @see https://github.com/gmx-io/gmx-synthetics/blob/5fd9991ff2c37ae5f24f03bc9c132730b012ebf2/contracts/pricing/PricingUtils.sol
 */
export function calculateImpactForSameSideRebalance(p: {
    currentDiff: BigNumber;
    nextDiff: BigNumber;
    hasPositiveImpact: boolean;
    factor: BigNumber;
    exponentFactor: BigNumber;
  }) {
    const { currentDiff, nextDiff, hasPositiveImpact, factor, exponentFactor } = p;
  
    const currentImpact = applyImpactFactor(currentDiff, factor, exponentFactor);
    const nextImpact = applyImpactFactor(nextDiff, factor, exponentFactor);
  
    const deltaDiff = currentImpact.sub(nextImpact).abs();
  
    return hasPositiveImpact ? deltaDiff : BigNumber.from(0).sub(deltaDiff);
  }

  export function applyImpactFactor(diff: BigNumber, factor: BigNumber, exponent: BigNumber) {
    // Convert diff and exponent to float js numbers
    const _diff = Number(diff) / 10 ** 30;
    const _exponent = Number(exponent) / 10 ** 30;
  
    // Pow and convert back to BigNumber with 30 decimals
    let result = bigNumberify(BigInt(Math.round(_diff ** _exponent * 10 ** 30)))!;
  
    result = result.mul(factor).div(expandDecimals(1, 30));
  
    return result;
  }

  /**
 *  @see  https://github.com/gmx-io/gmx-synthetics/blob/5fd9991ff2c37ae5f24f03bc9c132730b012ebf2/contracts/pricing/PricingUtils.sol
 */
export function calculateImpactForCrossoverRebalance(p: {
    currentDiff: BigNumber;
    nextDiff: BigNumber;
    factorPositive: BigNumber;
    factorNegative: BigNumber;
    exponentFactor: BigNumber;
  }) {
    const { currentDiff, nextDiff, factorNegative, factorPositive, exponentFactor } = p;
  
    const positiveImpact = applyImpactFactor(currentDiff, factorPositive, exponentFactor);
    const negativeImpactUsd = applyImpactFactor(nextDiff, factorNegative, exponentFactor);
  
    const deltaDiffUsd = positiveImpact.sub(negativeImpactUsd).abs();
  
    return positiveImpact.gt(negativeImpactUsd) ? deltaDiffUsd : BigNumber.from(0).sub(deltaDiffUsd);
  }

  export function applySwapImpactWithCap(marketInfo: MarketInfo, token: TokenData, priceImpactDeltaUsd: BigNumber) {
    const tokenPoolType = getTokenPoolType(marketInfo, token.address);
  
    if (!tokenPoolType) {
      throw new Error(`Token ${token.address} is not a collateral of the market ${marketInfo.marketTokenAddress}`);
    }
  
    const isLongCollateral = tokenPoolType === "long";
    const price = priceImpactDeltaUsd.gt(0) ? token.prices.maxPrice : token.prices.minPrice;
  
    let impactDeltaAmount: BigNumber;
  
    if (priceImpactDeltaUsd.gt(0)) {
      // round positive impactAmount down, this will be deducted from the swap impact pool for the user
      impactDeltaAmount = convertToTokenAmount(priceImpactDeltaUsd, token.decimals, price)!;
  
      const maxImpactAmount = isLongCollateral
        ? marketInfo.swapImpactPoolAmountLong
        : marketInfo.swapImpactPoolAmountShort;
  
      if (impactDeltaAmount.gt(maxImpactAmount)) {
        impactDeltaAmount = maxImpactAmount;
      }
    } else {
      // round negative impactAmount up, this will be deducted from the user
      impactDeltaAmount = roundUpMagnitudeDivision(priceImpactDeltaUsd.mul(expandDecimals(1, token.decimals)), price);
    }
  
    return impactDeltaAmount;
  }

  

  