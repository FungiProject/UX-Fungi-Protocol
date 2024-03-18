import { useState } from 'react';
import { UserOperation } from "@/lib/userOperations/types"; // Import UserOperation type
import { useGlobalContext } from "@/context/FungiContextProvider";

export function useSimUO() {
    const [simStatus, setSimStatus] = useState<{ loading: boolean, error: string | null, success: string | null, result: any }>({ loading: false, error: null, success: null, result: null });
    const { alchemyScaProvider } = useGlobalContext();

    const simTransfer = async (userOperations: UserOperation[]) => {
        try {
            setSimStatus({ ...simStatus, loading: true });
            if (userOperations.length === 0) {
                return null;
            }
            let result = await alchemyScaProvider.simulateUserOperation({
              account: alchemyScaProvider.account!,
              uo: userOperations.length > 1 ? userOperations : userOperations[0],
            });
            console.log("SIM", result);
            setSimStatus({ loading: false, error: null, success: 'Transfer simulated successfully!', result });
            return result; // Directly return the result for immediate use
          } catch (e: any) {
            console.error(e);
            setSimStatus({ ...simStatus, loading: false, error: 'Simulation failed. Please try again.' });
            return null; // Return null in case of an error
          }
    };
    return {simStatus, simTransfer};
}