// React
import React, { useEffect, useState, useRef } from "react";
// Components
import PageContainer from "../Container/PageContainer";
import { MarketStats } from "../Gmx/gmcomponents/MarketStats";
import { useMarketTokensData, useMarketsInfo, } from "../Gmx/domain/synthetics/markets";
import { useMarketTokensAPR } from "../Gmx/domain/synthetics/markets/useMarketTokensAPR";
import { getTokenData } from "../Gmx/domain/synthetics/tokens";
import { getByKey } from "../Gmx/lib/objects";
import { useLocalStorageSerializeKey } from "../Gmx/lib/localStorage";
import { getSyntheticsDepositMarketKey } from "../Gmx/config/localStorage";
import { useChainId } from "../Gmx/lib/chains";
import { useSearchParams } from "next/navigation";

import ResultsChart from "../Chart/ResultsChart";
import {
  GmSwapBox,
  Operation,
  Mode,
} from "../Gmx/gmcomponents/GmSwapBox/GmSwapBox";

type HomeProps = {
  getSelectedAction: (action: string) => void;
};

export default function GM() {
  const searchParams = useSearchParams();
  const market = searchParams.get("market");
  const { chainId } = useChainId();
  
  const gmSwapBoxRef = useRef<HTMLDivElement>(null);
  function buySellActionHandler() {
    gmSwapBoxRef?.current?.scrollIntoView();
    window.scrollBy(0, -25); // add some offset
  }
  
  const { marketsInfoData = {}, tokensData } = useMarketsInfo(chainId);
  const markets = Object.values(marketsInfoData);

  const { marketTokensData: depositMarketTokensData } = useMarketTokensData(chainId,{ isDeposit: true });
  const { marketTokensData: withdrawalMarketTokensData } = useMarketTokensData(chainId,{ isDeposit: false });
        
  const { marketsTokensAPRData, marketsTokensIncentiveAprData } = useMarketTokensAPR(chainId);
  const [operation, setOperation] = useState<Operation>(Operation.Deposit);
  let [mode, setMode] = useState<Mode>(Mode.Single);
  if (operation === Operation.Withdrawal) {
    mode = Mode.Pair;
  }

  const [selectedMarketKey, setSelectedMarketKey] = useLocalStorageSerializeKey<
    string | undefined
  >(getSyntheticsDepositMarketKey(chainId), undefined);
  
  const marketInfo = getByKey(marketsInfoData, selectedMarketKey);

  const marketToken = getTokenData(
    operation === Operation.Deposit
      ? depositMarketTokensData
      : withdrawalMarketTokensData,
    selectedMarketKey
  );

  return (
    <main>
      <PageContainer
        main={
          <MarketStats
            marketsTokensAPRData={marketsTokensAPRData}
            marketsTokensIncentiveAprData={marketsTokensIncentiveAprData}
            marketsInfoData={marketsInfoData}
            marketTokensData={depositMarketTokensData}
            marketInfo={marketInfo}
            marketToken={marketToken}
          />
        }
        secondary={
          <GmSwapBox
            selectedMarketAddress={selectedMarketKey}
            markets={markets}
            shouldDisableValidation={false}
            marketsInfoData={marketsInfoData}
            tokensData={tokensData}
            onSelectMarket={setSelectedMarketKey}
            //setPendingTxns={p.setPendingTxns}
            operation={operation}
            mode={mode}
            setMode={setMode}
            setOperation={setOperation}
          />
        }
      />
    </main>
  );
}
