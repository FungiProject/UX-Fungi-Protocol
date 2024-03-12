// src/hooks/useDcaTx.tsx
import { useContext } from 'react';
import useWallet from './useWallet';
import { useNotification } from '@/context/NotificationContextProvider';
import { UserOperation } from '@/lib/userOperations/types';
import { sendUserOperations as sendUserOperationAlchemy } from '@/lib/userOperations/sendUserOperations';
import MEAN_FINANCE_ABI from '../../abis/DCAHub.json'
import { ethers } from 'ethers';

export const useDcaTx = () => {
    const DCAHub = '0xA5AdC5484f9997fBF7D405b9AA62A7d88883C345';
    const { scAccount } = useWallet();
    const { showNotification } = useNotification();

    const prepareDcaOperations = async ({ sellToken, buyToken, amount, amountOfSwaps, swapInterval, scAccount }) => {
        // ABI for the Mean Fianace DCA Hub contract's deposit method
        const depositMethodAbi = ["function deposit(address from, address to, uint256 amount, uint32 amountOfSwaps, uint32 swapInterval, address owner, IDCAPermissionManager.PermissionSet[] calldata permissions) returns (uint256 positionId)"];

        // Creating an instance of ethers utils Interface with the deposit ABI
        const depositInterface = new ethers.utils.Interface(depositMethodAbi);

        // Encoding the data for the deposit function call
        const depositData = depositInterface.encodeFunctionData("deposit", [sellToken, buyToken, amount, amountOfSwaps, swapInterval, scAccount, []]);

        const userOperations: UserOperation[] = [{
            target: DCAHub, // Ensure DCAHub address is in the correct format
            value: BigInt(0), // Convert the value to a bigint
            data: `0x${depositData}` // Ensure the data is in the correct format
        }];
        
        return userOperations;
    };

    return { prepareDcaOperations };
};
