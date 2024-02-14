import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { UniversalWalletConnector } from "@magiclabs/wagmi-connector";
import { AlchemyAccountKitProvider } from "./AlchemyAccountKitProvider";
import { getRpcUrl } from "@/utils/gmx/config/chains";

export default function WalletProvider({ children }) {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [arbitrum],
    [publicProvider()]
  );

  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
    connectors: [
      new UniversalWalletConnector({
        chains,
        options: {
          apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY! || "",
          networks: [
            {
              chainId: arbitrum.id,
              rpcUrl: getRpcUrl(arbitrum.id)!,
            },
          ],
        },
      }),
    ],
  });

  return (
    <WagmiConfig config={config}>
      <AlchemyAccountKitProvider>{children}</AlchemyAccountKitProvider>
    </WagmiConfig>
  );
}
