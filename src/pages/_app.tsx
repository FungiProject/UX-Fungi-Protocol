// Next
import type { AppProps } from "next/app";
import local from "next/font/local";
// Wagmi
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet, arbitrum, polygonMumbai } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

import "@/styles/globals.css";

const satoshi = local({
  src: "../../public/fonts/Satoshi.otf",
  display: "swap",
});

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet, arbitrum, polygonMumbai],
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
      <main className={satoshi.className}>
        <Component {...pageProps} />
      </main>
    </WagmiConfig>
  );
}
