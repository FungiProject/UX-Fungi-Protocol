import { ethers } from "ethers";
import Token from "../../../../../abis/Token.json";
import { getChainName, getExplorerUrl } from "../../config/chains";
import { InfoTokens, TokenInfo } from "./types";
import ExternalLink from "../../../../components/Gmx/common/ExternalLink/ExternalLink";
import { getNativeToken } from "../../config/tokens";
import { Link } from "react-router-dom";

type Params = {
  setIsApproving: (val: boolean) => void;
  tokenAddress: string;
  spender: string;
  chainId: number;
  onApproveSubmitted: () => void;
  getTokenInfo?: (infoTokens: InfoTokens, tokenAddress: string) => TokenInfo;
  infoTokens: InfoTokens;
  pendingTxns: any[];
  setPendingTxns: (txns: any[]) => void;
  includeMessage?: boolean;
};

export function approveTokens({
  setIsApproving,

  tokenAddress,
  spender,
  chainId,
  onApproveSubmitted,
  getTokenInfo,
  infoTokens,
  pendingTxns,
  setPendingTxns,
  includeMessage,
}: Params) {
  setIsApproving(true);
  const contract = new ethers.Contract(tokenAddress, Token.abi);
  const nativeToken = getNativeToken(chainId);
  const networkName = getChainName(chainId);

  contract
    .approve(spender, ethers.constants.MaxUint256)
    .then(async (res) => {
      if (onApproveSubmitted) {
        onApproveSubmitted();
      }
      if (getTokenInfo && infoTokens && pendingTxns && setPendingTxns) {
        const token = getTokenInfo(infoTokens, tokenAddress);
        const pendingTxn = {
          hash: res.hash,
          message: includeMessage ? `${token.symbol} Approved!` : false,
        };
        setPendingTxns([...pendingTxns, pendingTxn]);
      }
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      let failMsg;
      if (
        [
          "not enough funds for gas",
          "failed to execute call with revert code InsufficientGasFunds",
        ].includes(e.data?.message)
      ) {
        failMsg = (
          <div>
            There is not enough {nativeToken.symbol} in your account on{" "}
            {networkName} to send this transaction.
            <br />
            <br />
            <Link to="/buy_gmx#bridge">
              Buy or Transfer {nativeToken.symbol} to {networkName}
            </Link>
          </div>
        );
      } else if (e.message?.includes("User denied transaction signature")) {
        failMsg = `Approval was cancelled`;
      } else {
        failMsg = `Approval failed`;
      }
      showNotification({
        message: `${failMsg}`,
        type: "success",
      });
    })
    .finally(() => {
      setIsApproving(false);
    });
}
