import { useState } from "react";
import { sendUserOperations } from "../../utils/gmx/lib/userOperations/sendUserOperations";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { getCallDataApprove } from "./getCallDataApprove";
import { Hex } from "viem";
import axios from "axios";

export const useLiFiTx = (
  alchemyProvider: AlchemyProvider,
  chainId: number,
  fromChain: string | undefined,
  fromAmount: string | undefined,
  fromToken: string | undefined,
  toChain: string | undefined,
  toToken: string | undefined,
  fromAddress: string | undefined,
  toAddress?: string | undefined,
  slippage?: string
) => {
  const [status, setStatus] = useState<{
    disabled: boolean;
    text: string | null;
  }>({ disabled: true, text: "Enter an amount" });

  const getQuote = async (params) => {
    const response = await axios.get("https://li.quest/v1/quote", {
      params,
    });
    return response.data;
  };

  const sendLiFiTx = async () => {
    try {
      setStatus({ disabled: true, text: `Swapping ${fromToken}` });

      const quote = await getQuote({
        fromChain,
        fromAmount,
        fromToken,
        toChain,
        toToken,
        fromAddress,
        toAddress,
        slippage,
      });

      const approvee: Hex = quote.transactionRequest.to;
      const tokenAddress: Hex = quote.action.fromToken.address;
      const amount: number = quote.estimate.fromAmount;

      const callDataApprove = getCallDataApprove(
        approvee,
        tokenAddress,
        amount
      );

      const callDataLiFiTx = {
        target: quote.transactionRequest.to,
        data: quote.transactionRequest.data,
      };

      setStatus({ disabled: true, text: "Enter an amount" });

      return [callDataApprove, callDataLiFiTx];
    } catch (error) {
      setStatus({ disabled: true, text: "Enter an amount" });
      console.error(error);
    }
  };

  return [status, sendLiFiTx];
};
