
// React
import React, { useEffect, useState } from "react";
// Components
import PageContainer from "../Container/PageContainer";
import { MarketStats } from "../Gmx/gmcomponents/MarketStats";
import { useMarketTokensData, useMarketTokensAPR, useMarketsInfo } from "../Gmx/domain/markets"
import { getTokenData } from "../Gmx/domain/tokens"
import { getByKey } from "../Gmx/lib/objects";
import { useLocalStorageSerializeKey } from "../Gmx/lib/localstorage"
import { getSyntheticsDepositMarketKey } from "../Gmx/config/localStorage"
import { useChainId } from "../Gmx/lib/chains";
import { useSearchParams } from 'next/navigation'

import ResultsChart from "../Chart/ResultsChart";
import { GmSwapBox, Operation, Mode } from "../Gmx/gmcomponents/GmSwapBox/GmSwapBox";

type HomeProps = {
    getSelectedAction: (action: string) => void;
};

export default function GM() {

    const searchParams = useSearchParams()
    const market = searchParams.get('market')
    const { chainId } = useChainId();
    const { marketsInfoData = {}, tokensData } = useMarketsInfo(chainId);
    const markets = Object.values(marketsInfoData);
    
    const [operation, setOperation] = useState<Operation>(Operation.Deposit); //TODO fungi
    const { marketsTokensAPRData, marketsTokensIncentiveAprData } = useMarketTokensAPR(chainId);
    const { marketTokensData: depositMarketTokensData } = useMarketTokensData(chainId, { isDeposit: true });
    const { marketTokensData: withdrawalMarketTokensData } = useMarketTokensData(chainId, { isDeposit: false });
    const [selectedMarketKey, setSelectedMarketKey] = useLocalStorageSerializeKey<string | undefined>(
        getSyntheticsDepositMarketKey(chainId),
        undefined
    );
    const marketToken = getTokenData(
        operation === Operation.Deposit ? depositMarketTokensData : withdrawalMarketTokensData,
        selectedMarketKey
    );
    const marketInfo = getByKey(marketsInfoData, selectedMarketKey);
    //const [marketInfo, setMarketInfo] = useState(getByKey(marketsInfoData, "0x47c031236e19d024b42f8AE6780E44A573170703"));
    //let marketInfo = getByKey(marketsInfoData, "0x47c031236e19d024b42f8AE6780E44A573170703")
    let [mode, setMode] = useState<Mode>(Mode.Single);

    useEffect(() => {
        let currentMarket = market; //TODO fungi
        if(!currentMarket){
            currentMarket = "0x47c031236e19d024b42f8AE6780E44A573170703"
        }
        console.log(currentMarket)
        setSelectedMarketKey(currentMarket)
        //setMarketInfo(getByKey(marketsInfoData, currentMarket))
    }, [market])

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
                    />}
            />
        </main>
    );
}



