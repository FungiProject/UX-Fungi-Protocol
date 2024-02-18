import { ReactNode, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AlchemyMultichainClient } from "@/lib/alchemy/AlchemyMultichainClient";
import { getProviderMultichainSetting, getProviderDefaultSettings } from "@/config/alchemyConfig";
import { ARBITRUM } from "@/config/chains";

export type FungiGlobalContextType = {
    alchemyClient?: AlchemyMultichainClient;
};

export const FungiGlobalContext = createContext({} as FungiGlobalContextType);

export function useGlobalContext() {
    return useContext(FungiGlobalContext) as FungiGlobalContextType;
}

export function FungiGlobalContextProvider({ children }: { children: ReactNode }) {
    const [alchemyClient, setAlchemyClient] = useState<AlchemyMultichainClient>();

    useEffect(() => {

        const defaultSettings = getProviderDefaultSettings(ARBITRUM);
        const overrides = getProviderMultichainSetting();
        const multichainProv = new AlchemyMultichainClient(defaultSettings, overrides);
        setAlchemyClient(multichainProv);

    }, []);

    const state: FungiGlobalContextType = useMemo(() => {
        return {
            alchemyClient,
        };
    }, [alchemyClient]);

    return <FungiGlobalContext.Provider value={state}>{children}</FungiGlobalContext.Provider>;
}
