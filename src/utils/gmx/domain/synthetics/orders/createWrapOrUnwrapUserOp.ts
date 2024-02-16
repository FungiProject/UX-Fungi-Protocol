import {
  NATIVE_TOKEN_ADDRESS,
  getToken,
  getWrappedToken,
} from "../../../config/tokens";
import { callContract } from "../../../lib/contracts/callContract";
import WETH from "../../../../../../abis/WETH.json";
import { BigNumber, Signer, ethers } from "ethers";
// import { t } from "@lingui/macro";
import { formatTokenAmount } from "../../../lib/numbers";
import { getContract } from "../../../config/contracts";
import { UserOperation } from "@/utils/gmx/lib/userOperations/types";

type WrapOrUnwrapParams = {
  amount: BigNumber;
  isWrap: boolean;
  setPendingTxns: (txns: any) => void;
};

export function createWrapOrUnwrapOrderUserOp(
  chainId: number,
  p: WrapOrUnwrapParams
) {
  const wrappedToken = getWrappedToken(chainId);
  const router = new ethers.Contract(wrappedToken.address, WETH.abi);

  if (p.isWrap) {
    const calldata = router.interface.encodeFunctionData(
      "deposit",
      []
    ) as `0x${string}`;

    return {
      target: router.address as `0x${string}`,
      data: calldata,
      value: p.amount.toBigInt(),
    };
  } else {
    const calldata = router.interface.encodeFunctionData("withdraw", [
      p.amount,
    ]) as `0x${string}`;

    return {
      target: router.address as `0x${string}`,
      data: calldata,
    };
  }
}
