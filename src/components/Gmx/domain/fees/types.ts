import { BigNumber } from "ethers";
import { Token } from "../tokens";

export type ExecutionFee = {
  feeUsd: BigNumber;
  feeTokenAmount: BigNumber;
  feeToken: Token;
  warning?: string;
};

export type FeeItem = {
    deltaUsd: BigNumber;
    bps: BigNumber;
};

export type GasLimitsConfig = {
  depositSingleToken: BigNumber;
  depositMultiToken: BigNumber;
  withdrawalMultiToken: BigNumber;
  singleSwap: BigNumber;
  swapOrder: BigNumber;
  increaseOrder: BigNumber;
  decreaseOrder: BigNumber;
  estimatedFeeBaseGasLimit: BigNumber;
  estimatedFeeMultiplierFactor: BigNumber;
};