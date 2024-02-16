import ExchangeRouter from "../../../../../../abis/ExchangeRouter.json";
import { getContract } from "../../../config/contracts";
import { Subaccount } from "../../../context/SubaccountContext/SubaccountContext";
import { Signer, ethers } from "ethers";
import { callContract } from "../../../lib/contracts/callContract";
import { getSubaccountRouterContract } from "../subaccount/getSubaccountContract";
import { ReactNode } from "react";

export type CancelOrderParams = {
  orderKeys: string[];
  isLastSubaccountAction: boolean;
  setPendingTxns: (txns: any) => void;
  detailsMsg?: ReactNode;
};

export async function cancelOrdersTxn(
  chainId: number,
  signer: Signer,
  subaccount: Subaccount,
  p: CancelOrderParams
) {
  const router = subaccount
    ? getSubaccountRouterContract(chainId, subaccount.signer)
    : new ethers.Contract(
        getContract(chainId, "ExchangeRouter"),
        ExchangeRouter.abi,
        signer
      );

  const multicall = p.orderKeys.map((key) =>
    router.interface.encodeFunctionData("cancelOrder", [key])
  );

  const count = p.orderKeys.length;

  const ordersText = "Order";

  return callContract(chainId, router, "multicall", [multicall], {
    sentMsg: `Cancelling ${ordersText}`,
    successMsg: `${ordersText} cancelled`,
    failMsg: `Failed to cancel ${ordersText}`,
    setPendingTxns: p.setPendingTxns,
    detailsMsg: p.detailsMsg,
  });
}
