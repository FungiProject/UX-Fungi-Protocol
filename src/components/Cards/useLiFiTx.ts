import { useState } from "react";
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { Hex } from "viem";
import axios from "axios";
import { BigNumber, ethers } from "ethers";
import { UserOperation } from "@/lib/userOperations/types";

export const useLiFiTx = (
  type: string,
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
      setStatus({
        disabled: true,
        text: `${type === "Swap" ? "Swapping" : "Bridging"} ${fromToken}`,
      });

      const orders = ["FASTEST", "CHEAPEST", "SAFEST", "RECOMMENDED"];
      let quote: any;
      try {
        const responses = await Promise.all(
          orders.map((order) => {
            return getQuote({
              fromChain,
              fromAmount,
              fromToken,
              toChain,
              toToken,
              fromAddress,
              toAddress,
              slippage,
              order,
            });
          })
        );

        const filteredResponses = responses.filter((response) => {
          return response.estimate.executionDuration < 300;
        });

        quote = filteredResponses.reduce((maxResponse, response) => {
          return response.estimate.toAmountMin >
            maxResponse.estimate.toAmountMin
            ? response
            : maxResponse;
        }, filteredResponses[0]);
      } catch (error) {
        console.error("Error obteniendo cotizaciones:", error);
      }

      const spender: Hex = quote.transactionRequest.to;
      const tokenAddress: Hex = quote.action.fromToken.address;
      const amount: number = quote.estimate.fromAmount;

      const userOps: UserOperation[] = [];

      if (tokenAddress != ethers.constants.AddressZero) {
        userOps.push(
          createApproveTokensUserOp({
            tokenAddress,
            spender,
            amount: BigNumber.from(amount),
          })
        );

        userOps.push({
          target: quote.transactionRequest.to,
          data: quote.transactionRequest.data,
        });
      } else {
        userOps.push({
          target: quote.transactionRequest.to,
          data: quote.transactionRequest.data,
          value: BigInt(amount),
        });
      }

      setStatus({ disabled: true, text: "Enter an amount" });
      console.log(userOps);
      return userOps;
    } catch (error) {
      setStatus({ disabled: true, text: "Enter an amount" });
      console.error(error);
    }
  };

  return [status, sendLiFiTx];
};
