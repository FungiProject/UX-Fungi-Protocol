import { useContext } from 'react';
import useWallet from './useWallet';
import { useNotification } from '@/context/NotificationContextProvider';
import { UserOperation } from '@/lib/userOperations/types';
import { sendUserOperations as sendUserOperationAlchemy } from '@/lib/userOperations/sendUserOperations';
import DCAHubArtifact from '../../abis/DCAHub.json';
import { ethers } from 'ethers';
import { useGlobalContext } from "@/context/FungiContextProvider";

interface Params {
    sellToken: string;
    buyToken: string;
    amount: number;
    amountOfSwaps: number;
    swapInterval: number;
    scAccount: string;
}

export const useDcaTx = () => {
    const DCAHub = '0xA5AdC5484f9997fBF7D405b9AA62A7d88883C345';
    const { scAccount } = useWallet();
    const { showNotification } = useNotification();
    const { alchemyScaProvider } = useGlobalContext();

    // const prepareDcaOperations = ({ sellToken, buyToken, amount, amountOfSwaps, swapInterval, scAccount }: Params): UserOperation  => {
    //     console.log("Preparing DCA Operations with parameters:", {sellToken, buyToken, amount, amountOfSwaps, swapInterval, scAccount});
    //     try {
    //         const contractABI = DCAHubArtifact.abi;
    //         const contract = new ethers.Contract(DCAHub, contractABI);
    
    //         console.log("Contract interface:", contract);
    
    //         // Note: Ensure all parameters are in the correct format
    //         const calldata = contract.interface.encodeFunctionData("deposit", [
    //             sellToken, // Token to sell
    //             buyToken, // Token to buy
    //             ethers.utils.parseUnits(amount.toString(), "ether"), // Amount of 'from' token for each swap
    //             amountOfSwaps, // Total number of swaps
    //             swapInterval, // Swap interval in seconds
    //             scAccount, // Owner of the DCA position
    //             [], // Permissions, adjust according to your contract's needs
    //         ]);
    
    //         console.log("Encoded deposit data:", calldata);

    //         // const userOperations: UserOperation[] = [{
    //         //     target: DCAHub,
    //         //     data: `0x${calldata}`, // Add the prefix '0x' to the depositData
    //         //     value: ethers.BigNumber.from(0).toBigInt(),
    //         // }];

    //         // console.log("Prepared DCA operations:", userOperations);

    //         return { target: DCAHub, data: `0x${calldata}`, value: ethers.BigNumber.from(0).toBigInt() }
    //     } catch (error) {
    //         console.error("Error preparing DCA operations:", error);
    //         showNotification({ message: "Failed to prepare DCA operations. Please check input values and try again.", type: "error" });
    //         throw error;
    //     }
    // };

    const executeDcaOperation = async (userOperations) => {
        try {
            // Assuming sendUserOperationAlchemy is adaptable for DCA operations
            await sendUserOperationAlchemy(alchemyScaProvider, userOperations);
            showNotification({ message: "DCA operation executed successfully.", type: "success" });
        } catch (error) {
            console.error(error);
            showNotification({ message: "Failed to execute DCA operation.", type: "error" });
            throw error;
        }
    };

    return { executeDcaOperation };
};
