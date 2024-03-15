import Token from "@/../abis/Token.json";
import { ethers, BigNumber } from "ethers";
import { UserOperation } from "../../lib/userOperations/types";

type Params = {
  tokenAddress: string;
  spender: string;
  amount?: BigNumber;
};

export function createApproveTokensUserOp({
  tokenAddress,
  spender,
  amount = ethers.constants.MaxUint256,
}: Params): UserOperation {
  console.log("tokenAddress", tokenAddress);
  const contract = new ethers.Contract(tokenAddress, Token.abi);
  console.log("contract", contract);

  const calldata = contract.interface.encodeFunctionData("approve", [
    spender,
    amount,
  ]) as `0x${string}`;

  return { target: tokenAddress as `0x${string}`, data: calldata };
}
