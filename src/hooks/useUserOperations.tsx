import { helperToast } from "@/utils/gmx/lib/helperToast";
import ExternalLink from "@/components/Gmx/common/ExternalLink/ExternalLink";
import { getExplorerUrl } from "@/utils/gmx/config/chains";
import { UserOperation } from "@/lib/userOperations/types";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { useAlchemyAccountKitContext } from "@/lib/wallets/AlchemyAccountKitProvider";
import { sendUserOperations as sendUserOperationAlchemy } from "@/lib/userOperations/sendUserOperations";


export function useUserOperations() {
  const { chainId } = useWallet();
  const { alchemyProvider } = useAlchemyAccountKitContext();

  const sendUserOperations = async (userOperations: UserOperation[], successMessage?: string) => {
    try {
      
      const txHash = await sendUserOperationAlchemy(alchemyProvider, userOperations)

      const txUrl = getExplorerUrl(chainId!) + "tx/" + txHash;
      const sentMsg = `Transaction sent.`;

      helperToast.success(
        <div>
          {sentMsg} <ExternalLink href={txUrl}>View status.</ExternalLink>
          <br />
          {successMessage && <br />}
          {successMessage}
        </div>
      );

    } catch (e) {
      console.error(e);
      console.log(userOperations)
      //TODO
      //const { failMsg, autoCloseToast } = getErrorMessage(chainId, e, undefined);
      //helperToast.error(failMsg, { autoClose: autoCloseToast });
      //throw e;
    }

  }

  return { sendUserOperations };
}





