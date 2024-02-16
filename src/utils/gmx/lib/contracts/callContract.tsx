import ExternalLink from "../../../../components/Gmx/common/ExternalLink/ExternalLink";
import { getExplorerUrl } from "../../config/chains";
import { BigNumber, Contract } from "ethers";
import { helperToast } from "../helperToast";
import { getErrorMessage } from "./transactionErrors";
import { getGasLimit, setGasPrice } from "./utils";
import { ReactNode } from "react";

export async function callContract(
  chainId: number,
  contract: Contract,
  method: string,
  params: any,
  opts: {
    value?: BigNumber | number;
    gasLimit?: BigNumber | number;
    detailsMsg?: ReactNode;
    sentMsg?: string;
    successMsg?: string;
    hideSentMsg?: boolean;
    hideSuccessMsg?: boolean;
    failMsg?: string;
    setPendingTxns?: (txns: any) => void;
  }
) {
  try {
    if (
      !Array.isArray(params) &&
      typeof params === "object" &&
      opts === undefined
    ) {
      opts = params;
      params = [];
    }

    if (!opts) {
      opts = {};
    }

    const txnOpts: any = {};

    if (opts.value) {
      txnOpts.value = opts.value;
    }

    txnOpts.gasLimit = opts.gasLimit
      ? opts.gasLimit
      : await getGasLimit(contract, method, params, opts.value);

    await setGasPrice(txnOpts, contract.provider, chainId);

    const res = await contract[method](...params, txnOpts);

    if (!opts.hideSentMsg) {
      const txUrl = getExplorerUrl(chainId) + "tx/" + res.hash;
      const sentMsg = opts.sentMsg || `Transaction sent.`;

      helperToast.success(
        <div>
          {sentMsg} <ExternalLink href={txUrl}>View status.</ExternalLink>
          <br />
          {opts.detailsMsg && <br />}
          {opts.detailsMsg}
        </div>
      );
    }

    if (opts.setPendingTxns) {
      const message = opts.hideSuccessMsg
        ? undefined
        : opts.successMsg || `Transaction completed!`;
      const pendingTxn = {
        hash: res.hash,
        message,
        messageDetails: opts.detailsMsg,
      };
      opts.setPendingTxns((pendingTxns) => [...pendingTxns, pendingTxn]);
    }

    return res;
  } catch (e: any) {
    const { failMsg, autoCloseToast } = getErrorMessage(
      chainId,
      e,
      opts?.failMsg
    );

    helperToast.error(failMsg, { autoClose: autoCloseToast });
    throw e;
  }
}
