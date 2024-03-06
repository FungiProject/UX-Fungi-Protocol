import { useEffect, useState } from "react";
import { sleep } from "../../../utils/gmx/lib/sleep";
import {
  ARBITRUM,
  ARBITRUM_GOERLI,
  AVALANCHE,
  AVALANCHE_FUJI,
  getChainName,
} from "../../../utils/gmx/config/chains";
import { switchNetwork } from "../../../utils/gmx/lib/wallets";
import { isDevelopment } from "../../../utils/gmx/config/env";
import useWallet from "../../../utils/gmx/lib/wallets/useWallet";

export function SyntheticsFallbackPage() {
  const { active } = useWallet();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for chainId to be loaded before rendering
    sleep(100).then(() => setIsLoaded(true));
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="page-layout">
      <div className="page-not-found-container">
        <div className="page-not-found">
          <h2>V2 doesn't currently support this network</h2>

          <p className="go-back">
            <div>
              <span>Switch to:</span>
            </div>

            <br />
            <div
              className="clickable underline"
              onClick={() => switchNetwork(ARBITRUM, active)}
            >
              {getChainName(ARBITRUM)}
            </div>

            <div
              className="clickable underline"
              onClick={() => switchNetwork(AVALANCHE, active)}
            >
              {getChainName(AVALANCHE)}
            </div>

            {isDevelopment() && (
              <>
                <div
                  className="clickable underline"
                  onClick={() => switchNetwork(AVALANCHE_FUJI, active)}
                >
                  {getChainName(AVALANCHE_FUJI)}
                </div>

                <div
                  className="clickable underline"
                  onClick={() => switchNetwork(ARBITRUM_GOERLI, active)}
                >
                  {getChainName(ARBITRUM_GOERLI)}
                </div>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
