import { useAlchemyProvider } from "@/hooks/useAlchemyProvider";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { arbitrum } from "viem/chains";
import { getRpcUrl } from "@/utils/gmx/config/chains";
import { Address, createWalletClient, custom } from "viem";
import {
  SmartAccountSigner,
  getDefaultEntryPointAddress,
  WalletClientSigner,
} from "@alchemy/aa-core";
import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";

type AlchemyAccountKitContextProps = {
  // Functions
  login: () => Promise<void>;
  logout: () => Promise<void>;

  // Properties
  provider: AlchemyProvider | null;
  ownerAddress?: Address;
  scaAddress?: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  isIdle: boolean;
  alchemyProvider: AlchemyProvider;
};

const defaultUnset: any = null;

const AlchemyAccountKitContext = createContext<AlchemyAccountKitContextProps>({
  // Default Values
  provider: defaultUnset,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  isLoggedIn: defaultUnset,
  isLoading: false,
  isIdle: false,
  scaAddress: defaultUnset,
  alchemyProvider: defaultUnset,
});

export const useAlchemyAccountKitContext = () =>
  useContext(AlchemyAccountKitContext);

export const AlchemyAccountKitProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  //Wagmi
  const { chain } = useNetwork();
  const { connect, connectors, isLoading, isIdle } = useConnect();
  const { isConnected } = useAccount();

  //Alchemy
  const [alchemyProvider, setAlchemyProvider] = useState<AlchemyProvider>(
    new AlchemyProvider({
      chain: chain ?? arbitrum,
      rpcUrl: chain ? getRpcUrl(chain.id)! : getRpcUrl(arbitrum.id)!,
    })
  );
  const [signer, setSigner] = useState<SmartAccountSigner>();

  const [scaAddress, setScaAddress] = useState<string>();

  const [ownerAddress, setOwnerAddress] = useState<Address>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const connectAlchemyProvider = useCallback(async () => {
    if (!chain || !isConnected) {
      return;
    }

    const providerConnector = await connectors[0].getProvider();
    const walletClient = createWalletClient({
      chain: chain,
      transport: custom(providerConnector),
    });
    const provSigner = new WalletClientSigner(walletClient, "json-rpc");
    setSigner(provSigner);

    const provAlchemyProvider = new AlchemyProvider({
      chain: chain,
      rpcUrl: getRpcUrl(chain.id)! ?? getRpcUrl(arbitrum.id)!,
    });

    const connectedProvider = provAlchemyProvider.connect((rpcClient) => {
      return new LightSmartContractAccount({
        rpcClient,
        owner: provSigner,
        chain: chain,
        entryPointAddress: getDefaultEntryPointAddress(chain),
        factoryAddress: getDefaultLightAccountFactoryAddress(chain),
      });
    });

    setAlchemyProvider(connectedProvider);
    setScaAddress(await connectedProvider.getAddress());
  }, [chain, connectors, isConnected]);

  const login = useCallback(async () => {
    try {
      connect({ connector: connectors[0] });
    } catch (error) {
      console.log(error);
    }
  }, [connect, connectors]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    connectAlchemyProvider();
  }, [connectAlchemyProvider, isConnected, isIdle]);

  const logout = useCallback(async () => {}, []);

  /*useEffect(() => {
    async function fetchData() {
      const signer = await magicSigner;
 
      if (signer == null) {
        throw new Error("Magic not initialized");
      }
 
      const isLoggedIn = await signer.inner.user.isLoggedIn();
 
      if (!isLoggedIn) {
        return;
      }
 
      await signer.authenticate({
        authenticate: async () => {},
      });
 
      setIsLoggedIn(isLoggedIn);
      connectProviderToAccount(signer);
      setOwnerAddress(await signer.getAddress() as Address);
      setScaAddress(await provider.getAddress());
    }
    fetchData();
    //}, [connectProviderToAccount, magicSigner, provider]);
  }, []);*/

  return (
    <AlchemyAccountKitContext.Provider
      value={{
        login,
        logout,
        isLoggedIn,
        provider: defaultUnset,
        ownerAddress,
        scaAddress,
        isLoading,
        isIdle,
        alchemyProvider,
      }}
    >
      {children}
    </AlchemyAccountKitContext.Provider>
  );
};
