import { UserOperation } from "./types";
import {  AlchemySmartAccountClient  } from "@alchemy/aa-alchemy"

export async function sendUserOperations(
  alchemyProvider:  AlchemySmartAccountClient,
  userOperations: UserOperation[]
) {
  try {

    console.log(userOperations)
    if (userOperations.length === 0) {
      return;
    }

    const { hash: uoHash } = await alchemyProvider.sendUserOperation({
      account: alchemyProvider.account!,
      uo: userOperations.length> 1 ? userOperations:userOperations[0],
    });

    const txHash = await alchemyProvider.waitForUserOperationTransaction({
      hash: uoHash,
      confirmations: 1
      }
    );

    return txHash;
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}
