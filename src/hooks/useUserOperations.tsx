import ExternalLink from "@/components/Gmx/common/ExternalLink/ExternalLink";
import { getExplorerUrl } from "@/utils/gmx/config/chains";
import { UserOperation } from "@/lib/userOperations/types";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { sendUserOperations as sendUserOperationAlchemy } from "@/lib/userOperations/sendUserOperations";
import { estimateGasUserOp as estimateGasUserOperationAlchemy } from "@/lib/userOperations/estimateGas";
import { simulateUserOperations } from "@/lib/userOperations/simulation";
import { useGlobalContext } from "@/context/FungiContextProvider";
import { useNotification } from "@/context/NotificationContextProvider";

export function useUserOperations() {
  const { chainId, scAccount } = useWallet();
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

      const simulateResult = await simulateUserOperations(alchemyScaProvider,
        userOperations
      );

      if (simulateResult.error) {
        showNotification({
          message: "Simulation failed. No result returned.",
          type: "error",
        });
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
      showNotification({
        message: "Error submitting order",
        type: "error",
      });
    }
  };

  const estimateGasUserOperations = async (userOperations: UserOperation[]) => {
    await estimateGasUserOperationAlchemy(alchemyScaProvider, userOperations);
  }

  return { sendUserOperations, estimateGasUserOperations };
}
