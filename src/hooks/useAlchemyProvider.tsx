import { LightSmartContractAccount, getDefaultLightAccountFactoryAddress } from "@alchemy/aa-accounts";
import { AlchemyProvider, SupportedChains } from "@alchemy/aa-alchemy";
import { SmartAccountSigner, getDefaultEntryPointAddress, WalletClientSigner } from "@alchemy/aa-core";
import { useCallback, useEffect, useState } from "react";
import { Address, createWalletClient, custom } from "viem";
import { sepolia, arbitrumGoerli, arbitrum } from "viem/chains";
import { useNetwork, useConnect, useAccount } from "wagmi";
import { getRpcUrl } from "@/components/Gmx/config/chains";


export const useAlchemyProvider = () => {

  const { connectors } = useConnect();
  const { isConnected } = useAccount()
  const { chain } = useNetwork();
 
  const [signer, setSigner] = useState<SmartAccountSigner>();

  const [alchemyProvider, setAlchemyProvider] = useState<AlchemyProvider>(
    new AlchemyProvider({
      chain: chain ?? arbitrum,
      rpcUrl: chain ? getRpcUrl(chain.id)! : getRpcUrl(arbitrum.id)! ,
    }),
  );


  useEffect(()=>{
    if(!chain || !isConnected) {
      return
    }

    (async () => {
      const providerConnector = await connectors[0].getProvider();
      const walletClient = createWalletClient({ chain: chain, transport: custom(providerConnector) });
      setSigner(new WalletClientSigner(walletClient, "json-rpc"))
    })()

    setAlchemyProvider(new AlchemyProvider({
      chain: chain,
      rpcUrl: getRpcUrl(chain.id)! ?? getRpcUrl(arbitrum.id)! ,
    }))

  },[setAlchemyProvider, chain, isConnected, connectors])



  const connectProviderToAccount = useCallback(
    (account?: Address) => {
      if (!signer || !chain) {
        return
      }

      const connectedProvider = alchemyProvider
        .connect((rpcClient) => {
          return new LightSmartContractAccount({
            rpcClient,
            owner: signer,
            chain: chain,
            entryPointAddress: getDefaultEntryPointAddress(chain),
            factoryAddress: getDefaultLightAccountFactoryAddress(chain),
          });
        })

      setAlchemyProvider(connectedProvider);

   
      
      //(async () => { console.log(await connectedProvider.account.getOwner()) })()
      (async () => { console.log(await signer.getAddress()) })()

      console.log("[useAlchemyProvider] Alchemy Provider connected to account %s \ (Signer type %s)",connectedProvider.account.getAddress(), signer.signerType);

      return connectedProvider;
    },
    [alchemyProvider, chain, signer],
  );

  const disconnectProviderFromAccount = useCallback(() => {
    const disconnectedProvider = alchemyProvider.disconnect();

    setAlchemyProvider(disconnectedProvider);
    return disconnectedProvider;
  }, [alchemyProvider]);

  return { alchemyProvider, connectProviderToAccount, disconnectProviderFromAccount };
};