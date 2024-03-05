import type { AppProps } from "next/app";
import { SettingsContextProvider } from "@/utils/gmx/context/SettingsContext/SettingsContextProvider";
import "@/styles/globals.css";
import { SubaccountContextProvider } from "@/utils/gmx/context/SubaccountContext/SubaccountContext";
import { SyntheticsEventsProvider } from "@/utils/gmx/context/SyntheticsEvents";
import { useEffect } from "react";
import { REFERRAL_CODE_QUERY_PARAM } from "@/utils/gmx/lib/legacy";
import { encodeReferralCode } from "@/utils/gmx/domain/referrals";
import { REFERRAL_CODE_KEY } from "@/utils/gmx/config/localStorage";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";
import { SWRConfig } from "swr";
import { swrGCMiddleware } from "@/lib/swrMiddlewares";
import { FungiGlobalContextProvider } from "@/context/FungiGlobalContext";
import { NotificationContextProvider } from "@/context/NotificationContextProvider";

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
      <NotificationContextProvider>
        <FungiGlobalContextProvider>
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
                <SyntheticsEventsProvider>
                  <main className="font-dmSans">
                    <Component {...pageProps} />
                  </main>
                </SyntheticsEventsProvider>
              </SubaccountContextProvider>
            </SettingsContextProvider>{" "}
          </SWRConfig>
        </FungiGlobalContextProvider>{" "}
      </NotificationContextProvider>
      <script
        async
        src="/charting_library/charting_library.standalone.js"
      ></script>
    </main>
  );
}
