import { useState } from 'react';
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { getCallDataTransfer } from "@/lib/userOperations/getCallDataTransfer";
import { useUserOperations } from "@/hooks/useUserOperations";
import { Hex } from "@alchemy/aa-core";
import { TokenInfo } from "@/domain/tokens/types";
import { AlchemySmartAccountClient } from "@alchemy/aa-alchemy";
import { BigNumber } from 'alchemy-sdk';

export const useERC20Transfer = (tokenIn: Hex, amountIn: BigNumber, recipient: Hex) => {
    const [status, setStatus] = useState<{ loading: boolean, error: string | null, success: string | null }>({ loading: false, error: null, success: null });

    const { sendUserOperations } = useUserOperations();

    const sendTransfer = async () => {
        try {
            setStatus({ loading: true, error: null, success: null });

            const callDataApprove = createApproveTokensUserOp({
                tokenAddress: tokenIn,
                spender: recipient,
                amount: amountIn,
            });
            console.log("callDataApprove", callDataApprove);
            const callDataTransfer = getCallDataTransfer(recipient, tokenIn, amountIn);

            console.log("callDataTransfer", callDataTransfer);
            // This component already has the provider, so no need to pass it as an argument
            await sendUserOperations([callDataApprove, callDataTransfer]);

            setStatus({ loading: false, error: null, success: 'Transfer successful!' });
        } catch (error) {
            console.error(error);
            setStatus({ loading: false, error: 'Transfer failed. Please try again.', success: null });
        }
    };

    return [ status, sendTransfer ];
};
