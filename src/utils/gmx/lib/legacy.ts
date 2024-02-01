import { ethers } from "ethers";
import { bigNumberify, expandDecimals, formatAmount } from "./numbers";
import { isLocal } from "../config/env";
import { getContract } from "../config/contracts";
import { CHAIN_ID } from "../config/chains";

export const USDG_ADDRESS = getContract(CHAIN_ID, "USDG");
export const USD_DECIMALS = 30;
export const PRECISION = expandDecimals(1, 30);
export const DUST_BNB = "2000000000000000";
export const DEFAULT_MAX_USDG_AMOUNT = expandDecimals(200 * 1000 * 1000, 18);
export const MAX_PRICE_DEVIATION_BASIS_POINTS = 750;
export const REFERRAL_CODE_QUERY_PARAM = "ref";
export const MAX_REFERRAL_CODE_LENGTH = 20;
export const DUST_USD = expandDecimals(1, USD_DECIMALS);
export const MINT_BURN_FEE_BASIS_POINTS = 25;
export const MARKET = "Market";
export const TAX_BASIS_POINTS = 60;
export const USDG_DECIMALS = 18;

export function isAddressZero(value) {
  return value === ethers.constants.AddressZero;
}

export function isHashZero(value) {
  return value === ethers.constants.HashZero;
}

export function adjustForDecimals(amount, divDecimals, mulDecimals) {
  return amount
    .mul(expandDecimals(1, mulDecimals))
    .div(expandDecimals(1, divDecimals));
}

export function getFeeBasisPoints(
  token,
  tokenUsdgAmount,
  usdgDelta,
  feeBasisPoints,
  taxBasisPoints,
  increment,
  usdgSupply,
  totalTokenWeights
) {
  if (!token || !tokenUsdgAmount || !usdgSupply || !totalTokenWeights) {
    return 0;
  }

  feeBasisPoints = bigNumberify(feeBasisPoints);
  taxBasisPoints = bigNumberify(taxBasisPoints);

  const initialAmount = tokenUsdgAmount;
  let nextAmount = initialAmount.add(usdgDelta);
  if (!increment) {
    nextAmount = usdgDelta.gt(initialAmount)
      ? bigNumberify(0)
      : initialAmount.sub(usdgDelta);
  }

  const targetAmount = getTargetUsdgAmount(
    token,
    usdgSupply,
    totalTokenWeights
  );
  if (!targetAmount || targetAmount.eq(0)) {
    return feeBasisPoints.toNumber();
  }

  const initialDiff = initialAmount.gt(targetAmount)
    ? initialAmount.sub(targetAmount)
    : targetAmount.sub(initialAmount);
  const nextDiff = nextAmount.gt(targetAmount)
    ? nextAmount.sub(targetAmount)
    : targetAmount.sub(nextAmount);

  if (nextDiff.lt(initialDiff)) {
    const rebateBps = taxBasisPoints.mul(initialDiff).div(targetAmount);
    return rebateBps.gt(feeBasisPoints)
      ? 0
      : feeBasisPoints.sub(rebateBps).toNumber();
  }

  let averageDiff = initialDiff.add(nextDiff).div(2);
  if (averageDiff.gt(targetAmount)) {
    averageDiff = targetAmount;
  }
  const taxBps = taxBasisPoints.mul(averageDiff).div(targetAmount);
  return feeBasisPoints.add(taxBps).toNumber();
}

export function getTargetUsdgAmount(token, usdgSupply, totalTokenWeights) {
  if (!token || !token.weight || !usdgSupply) {
    return;
  }

  if (usdgSupply.eq(0)) {
    return bigNumberify(0);
  }

  return token.weight.mul(usdgSupply).div(totalTokenWeights);
}

export function getPageTitle(data) {
  const title = `Decentralized Perpetual Exchange | GMX`;
  return `${data} | ${title}`;
}

export function getHomeUrl() {
  if (isLocal()) {
    return "http://localhost:3010";
  }

  return "https://gmx.io";
}

export function getRootShareApiUrl() {
  if (isLocal()) {
    return "https://gmxs.vercel.app";
  }

  return "https://share.gmx.io";
}

export function getExchangeRate(tokenAInfo, tokenBInfo, inverted) {
  if (
    !tokenAInfo ||
    !tokenAInfo.minPrice ||
    !tokenBInfo ||
    !tokenBInfo.maxPrice
  ) {
    return;
  }
  if (inverted) {
    return tokenAInfo.minPrice.mul(PRECISION).div(tokenBInfo.maxPrice);
  }
  return tokenBInfo.maxPrice.mul(PRECISION).div(tokenAInfo.minPrice);
}

export function shouldInvertTriggerRatio(tokenA, tokenB) {
  if (tokenB.isStable || tokenB.isUsdg) return true;
  if (tokenB.maxPrice && tokenA.maxPrice && tokenB.maxPrice.lt(tokenA.maxPrice))
    return true;
  return false;
}

export function getExchangeRateDisplay(
  rate,
  tokenA,
  tokenB,
  opts: { omitSymbols?: boolean } = {}
) {
  if (!rate || !tokenA || !tokenB) return "...";
  if (shouldInvertTriggerRatio(tokenA, tokenB)) {
    [tokenA, tokenB] = [tokenB, tokenA];
    rate = PRECISION.mul(PRECISION).div(rate);
  }
  const rateValue = formatAmount(
    rate,
    USD_DECIMALS,
    tokenA.isStable || tokenA.isUsdg ? 2 : 4,
    true
  );
  if (opts.omitSymbols) {
    return rateValue;
  }
  return `${rateValue} ${tokenA.symbol} / ${tokenB.symbol}`;
}

export function getTwitterIntentURL(text, url = "", hashtag = "") {
  let finalURL = "https://twitter.com/intent/tweet?text=";
  if (text.length > 0) {
    finalURL += Array.isArray(text)
      ? text.map((t) => encodeURIComponent(t)).join("%0a%0a")
      : encodeURIComponent(text);
    if (hashtag.length > 0) {
      finalURL += "&hashtags=" + encodeURIComponent(hashtag.replace(/#/g, ""));
    }
    if (url.length > 0) {
      finalURL += "&url=" + encodeURIComponent(url);
    }
  }
  return finalURL;
}

export function importImage(name) {
  let tokenImage = "";

  try {
    tokenImage = require("src/img/" + name); //TODO fungi
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return tokenImage;
}

export const CHART_PERIODS = {
  "1m": 60,
  "5m": 60 * 5,
  "15m": 60 * 15,
  "1h": 60 * 60,
  "4h": 60 * 60 * 4,
  "1d": 60 * 60 * 24,
};
