import { ethers, BigNumber } from "ethers";
import { UserOperation } from "../../lib/userOperations/types";
import DCAHubArtifact from '../../../abis/DCAHub.json';

type Params = {
    sellToken: string;
    buyToken: string;
    amount: number;
    amountOfSwaps: number;
    swapInterval: number;
    scAccount: string;
    permissions: string[];
    };

export const getDCAUserOp = ({ 
    sellToken, 
    buyToken, 
    amount, 
    amountOfSwaps, 
    swapInterval, 
    scAccount,
    permissions
}: Params): UserOperation  => {

    const DCAHub = '0xA5AdC5484f9997fBF7D405b9AA62A7d88883C345';
    const contract = new ethers.Contract(DCAHub, DCAHubArtifact.abi);

    console.log("Contract interface:", contract);

    const calldata = contract.interface.encodeFunctionData("deposit", [
        sellToken,
        buyToken,
        amount,
        amountOfSwaps,
        swapInterval,
        scAccount,
        permissions
    ]) as string;

    console.log("Encoded deposit data:", calldata);

    return { target: DCAHub, data: `0x${calldata}`}
}
