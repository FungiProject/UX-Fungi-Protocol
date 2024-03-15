import { abiERC20 } from "../../../abis/abis.json";
import { ethers } from "ethers";
import { UserOperationCallData } from "@alchemy/aa-core";
import { Hex } from "@alchemy/aa-core";

/**
 * Generates call data for the ERC20 transfer function.
 * @param {Hex} recipientAddress - The address of the recipient.
 * @param {Hex} tokenAddress - The address of the token contract.
 * @param {string | ethers.BigNumber} amount - The amount to transfer, as a string or BigNumber.
 * @returns {Exclude<UserOperationCallData, Hex>} - The call data for the transfer function.
 */
export function getCallDataTransfer(recipientAddress: Hex, tokenAddress: Hex, amount: string | ethers.BigNumber): Exclude<UserOperationCallData, Hex> {
    // Ensure amount is treated as a BigNumber
    const amountBigNumber = ethers.BigNumber.isBigNumber(amount) ? amount : ethers.BigNumber.from(amount);

    const calldata = new ethers.utils.Interface(abiERC20).encodeFunctionData("transfer", [recipientAddress, amountBigNumber]) as `0x${string}`;
    console.log("calldata", calldata);
    return { target: tokenAddress as `0x${string}`, data: calldata }; // Ensure the target is the tokenAddress, not recipientAddress
}
