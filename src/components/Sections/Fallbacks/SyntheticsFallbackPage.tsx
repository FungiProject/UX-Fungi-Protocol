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
import PageContainer from "@/components/Container/PageContainer";

export function SyntheticsFallbackPage() {
  const { active } = useWallet();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wait for chainId to be loaded before rendering
    sleep(100).then(() => setIsLoaded(true));
  }, []);

  if (!isLoaded) return null;

  return (
    <PageContainer
      main={<div>Credit</div>}
      secondary={<div>Credit</div>}
      page="Credit Section"
      keepWorkingMessage={
        <div className="text-center">
          <span>V2 doesn't currently support this network.</span>
          <div className="mt-2">Switch to Arbitrum.</div>
        </div>
      }
    />
  );
}
