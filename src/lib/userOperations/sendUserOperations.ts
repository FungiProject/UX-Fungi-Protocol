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

    const uo = await alchemyProvider.sendUserOperation({
      uo: {
        target: userOperations[0].target!,
        data: userOperations[0].data!,
      },
    });

    //const uo = await alchemyProvider.sendUserOperation({uo: { userOperations[0]}});

    const txHash = await alchemyProvider.waitForUserOperationTransaction(
      uo.hash
    );

    return txHash;
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}
