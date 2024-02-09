import Token from "../../../abis/Token.json";
import { ethers } from "ethers";
import { UserOperationCallData } from "@alchemy/aa-core";
import { Hex } from "@alchemy/aa-core";

export function getCallDataApprove(
  approvee: Hex,
  tokenAddress: Hex,
  amount: number
): Exclude<UserOperationCallData, Hex> {
  const calldata = new ethers.utils.Interface(Token.abi).encodeFunctionData(
    "approve",
    [approvee, ethers.BigNumber.from(amount)]
  ) as `0x${string}`;

  return { target: tokenAddress, data: calldata };
}
