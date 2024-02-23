import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MagicSigner } from "@alchemy/aa-signers/magic";
import { AlchemyMultichainClient } from "@/lib/alchemy/AlchemyMultichainClient";
import { MagicMultichainClient } from "@/lib/magic/MagicMultichainClient";
import { getProviderMultichainSetting, getProviderDefaultSettings } from "@/config/alchemyConfig";
import { Alchemy } from 'alchemy-sdk';
import { ARBITRUM } from "@/config/chains";
import { getMagicDefaultSettings, getMagicMultichainSetting } from "@/config/magicConfig";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import {
    SmartAccountSigner,
    getDefaultEntryPointAddress,
    Address
} from "@alchemy/aa-core";
import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";
import { getViemChain } from '@/config/chains';



export type FungiGlobalContextType = {
    alchemyClient?: Alchemy;
    magicClient?: MagicSigner;
    alchemyScaProvider: AlchemyProvider | undefined;
    scaAddress?: Address;
    chain: number;
    switchNetwork: (number) => void;
    isConnected: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
};

export const FungiGlobalContext = createContext({} as FungiGlobalContextType);

export function useGlobalContext() {
    return useContext(FungiGlobalContext) as FungiGlobalContextType;
}

export function FungiGlobalContextProvider({ children }: { children: ReactNode }) {
    const [alchemyMultichainClient, setAlchemyMultichainClient] = useState<AlchemyMultichainClient>();
    const [magicMultichainClient, setMagicMultichainClient] = useState<MagicMultichainClient>();

    const [alchemyClient, setAlchemyClient] = useState<Alchemy>();
    const [alchemyScaProvider, setAlchemyScaProvider] = useState<AlchemyProvider>();
    const [magicClient, setMagicClient] = useState<MagicSigner>();

    const [scaAddress, setScaAddress] = useState<Address>();
    const [chain, setChain] = useState(ARBITRUM);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {

        const defaultAlchemySettings = getProviderDefaultSettings(ARBITRUM);
        const overridesAlchemySettings = getProviderMultichainSetting();
        const multichainProv = new AlchemyMultichainClient(defaultAlchemySettings, overridesAlchemySettings);
        setAlchemyMultichainClient(multichainProv);

        const defaultMagicSettings = getMagicDefaultSettings();
        const overridesMagicSettings = getMagicMultichainSetting();
        const magicMultichain = new MagicMultichainClient(defaultMagicSettings, overridesMagicSettings);
        setMagicMultichainClient(magicMultichain);

    }, []);

    useEffect(() => {
        if (chain) {
            if (alchemyMultichainClient) {
                setAlchemyClient(alchemyMultichainClient?.forNetwork(chain) || alchemyMultichainClient?.forNetwork(ARBITRUM))
                setAlchemyScaProvider(alchemyMultichainClient?.forNetworkScProvider(chain))
            }

            if (magicMultichainClient) {
                setMagicClient(magicMultichainClient.forNetwork(chain))
            }
        }

    }, [chain, alchemyMultichainClient, magicMultichainClient, alchemyScaProvider])

    useEffect(()=>{
        (async ()=>{
            if(alchemyScaProvider?.isConnected() ){
                setScaAddress(await alchemyScaProvider?.getAddress());
            }
        })()
    },[alchemyScaProvider])

    const connectProviderToAccount = useCallback(
        (signer: SmartAccountSigner) => {
            if (!alchemyScaProvider) {
                return
            }
            const connectedProvider = alchemyScaProvider
                .connect((provider) => {
                    return new LightSmartContractAccount({
                        entryPointAddress: getDefaultEntryPointAddress(getViemChain(chain)),
                        chain: getViemChain(chain),
                        owner: signer,
                        factoryAddress: getDefaultLightAccountFactoryAddress(getViemChain(chain)),
                        rpcClient: provider,
                    })
                })


            setAlchemyScaProvider(connectedProvider);
            return connectedProvider;
        },
        [alchemyScaProvider, chain]
    );

    const disconnectProviderFromAccount = useCallback(() => {
        if (!alchemyScaProvider) {
            return
        }
        const disconnectedProvider = alchemyScaProvider.disconnect();
    
        setAlchemyScaProvider(disconnectedProvider);
        return disconnectedProvider;
    }, [alchemyScaProvider]);

    const login = useCallback(
        async () => {
            const signer = await magicClient;

            if (signer == null) {
                throw new Error("Magic not initialized");
            }

            await signer.authenticate({
                authenticate: async () => {
                    await signer.inner.wallet.connectWithUI();
                },
            });

            //setIsLoggedIn(true);
            connectProviderToAccount(signer);

            setScaAddress(await alchemyScaProvider?.getAddress());
            setIsConnected(true);
        },
        [magicClient, connectProviderToAccount, alchemyScaProvider]
    );

    const logout = useCallback(async () => {
        const signer = await magicClient;
    
        if (!signer) {
          return
        }
    
        if (!(await signer.inner.user.logout())) {
          throw new Error("Magic logout failed");
        }
    
        setIsConnected(false);
        disconnectProviderFromAccount();
        setScaAddress(undefined);
      }, [magicClient, disconnectProviderFromAccount]);

    const switchNetwork = useCallback((chainId: number) => {
        setChain(chainId);
    }, [])

    const state: FungiGlobalContextType = useMemo(() => {
        return {
            alchemyClient,
            magicClient,
            alchemyScaProvider,
            scaAddress,
            chain,
            switchNetwork,
            isLoading,
            isConnected,
            login,
            logout,
        };
    }, [alchemyClient, 
        magicClient, 
        scaAddress, 
        switchNetwork, 
        login, 
        alchemyScaProvider, 
        chain, 
        isLoading, 
        isConnected, 
        logout]);

    return <FungiGlobalContext.Provider value={state}>{children}</FungiGlobalContext.Provider>;
}
