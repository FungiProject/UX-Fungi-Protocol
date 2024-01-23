import { BigNumber } from "alchemy-sdk";

export type FeeItem = {
    deltaUsd: BigNumber;
    bps: BigNumber;
  };

export type GmSwapFees = {
    totalFees?: FeeItem;
    swapFee?: FeeItem;
    swapPriceImpact?: FeeItem;
    uiFee?: FeeItem;
};

export type DepositAmounts = {
    marketTokenAmount: BigNumber;
    marketTokenUsd: BigNumber;
    longTokenAmount: BigNumber;
    longTokenUsd: BigNumber;
    shortTokenAmount: BigNumber;
    shortTokenUsd: BigNumber;
    swapFeeUsd: BigNumber;
    uiFeeUsd: BigNumber;
    swapPriceImpactDeltaUsd: BigNumber;
};

export type WitdhrawalAmounts = {
    marketTokenAmount: BigNumber;
    marketTokenUsd: BigNumber;
    longTokenAmount: BigNumber;
    shortTokenAmount: BigNumber;
    longTokenUsd: BigNumber;
    shortTokenUsd: BigNumber;
    swapFeeUsd: BigNumber;
    uiFeeUsd: BigNumber;
    swapPriceImpactDeltaUsd: BigNumber;
  };