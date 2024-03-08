// React
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
// Next
import type { AppProps } from "next/app";
// Styles
import "@/styles/globals.css";
// Utils
import { REFERRAL_CODE_QUERY_PARAM } from "@/utils/gmx/lib/legacy";
import { encodeReferralCode } from "@/utils/gmx/domain/referrals";
import { REFERRAL_CODE_KEY } from "@/utils/gmx/config/localStorage";
import { SubaccountContextProvider } from "@/utils/gmx/context/SubaccountContext/SubaccountContext";
import { SyntheticsEventsProvider } from "@/utils/gmx/context/SyntheticsEvents";
import { SettingsContextProvider } from "@/utils/gmx/context/SettingsContext/SettingsContextProvider";
// Ethers
import { ethers } from "ethers";
// Swr
import { SWRConfig } from "swr";
// Lib
import { swrGCMiddleware } from "@/lib/swrMiddlewares";
// Context
import { FungiContextProvider } from "@/context/FungiContextProvider";
import { NotificationContextProvider } from "@/context/NotificationContextProvider";
import { ModalContextProvider } from "@/context/ModalContextProvider";

export default function App({ Component, pageProps }: AppProps) {
  const history = useHistory();

  useEffect(() => {
    let referralCode = REFERRAL_CODE_QUERY_PARAM;

    if (referralCode && referralCode.length <= 20) {
      const encodedReferralCode = encodeReferralCode(referralCode);
      if (encodedReferralCode !== ethers.constants.HashZero) {
        localStorage.setItem(REFERRAL_CODE_KEY, encodedReferralCode);
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.has(REFERRAL_CODE_QUERY_PARAM)) {
          queryParams.delete(REFERRAL_CODE_QUERY_PARAM);
          history.replace({
            search: queryParams.toString(),
          });
        }
      }
    }
  }, [history]);

  return (
    <main>
      {" "}
      <FungiContextProvider>
        <SWRConfig
          value={{
            refreshInterval: 50000,
            refreshWhenHidden: false,
            refreshWhenOffline: false,
            use: [swrGCMiddleware as any],
          }}
        >
          <SettingsContextProvider>
            <SubaccountContextProvider>
              <NotificationContextProvider>
                <ModalContextProvider>
                  <SyntheticsEventsProvider>
                    <main className="font-dmSans">
                      <Component {...pageProps} />
                    </main>
                  </SyntheticsEventsProvider>{" "}
                </ModalContextProvider>
              </NotificationContextProvider>
            </SubaccountContextProvider>
          </SettingsContextProvider>{" "}
        </SWRConfig>
      </FungiContextProvider>
      <script
        async
        src="/charting_library/charting_library.standalone.js"
      ></script>
    </main>
  );
}
