import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { UserOperation } from "./types";

export async function sendUserOperations(
  alchemyProvider: AlchemyProvider,
  userOperations: UserOperation[],
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

    return txHash;
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}
