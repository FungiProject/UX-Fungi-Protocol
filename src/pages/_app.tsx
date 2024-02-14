import type { AppProps } from "next/app";
import { SettingsContextProvider } from "@/utils/gmx/context/SettingsContext/SettingsContextProvider";
import "@/styles/globals.css";
import { SubaccountContextProvider } from "@/utils/gmx/context/SubaccountContext/SubaccountContext";
import { SyntheticsEventsProvider } from "@/utils/gmx/context/SyntheticsEvents";
import WalletProvider from "@/lib/wallets/WalletProvider";
import { cssTransition, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TOAST_AUTO_CLOSE_TIME } from "@/utils/gmx/config/ui";
import { useEffect } from "react";
import { REFERRAL_CODE_QUERY_PARAM } from "@/utils/gmx/lib/legacy";
import { encodeReferralCode } from "@/utils/gmx/domain/referrals";
import { REFERRAL_CODE_KEY } from "@/utils/gmx/config/localStorage";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";

const Zoom = cssTransition({
  enter: "zoomIn",
  exit: "zoomOut",
  appendPosition: false,
  collapse: true,
  collapseDuration: 200,
  duration: 200,
});

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
      <ToastContainer
        limit={1}
        transition={Zoom}
        position="bottom-right"
        autoClose={TOAST_AUTO_CLOSE_TIME}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        draggable={false}
        pauseOnHover
      />
      <script
        async
        src="/charting_library/charting_library.standalone.js"
      ></script>
    </main>
  );
}
