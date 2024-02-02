import { UserOperationCallData } from "@alchemy/aa-core";
import Token from "../../../../../abis/Token.json";
import { Hex } from "@alchemy/aa-core";
import { ethers } from "ethers";

type Params = {
    tokenAddress: string;
    spender: string;
};

export function createApproveTokensUserOp({
    tokenAddress,
    spender
}: Params): Exclude<UserOperationCallData, Hex> {

    const calldata = new ethers.utils.Interface(Token.abi).encodeFunctionData("approve", [spender, ethers.constants.MaxUint256]) as `0x${string}`;

    return { target: tokenAddress as `0x${string}`, data: calldata }

}