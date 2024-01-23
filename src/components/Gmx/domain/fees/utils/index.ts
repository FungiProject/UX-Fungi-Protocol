import { MarketInfo } from "../../markets";
import { BigNumber } from "ethers";
import { applyFactor, getBasisPoints } from "@/components/Gmx/lib/numbers";
import { FeeItem } from "../types";

export * from "./priceImpact";
export * from "./executionFee";

export function getSwapFee(marketInfo: MarketInfo, swapAmount: BigNumber, forPositiveImpact: boolean) {
    const factor = forPositiveImpact
      ? marketInfo.swapFeeFactorForPositiveImpact
      : marketInfo.swapFeeFactorForNegativeImpact;
  
    return applyFactor(swapAmount, factor);
}

export function getFeeItem(
  feeDeltaUsd?: BigNumber,
  basis?: BigNumber,
  opts: { shouldRoundUp?: boolean } = {}
): FeeItem | undefined {
  const { shouldRoundUp = false } = opts;
  if (!feeDeltaUsd) return undefined;

  return {
    deltaUsd: feeDeltaUsd,
    bps: basis?.gt(0) ? getBasisPoints(feeDeltaUsd, basis, shouldRoundUp) : BigNumber.from(0),
  };
}

export function getTotalFeeItem(feeItems: (FeeItem | undefined)[]): FeeItem {
  const totalFeeItem: FeeItem = {
    deltaUsd: BigNumber.from(0),
    bps: BigNumber.from(0),
  };

  (feeItems.filter(Boolean) as FeeItem[]).forEach((feeItem) => {
    totalFeeItem.deltaUsd = totalFeeItem.deltaUsd.add(feeItem.deltaUsd);
    totalFeeItem.bps = totalFeeItem.bps.add(feeItem.bps);
  });

  return totalFeeItem;
}