import { useState } from 'react';
import { createApproveTokensUserOp, Params } from "@/lib/userOperations/getApproveUserOp";
import { getCallDataTransfer } from "@/lib/userOperations/getCallDataTransfer";
import { useUserOperations } from "@/hooks/useUserOperations";
import { Hex } from "@alchemy/aa-core";
import { TokenInfo } from "@/domain/tokens/types";
import { AlchemySmartAccountClient } from "@alchemy/aa-alchemy";
import { BigNumber } from 'alchemy-sdk';

export const useERC20Transfer = (tokenIn: Hex, amountIn: BigNumber, recipient: Hex) => {
    const [status, setStatus] = useState<{ loading: boolean, error: string | null, success: string | null }>({ loading: false, error: null, success: null });

    const { sendUserOperations } = useUserOperations();
    // Pass the arguments to the Params type in a variable
    const params: Params = {
        tokenAddress: tokenIn,
        spender: recipient,
        amount: amountIn
    };

    const sendTransfer = async () => {
        try {
            setStatus({ loading: true, error: null, success: null });

            const callDataApprove = createApproveTokensUserOp(params);
            const callDataTransfer = getCallDataTransfer(recipient, tokenIn, amountIn);

            console.log(callDataApprove, callDataTransfer);
            // This component already has the provider, so no need to pass it as an argument
            await sendUserOperations([callDataApprove, callDataTransfer]);

            setStatus({ loading: false, error: null, success: 'Transfer successful!' });
        } catch (error) {
            console.error(error);
            setStatus({ loading: false, error: 'Transfer failed. Please try again.', success: null });
        }
    };

    return { sendTransfer };
};
