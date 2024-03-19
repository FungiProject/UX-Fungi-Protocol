import { useState } from 'react';
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { getCallDataTransfer } from "@/lib/userOperations/getCallDataTransfer";
import { BigNumber } from 'alchemy-sdk';
import { UserOperation } from "@/lib/userOperations/types"; // Import UserOperation type
import { ethers } from 'ethers';

export const useERC20Transfer = (tokenIn: string, amountIn: BigNumber, recipient: string) => {
    const [status, setStatus] = useState<{
        disabled: boolean;
        text: string | null;
      }>({ disabled: true, text: "Enter an amount" });

    const sendTransfer = async () => {
        try {
            setStatus({
                disabled: true,
                text: "Transferring...",
              });
            const userOps: UserOperation[] = [];

            if (tokenIn != ethers.constants.AddressZero) {
                userOps.push(
                    createApproveTokensUserOp({
                        tokenAddress: tokenIn,
                        spender: recipient,
                        amount: amountIn,
                    })
                );
                userOps.push(getCallDataTransfer(recipient, tokenIn, amountIn));
            } else {
                userOps.push(getCallDataTransfer(recipient, tokenIn, amountIn));
            }
            // Generate approve call data
            const approveOperation = createApproveTokensUserOp({
                tokenAddress: tokenIn,
                spender: recipient,
                amount: amountIn,
            });
            // Generate transfer call data
            const transferOperation = getCallDataTransfer(recipient, tokenIn, amountIn);
            // Verify the operations are correctly formed
            if (!approveOperation || !transferOperation) {
                throw new Error("Failed to generate call data for approve and/or transfer.");
            }
            setStatus({ disabled: true, text: "Enter an amount" });

            return userOps;
        } catch (error) {
            setStatus({ disabled: true, text: "Enter an amount" });
            console.error(error);
        }
    };

    return [status, sendTransfer];
};
