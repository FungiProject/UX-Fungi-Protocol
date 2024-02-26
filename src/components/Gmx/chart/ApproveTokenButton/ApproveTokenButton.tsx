import { getWrappedToken } from "../../../../utils/gmx/config/tokens";
import { approveTokens } from "../../../../utils/gmx/domain/tokens";
import { isAddressZero } from "../../../../utils/gmx/lib/legacy";
import { useState } from "react";
import { ImCheckboxUnchecked, ImSpinner2 } from "react-icons/im";
import useWallet from "../../../../utils/gmx/lib/wallets/useWallet";

type Props = {
  spenderAddress: string;
  tokenAddress: string;
  tokenSymbol: string;
  isApproved?: boolean;
};

export function ApproveTokenButton(p: Props) {
  const { chainId } = useWallet();
  const [isApproving, setIsApproving] = useState(false);
  const [isApproveSubmitted, setIsApproveSubmitted] = useState(false);

  function onApprove() {
    if (!chainId || isApproveSubmitted || p.isApproved) return;

    const wrappedToken = getWrappedToken(chainId);
    const tokenAddress = isAddressZero(p.tokenAddress)
      ? wrappedToken.address
      : p.tokenAddress;

    approveTokens({
      setIsApproving,
      tokenAddress: tokenAddress,
      spender: p.spenderAddress,
      pendingTxns: [],
      setPendingTxns: () => null,
      infoTokens: {},
      chainId,
      onApproveSubmitted: () => setIsApproveSubmitted(true),
    });
  }

  const isLoading = isApproving || (isApproveSubmitted && !p.isApproved);

  return (
    <div className="ApproveTokenButton Checkbox fullRow" onClick={onApprove}>
      <span className="text-warning">Allow {p.tokenSymbol} to be spent</span>

      <div className="ApproveTokenButton-checkbox">
        {isLoading ? (
          <ImSpinner2 className="spin ApproveTokenButton-spin" />
        ) : (
          <ImCheckboxUnchecked className="App-icon Checkbox-icon inactive" />
        )}
      </div>
    </div>
  );
}
