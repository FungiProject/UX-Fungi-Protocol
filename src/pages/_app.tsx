// Next
import type { AppProps } from "next/app";
// Wagmi
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet, arbitrum, polygonMumbai, polygon } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { SettingsContextProvider } from "@/components/Gmx/context/SettingsContext/SettingsContextProvider";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { useRouter } from "next/router";

import "@/styles/globals.css";
import { useEffect } from "react";

i18n.activate("en");
i18n.activate("es");

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
  const { locale } = useRouter();
  console.log(locale);
  useEffect(() => {
    async function load(locale: any) {
      const { messages } = await import(`../locales/${locale}/messages.po`);

      i18n.load(locale, messages);
      i18n.activate(locale);
    }

    load(locale);
  }, [locale]);

  return (
    <WagmiConfig config={config}>
      <I18nProvider i18n={i18n}>
        {/* <SettingsContextProvider> */}
        <main className="font-dmSans">
          <Component {...pageProps} />
        </main>
        {/* </SettingsContextProvider> */}
      </I18nProvider>
    </WagmiConfig>
  );
}
