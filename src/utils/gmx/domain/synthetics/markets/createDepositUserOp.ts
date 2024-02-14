import { getContract } from "@/utils/gmx/config/contracts";
import ExchangeRouter from "@/../abis/ExchangeRouter.json";
import { ethers, BigNumber, Signer } from "ethers";
import { UI_FEE_RECEIVER_ACCOUNT } from "@/utils/gmx/config/ui";
import { applySlippageToMinOut } from "../trade";
import {
  NATIVE_TOKEN_ADDRESS,
  convertTokenAddress,
} from "../../../config/tokens";
import { UserOperation } from "@/utils/gmx/lib/userOperations/types";

type Params = {
  account: string;
  initialLongTokenAddress: string;
  initialShortTokenAddress: string;
  longTokenSwapPath: string[];
  shortTokenSwapPath: string[];
  marketTokenAddress: string;
  longTokenAmount: BigNumber;
  shortTokenAmount: BigNumber;
  minMarketTokens: BigNumber;
  executionFee: BigNumber;
  allowedSlippage: number;
};

export async function createDepositUserOp(
  chainId: number,
  p: Params
): Promise<UserOperation> {
  const contract = new ethers.Contract(
    getContract(chainId, "ExchangeRouter"),
    ExchangeRouter.abi
  );

  const depositVaultAddress = getContract(chainId, "DepositVault");

  const isNativeLongDeposit =
    p.initialLongTokenAddress === NATIVE_TOKEN_ADDRESS &&
    p.longTokenAmount?.gt(0);
  const isNativeShortDeposit =
    p.initialShortTokenAddress === NATIVE_TOKEN_ADDRESS &&
    p.shortTokenAmount?.gt(0);

  let wntDeposit = BigNumber.from(0);

  if (isNativeLongDeposit) {
    wntDeposit = wntDeposit.add(p.longTokenAmount!);
  }

  if (isNativeShortDeposit) {
    wntDeposit = wntDeposit.add(p.shortTokenAmount!);
  }

  const shouldUnwrapNativeToken = isNativeLongDeposit || isNativeShortDeposit;

  const wntAmount = p.executionFee.add(wntDeposit);

  const initialLongTokenAddress = convertTokenAddress(
    chainId,
    p.initialLongTokenAddress,
    "wrapped"
  );
  const initialShortTokenAddress = convertTokenAddress(
    chainId,
    p.initialShortTokenAddress,
    "wrapped"
  );

  const minMarketTokens = applySlippageToMinOut(
    p.allowedSlippage,
    p.minMarketTokens
  );

  const multicall = [
    { method: "sendWnt", params: [depositVaultAddress, wntAmount] },

    !isNativeLongDeposit && p.longTokenAmount.gt(0)
      ? {
          method: "sendTokens",
          params: [
            p.initialLongTokenAddress,
            depositVaultAddress,
            p.longTokenAmount,
          ],
        }
      : undefined,

    !isNativeShortDeposit && p.shortTokenAmount.gt(0)
      ? {
          method: "sendTokens",
          params: [
            p.initialShortTokenAddress,
            depositVaultAddress,
            p.shortTokenAmount,
          ],
        }
      : undefined,

    {
      method: "createDeposit",
      params: [
        {
          receiver: p.account,
          callbackContract: ethers.constants.AddressZero,
          market: p.marketTokenAddress,
          initialLongToken: initialLongTokenAddress,
          initialShortToken: initialShortTokenAddress,
          longTokenSwapPath: p.longTokenSwapPath,
          shortTokenSwapPath: p.shortTokenSwapPath,
          minMarketTokens: minMarketTokens,
          shouldUnwrapNativeToken: shouldUnwrapNativeToken,
          executionFee: p.executionFee,
          callbackGasLimit: BigNumber.from(0),
          uiFeeReceiver:
            UI_FEE_RECEIVER_ACCOUNT ?? ethers.constants.AddressZero,
        },
      ],
    },
  ];

  const encodedPayload = multicall
    .filter(Boolean)
    .map((call) =>
      contract.interface.encodeFunctionData(call!.method, call!.params)
    );

  const calldata = contract.interface.encodeFunctionData("multicall", [
    encodedPayload,
  ]) as `0x${string}`;

  return {
    target: getContract(chainId, "ExchangeRouter") as `0x${string}`,
    data: calldata,
    value: wntAmount.toBigInt(),
  };
}
