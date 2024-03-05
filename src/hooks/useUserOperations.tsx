import ExternalLink from "@/components/Gmx/common/ExternalLink/ExternalLink";
import { getExplorerUrl } from "@/utils/gmx/config/chains";
import { UserOperation } from "@/lib/userOperations/types";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { sendUserOperations as sendUserOperationAlchemy } from "@/lib/userOperations/sendUserOperations";
import { useGlobalContext } from "@/context/FungiGlobalContext";
import { useNotification } from "@/context/NotificationContextProvider";

export function useUserOperations() {
  const { chainId } = useWallet();
  const { alchemyScaProvider } = useGlobalContext();
  const { showNotification } = useNotification();
  const sendUserOperations = async (
    userOperations: UserOperation[],
    successMessage?: string
  ) => {
    try {
      if (!alchemyScaProvider) {
        return;
      }

      const txHash = await sendUserOperationAlchemy(
        alchemyScaProvider,
        userOperations
      );
      const txUrl = getExplorerUrl(chainId!) + "tx/" + txHash;
      const sentMsg = `Transaction sent.`;
      showNotification({
        message: (
          <div>
            {sentMsg} <ExternalLink href={txUrl}>View status.</ExternalLink>
            <br />
            {successMessage && <br />}
            {successMessage}
          </div>
        ),
        type: "success",
      });
    } catch (e) {
      console.error(e);
      console.log("error");
      //TODO
      // const { failMsg, autoCloseToast } = getErrorMessage(
      //   chainId,
      //   e,
      //   undefined
      // );
      // helperToast.error(failMsg, { autoClose: autoCloseToast });
      //throw e;
    }
  };

  return { sendUserOperations };
}
