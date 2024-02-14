import ExchangeRouter from "../../../../../../abis/ExchangeRouter.json";
import { getContract } from "../../../config/contracts";
import { convertTokenAddress } from "../../../config/tokens";
import { BigNumber, ethers } from "ethers";
import { isAddressZero } from "../../../lib/legacy";
import { applySlippageToMinOut } from "../trade";
import { UI_FEE_RECEIVER_ACCOUNT } from "../../../config/ui";
import { UserOperation } from "@/utils/gmx/lib/userOperations/types";

type Params = {
    account: string;
    marketTokenAddress: string;
    marketTokenAmount: BigNumber;
    initialLongTokenAddress: string;
    minLongTokenAmount: BigNumber;
    longTokenSwapPath: string[];
    initialShortTokenAddress: string;
    shortTokenSwapPath: string[];
    minShortTokenAmount: BigNumber;
    executionFee: BigNumber;
    allowedSlippage: number;
};

export function createWithdrawalUserOp(
    chainId: number,
    p: Params
): UserOperation{

    const contract = new ethers.Contract(getContract(chainId, "ExchangeRouter"), ExchangeRouter.abi);

    const withdrawalVaultAddress = getContract(chainId, "WithdrawalVault");

    const isNativeWithdrawal =
        isAddressZero(p.initialLongTokenAddress) ||
        isAddressZero(p.initialShortTokenAddress);

    const wntAmount = p.executionFee;

    const initialLongTokenAddress = convertTokenAddress(
        chainId,
        p.initialLongTokenAddress,
        "wrapped"
    );
    const initialShortTokenAddress = convertTokenAddress(
        chainId,
        p.initialShortTokenAddress,
        "wrapped"
    );

    const minLongTokenAmount = applySlippageToMinOut(
        p.allowedSlippage,
        p.minLongTokenAmount
    );
    const minShortTokenAmount = applySlippageToMinOut(
        p.allowedSlippage,
        p.minShortTokenAmount
    );

    const multicall = [
        { method: "sendWnt", params: [withdrawalVaultAddress, wntAmount] },
        {
            method: "sendTokens",
            params: [
                p.marketTokenAddress,
                withdrawalVaultAddress,
                p.marketTokenAmount,
            ],
        },
        {
            method: "createWithdrawal",
            params: [
                {
                    receiver: p.account,
                    callbackContract: ethers.constants.AddressZero,
                    market: p.marketTokenAddress,
                    initialLongToken: initialLongTokenAddress,
                    initialShortToken: initialShortTokenAddress,
                    longTokenSwapPath: p.longTokenSwapPath,
                    shortTokenSwapPath: p.shortTokenSwapPath,
                    marketTokenAmount: p.marketTokenAmount,
                    minLongTokenAmount,
                    minShortTokenAmount,
                    shouldUnwrapNativeToken: isNativeWithdrawal,
                    executionFee: p.executionFee,
                    callbackGasLimit: BigNumber.from(0),
                    uiFeeReceiver:
                        UI_FEE_RECEIVER_ACCOUNT ?? ethers.constants.AddressZero,
                },
            ],
        },
    ];

    const encodedPayload = multicall
        .filter(Boolean)
        .map((call) =>
            contract.interface.encodeFunctionData(call!.method, call!.params)
        );
    
    const calldata = contract.interface.encodeFunctionData("multicall", [encodedPayload]) as `0x${string}`;
  
    return { target: getContract(chainId, "ExchangeRouter") as `0x${string}`, data: calldata, value: wntAmount.toBigInt() }
}
