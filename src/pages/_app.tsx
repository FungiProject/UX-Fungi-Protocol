// Next
import type { AppProps } from "next/app";
import local from "next/font/local";
// Wagmi
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet, arbitrum, polygonMumbai, polygon } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

import "@/styles/globals.css";

const satoshi = local({
  src: [
    {
      path: "../../public/fonts/SatoshiRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SatoshiMedium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/SatoshiBold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

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
      <main className={satoshi.className}>
        <Component {...pageProps} />
      </main>
    </WagmiConfig>
  );
}
