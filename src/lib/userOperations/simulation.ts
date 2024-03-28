import { AlchemySmartAccountClient } from "@alchemy/aa-alchemy";
import { UserOperation, SimulationError } from "./types";

export async function simulateUserOperations(
    alchemyProvider: AlchemySmartAccountClient,
    userOperations: UserOperation[]
): Promise<SimulationError> {
    try {
        if (userOperations.length === 0) {
            throw new Error("userops 0");
        }

        const uoSimResult = await alchemyProvider.simulateUserOperation({
            account: alchemyProvider.account!,
            uo: userOperations.length > 1 ? userOperations : userOperations[0],
        });

        if (uoSimResult.error) {
            return {
                error: true,
                msg: uoSimResult.error.message
            }
        }

        return {
            error: false
        };

    } catch (e: any) {
        console.error(e);
        return {
            error: true,
            msg: "Exception revert"
        }
    }
}