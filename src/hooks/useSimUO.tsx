import { useState } from 'react';
import { UserOperation } from "@/lib/userOperations/types"; // Import UserOperation type
import { useGlobalContext } from "@/context/FungiContextProvider";

export function useSimUO() {
    const [simStatus, setSimStatus] = useState<{ loading: boolean, error: string | null, success: string | null }>({ loading: false, error: null, success: null });
    const { alchemyScaProvider } = useGlobalContext();

    const simTransfer = async (userOperations: UserOperation[]) => {
        try {
            setSimStatus({ loading: true, error: null, success: null });

            if (userOperations.length === 0) {
              return;
            }
            console.log("UO", userOperations);
        
            let result = await alchemyScaProvider.simulateUserOperation({
              account: alchemyScaProvider.account!,
              uo: userOperations.length > 1 ? userOperations : userOperations[0],
            });
            console.log("SIM", result);

            setSimStatus({ loading: false, error: null, success: 'Transfer simulated successfully!' });
          } catch (e: any) {
            console.error(e);
            setSimStatus({ loading: false, error: 'Simulation failed. Please try again.', success: null });
          }
    }
    return {simStatus, simTransfer};
  }
  