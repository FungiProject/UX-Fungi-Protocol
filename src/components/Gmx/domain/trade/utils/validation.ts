import { BigNumber } from "ethers";
import { MarketInfo, getMintableMarketTokens } from "../../markets";
import { TokenData } from "../../tokens";
import { GmSwapFees } from "../types";
import { IS_NETWORK_DISABLED, getChainName } from "@/components/Gmx/config/chains";

export type ValidationTooltipName = "maxLeverage";
export type ValidationResult =
  | [errorMessage: undefined]
  | [errorMessage: string]
  | [errorMessage: string, tooltipName: ValidationTooltipName];


export function getGmSwapError(p: {
  isDeposit: boolean;
  marketInfo: MarketInfo | undefined;
  marketToken: TokenData | undefined;
  longToken: TokenData | undefined;
  shortToken: TokenData | undefined;
  longTokenAmount: BigNumber | undefined;
  shortTokenAmount: BigNumber | undefined;
  longTokenUsd: BigNumber | undefined;
  shortTokenUsd: BigNumber | undefined;
  marketTokenAmount: BigNumber | undefined;
  marketTokenUsd: BigNumber | undefined;
  longTokenLiquidityUsd: BigNumber | undefined;
  shortTokenLiquidityUsd: BigNumber | undefined;
  fees: GmSwapFees | undefined;
  isHighPriceImpact: boolean;
  isHighPriceImpactAccepted: boolean;
}) {
  const {
    isDeposit,
    marketInfo,
    marketToken,
    longToken,
    shortToken,
    longTokenAmount,
    shortTokenAmount,
    longTokenUsd,
    shortTokenUsd,
    marketTokenAmount,
    marketTokenUsd,
    longTokenLiquidityUsd,
    shortTokenLiquidityUsd,
    fees,
    isHighPriceImpact,
    isHighPriceImpactAccepted,
  } = p;

  if (!marketInfo || !marketToken) {
    return [`Loading...`];
  }

  if (isHighPriceImpact && !isHighPriceImpactAccepted) {
    return [`Price Impact not yet acknowledged`];
  }

  if (isDeposit) {
    const totalCollateralUsd = BigNumber.from(0)
      .add(longTokenUsd || 0)
      .add(shortTokenUsd || 0);

    const mintableInfo = getMintableMarketTokens(marketInfo, marketToken);

    if (fees?.totalFees?.deltaUsd.lt(0) && fees.totalFees.deltaUsd.abs().gt(totalCollateralUsd)) {
      return [`Fees exceed Pay amount`];
    }

    if (longTokenAmount?.gt(mintableInfo.longDepositCapacityAmount)) {
      return [`Max ${longToken?.symbol} amount exceeded`];
    }

    if (shortTokenAmount?.gt(mintableInfo.shortDepositCapacityAmount)) {
      return [`Max ${shortToken?.symbol} amount exceeded`];
    }
  } else if (fees?.totalFees?.deltaUsd.lt(0) && fees.totalFees.deltaUsd.abs().gt(marketTokenUsd || BigNumber.from(0))) {
    return [`Fees exceed Pay amount`];
  }

  if (longTokenAmount?.lt(0) || shortTokenAmount?.lt(0) || marketTokenAmount?.lt(0)) {
    return [`Amount should be greater than zero`];
  }

  if (!marketTokenAmount?.gt(0)) {
    return [`Enter an amount`];
  }

  if (isDeposit) {
    if (longTokenAmount?.gt(longToken?.balance || 0)) {
      return [`Insufficient ${longToken?.symbol} balance`];
    }

    if (shortTokenAmount?.gt(shortToken?.balance || 0)) {
      return [`Insufficient ${shortToken?.symbol} balance`];
    }
  } else {
    if (marketTokenAmount.gt(marketToken?.balance || 0)) {
      return [`Insufficient ${marketToken?.symbol} balance`];
    }

    if (longTokenUsd?.gt(longTokenLiquidityUsd || 0)) {
      return [`Insufficient ${longToken?.symbol} liquidity`];
    }

    if (shortTokenUsd?.gt(shortTokenLiquidityUsd || 0)) {
      return [`Insufficient ${shortToken?.symbol} liquidity`];
    }
  }

  return [undefined];
}

export function getCommonError(p: { chainId: number; isConnected: boolean; hasOutdatedUi: boolean }): ValidationResult {
  const { chainId, isConnected, hasOutdatedUi } = p;

  if (IS_NETWORK_DISABLED[chainId]) {
    return [`App disabled, pending ${getChainName(chainId)} upgrade`];
  }

  if (hasOutdatedUi) {
    return [`Page outdated, please refresh`];
  }

  if (!isConnected) {
    return [`Connect Wallet`];
  }

  return [undefined];
}