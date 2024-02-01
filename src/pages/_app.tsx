// Next
import type { AppProps } from "next/app";
// Wagmi
import {
  connectorsForWallets,
  darkTheme,
  RainbowKitProvider,
  Theme,
  WalletList,
} from "@rainbow-me/rainbowkit";
import {
  safeWallet,
  rabbyWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { arbitrum, arbitrumGoerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { SettingsContextProvider } from "@/utils/gmx/context/SettingsContext/SettingsContextProvider";
import merge from "lodash/merge";
import "@/styles/globals.css";
import { SubaccountContextProvider } from "@/utils/gmx/context/SubaccountContext/SubaccountContext";
import { SyntheticsEventsProvider } from "@/utils/gmx/context/SyntheticsEvents";

const walletTheme = merge(darkTheme(), {
  colors: {
    modalBackground: "#16182e",
    accentColor: "#9da5f2",
    menuItemBackground: "#808aff14",
  },
  radii: {
    modal: "4px",
    menuButton: "4px",
  },
} as Theme);

const { chains, provider } = configureChains(
  [arbitrum, arbitrumGoerli],
  [publicProvider()]
);

const recommendedWalletList: WalletList = [
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      safeWallet({ chains }),
      rabbyWallet({ chains }),
    ],
  },
];

const connectors = connectorsForWallets([...recommendedWalletList]);

const config = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <WagmiConfig client={config}>
        {" "}
        <RainbowKitProvider
          theme={walletTheme}
          chains={chains}
          modalSize="compact"
        >
          <SettingsContextProvider>
            <SubaccountContextProvider>
              <SyntheticsEventsProvider>
                <main className="font-dmSans">
                  <Component {...pageProps} />
                </main>
              </SyntheticsEventsProvider>
            </SubaccountContextProvider>
          </SettingsContextProvider>{" "}
        </RainbowKitProvider>
      </WagmiConfig>
      <script
        async
        src="/charting_library/charting_library.standalone.js"
      ></script>
    </main>
  );
}
