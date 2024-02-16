import {
  NATIVE_TOKEN_ADDRESS,
  getToken,
  getWrappedToken,
} from "../../../config/tokens";
import { callContract } from "../../../lib/contracts/callContract";
import WETH from "../../../../../../abis/WETH.json";
import { BigNumber, Signer, ethers } from "ethers";
import { formatTokenAmount } from "../../../lib/numbers";

type WrapOrUnwrapParams = {
  amount: BigNumber;
  isWrap: boolean;
  setPendingTxns: (txns: any) => void;
};

export function createWrapOrUnwrapTxn(
  chainId: number,
  signer: Signer,
  p: WrapOrUnwrapParams
) {
  const wrappedToken = getWrappedToken(chainId);
  const nativeToken = getToken(chainId, NATIVE_TOKEN_ADDRESS);

  const contract = new ethers.Contract(wrappedToken.address, WETH.abi, signer);

  if (p.isWrap) {
    return callContract(chainId, contract, "deposit", [], {
      value: p.amount,
      sentMsg: `Swap submitted.`,
      successMsg: `Swapped ${formatTokenAmount(
        p.amount,
        nativeToken.decimals,
        nativeToken.symbol
      )} for ${formatTokenAmount(
        p.amount,
        wrappedToken.decimals,
        wrappedToken.symbol
      )}`,
      failMsg: `Swap failed.`,
      setPendingTxns: p.setPendingTxns,
    });
  } else {
    return callContract(chainId, contract, "withdraw", [p.amount], {
      sentMsg: `Swap submitted.`,
      successMsg: `Swapped ${formatTokenAmount(
        p.amount,
        wrappedToken.decimals,
        wrappedToken.symbol
      )} for ${formatTokenAmount(
        p.amount,
        nativeToken.decimals,
        nativeToken.symbol
      )}`,
      failMsg: `Swap failed.`,
      setPendingTxns: p.setPendingTxns,
    });
  }
}
