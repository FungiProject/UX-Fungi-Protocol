// Next
import type { AppProps } from "next/app";
// Wagmi
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet, arbitrum, polygonMumbai, polygon } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { SettingsContextProvider } from "@/components/Gmx/context/SettingsContext/SettingsContextProvider";

import "@/styles/globals.css";

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet, arbitrum, polygonMumbai, polygon],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API as string }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new InjectedConnector({
      options: {
        shimDisconnect: false,
      },
    }),
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <SettingsContextProvider>
        <main className="font-dmSans">
          <Component {...pageProps} />
        </main>
      </SettingsContextProvider>
      ;
    </WagmiConfig>
  );
}
