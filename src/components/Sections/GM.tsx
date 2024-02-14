import React, { useEffect, useState, useRef } from "react";
import PageContainer from "../Container/PageContainer";
import { MarketStats } from "../Gmx/gm/MarketStats/MarketStats";
import {
  useMarketTokensData,
  useMarketsInfo,
} from "../../utils/gmx/domain/synthetics/markets";
import { useMarketTokensAPR } from "../../utils/gmx/domain/synthetics/markets/useMarketTokensAPR";
import { getTokenData } from "../../utils/gmx/domain/synthetics/tokens";
import { getByKey } from "../../utils/gmx/lib/objects";
import { useLocalStorageSerializeKey } from "../../utils/gmx/lib/localstorage";
import { getSyntheticsDepositMarketKey } from "../../utils/gmx/config/localStorage";
import { useChainId } from "../../utils/gmx/lib/chains";
import { useSearchParams } from "next/navigation";
import { GmSwapBox, Operation, Mode } from "../Gmx/gm/GmSwapBox/GmSwapBox";

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

  const [visible, setVisible] = useState(false);

  const { marketsInfoData = {}, tokensData } = useMarketsInfo(chainId);
  const markets = Object.values(marketsInfoData);

  const { marketTokensData: depositMarketTokensData } = useMarketTokensData(
    chainId,
    { isDeposit: true }
  );
  const { marketTokensData: withdrawalMarketTokensData } = useMarketTokensData(
    chainId,
    { isDeposit: false }
  );

  const { marketsTokensAPRData, marketsTokensIncentiveAprData } =
    useMarketTokensAPR(chainId);
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
          <div className="h-[690px] overflow-auto">
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
          </div>
        }
      />
    </main>
  );
}
