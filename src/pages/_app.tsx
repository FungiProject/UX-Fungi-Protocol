import type { AppProps } from "next/app";;
import { SettingsContextProvider } from "@/utils/gmx/context/SettingsContext/SettingsContextProvider";
import "@/styles/globals.css";
import { SubaccountContextProvider } from "@/utils/gmx/context/SubaccountContext/SubaccountContext";
import { SyntheticsEventsProvider } from "@/utils/gmx/context/SyntheticsEvents";
import WalletProvider from "@/lib/wallets/WalletProvider";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <WalletProvider>
        <SettingsContextProvider>
          <SubaccountContextProvider>
            <SyntheticsEventsProvider>
              <main className="font-dmSans">
                <Component {...pageProps} />
              </main>
            </SyntheticsEventsProvider>
          </SubaccountContextProvider>
        </SettingsContextProvider>{" "}
      </WalletProvider>
    <script async src="/charting_library/charting_library.standalone.js"></script>
    </main>
  );
}
