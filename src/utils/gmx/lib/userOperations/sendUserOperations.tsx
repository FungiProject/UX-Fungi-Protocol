import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { helperToast } from "../helperToast";
import { getErrorMessage } from "../contracts/transactionErrors";
import ExternalLink from "@/components/Gmx/common/ExternalLink/ExternalLink";
import { getExplorerUrl } from "../../config/chains";
import { UserOperation } from "./types";

export async function sendUserOperations(
  alchemyProvider: AlchemyProvider,
  chainId: number,
  userOperations: UserOperation[],
  successMessage?: string
) {
  try {
    if (userOperations.length === 0) {
      return;
    }

    const uo = await alchemyProvider.sendUserOperation(
      userOperations.length > 1 ? userOperations : userOperations[0]
    );

    const txHash = await alchemyProvider.waitForUserOperationTransaction(
      uo.hash
    );

    const txUrl = getExplorerUrl(chainId) + "tx/" + txHash;
    const sentMsg = `Transaction sent.`;

    helperToast.success(
      <div>
        {sentMsg} <ExternalLink href={txUrl}>View status.</ExternalLink>
        <br />
        {successMessage && <br />}
        {successMessage}
      </div>
    );
  } catch (e: any) {
    console.error(e);
    const { failMsg, autoCloseToast } = getErrorMessage(chainId, e, undefined);
    helperToast.error(failMsg, { autoClose: autoCloseToast });
    throw e;
  }
}
