import TVChartContainer, { ChartLine } from "./TVChartContainer";
import ChartTokenSelector from "../ChartTokenSelector/ChartTokenSelector";
import {
  convertTokenAddress,
  getPriceDecimals,
  getToken,
  isChartAvailabeForToken,
} from "../../../../utils/gmx/config/tokens";
import { SUPPORTED_RESOLUTIONS_V2 } from "../../../../utils/gmx/config/tradingview";
import {
  OrdersInfoData,
  PositionOrderInfo,
  isIncreaseOrderType,
  isSwapOrderType,
} from "../../../../utils/gmx/domain/synthetics/orders";
import { PositionsInfoData } from "../../../../utils/gmx/domain/synthetics/positions";
import {
  TokensData,
  getTokenData,
} from "../../../../utils/gmx/domain/synthetics/tokens";
import { use24hPriceDelta } from "../../../../utils/gmx/domain/synthetics/tokens/use24PriceDelta";
import { useOracleKeeperFetcher } from "../../../../utils/gmx/domain/synthetics/tokens/useOracleKeeperFetcher";
import { SyntheticsTVDataProvider } from "../../../../utils/gmx/domain/synthetics/tradingview/SyntheticsTVDataProvider";
import { Token } from "../../../../utils/gmx/domain/tokens";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import { CHART_PERIODS, USD_DECIMALS } from "../../../../utils/gmx/lib/legacy";
import { useLocalStorageSerializeKey } from "../../../../utils/gmx/lib/localstorage";
import {
  formatAmount,
  formatUsd,
  numberWithCommas,
} from "../../../../utils/gmx/lib/numbers";
import { useEffect, useMemo, useState } from "react";
import { TradeFlags } from "../../../../utils/gmx/domain/synthetics/trade/useTradeFlags";
import {
  AvailableTokenOptions,
  TradeType,
} from "../../../../utils/gmx/domain/synthetics/trade";
import {
  MarketsInfoData,
  getMarketIndexName,
  getMarketPoolName,
} from "../../../../utils/gmx/domain/synthetics/markets";
import { getByKey } from "../../../../utils/gmx/lib/objects";
import { useNotification } from "@/context/NotificationContextProvider";

export type Props = {
  tradePageVersion: number;
  setTradePageVersion: (version: number) => void;
  savedShouldShowPositionLines: boolean;
  onSelectChartTokenAddress: (
    tokenAddress: string,
    marketTokenAddress?: string,
    tradeType?: TradeType
  ) => void;
  ordersInfo?: OrdersInfoData;
  positionsInfo?: PositionsInfoData;
  tokensData?: TokensData;
  chartTokenAddress?: string;
  availableTokens?: Token[];
  tradeFlags?: TradeFlags;
  avaialbleTokenOptions: AvailableTokenOptions;
  marketsInfoData?: MarketsInfoData;
  currentTradeType?: TradeType;
};

const DEFAULT_PERIOD = "5m";

export function TVChart({
  ordersInfo,
  positionsInfo,
  tokensData,
  savedShouldShowPositionLines,
  chartTokenAddress,
  onSelectChartTokenAddress,
  availableTokens,
  tradeFlags,
  tradePageVersion,
  setTradePageVersion,
  avaialbleTokenOptions,
  marketsInfoData,
  currentTradeType,
}: Props) {
  const { chainId } = useChainId();
  const oracleKeeperFetcher = useOracleKeeperFetcher(chainId);
  const [dataProvider, setDataProvider] = useState<SyntheticsTVDataProvider>();
  const { showNotification } = useNotification();
  let [period, setPeriod] = useLocalStorageSerializeKey(
    [chainId, "Chart-period-v2"],
    DEFAULT_PERIOD
  );

  if (!period || !(period in CHART_PERIODS)) {
    period = DEFAULT_PERIOD;
  }

  const chartToken = getTokenData(tokensData, chartTokenAddress);

  const tokenOptions: Token[] | undefined = availableTokens?.filter((token) =>
    isChartAvailabeForToken(chainId, token.symbol)
  );

  const selectedTokenOption = chartTokenAddress
    ? getToken(chainId, chartTokenAddress)
    : undefined;
  const dayPriceDelta = use24hPriceDelta(chainId, chartToken?.symbol);

  const chartLines = useMemo(() => {
    if (!chartTokenAddress) {
      return [];
    }

    const orderLines: ChartLine[] = Object.values(ordersInfo || {})
      .filter((order) => {
        if (isSwapOrderType(order.orderType)) {
          return false;
        }

        const positionOrder = order as PositionOrderInfo;

        return (
          positionOrder.marketInfo &&
          positionOrder.triggerPrice &&
          convertTokenAddress(
            chainId,
            positionOrder.marketInfo.indexTokenAddress,
            "wrapped"
          ) === convertTokenAddress(chainId, chartTokenAddress, "wrapped")
        );
      })
      .map((order) => {
        const positionOrder = order as PositionOrderInfo;
        const priceDecimal = getPriceDecimals(
          chainId,
          positionOrder.indexToken.symbol
        );

        const longOrShortText = order.isLong ? `Long` : `Short`;
        const orderTypeText = isIncreaseOrderType(order.orderType)
          ? `Inc.`
          : `Dec.`;
        const tokenSymbol = getTokenData(
          tokensData,
          positionOrder.marketInfo.indexTokenAddress,
          "native"
        )?.symbol;

        return {
          title: `${longOrShortText} ${orderTypeText} ${tokenSymbol}`,
          price: parseFloat(
            formatAmount(positionOrder.triggerPrice, USD_DECIMALS, priceDecimal)
          ),
        };
      });

    const positionLines = Object.values(positionsInfo || {}).reduce(
      (acc, position) => {
        const priceDecimal = getPriceDecimals(
          chainId,
          position.indexToken.symbol
        );
        if (
          position.marketInfo &&
          convertTokenAddress(
            chainId,
            position.marketInfo.indexTokenAddress,
            "wrapped"
          ) === convertTokenAddress(chainId, chartTokenAddress, "wrapped")
        ) {
          const longOrShortText = position.isLong ? `Long` : `Short`;
          const tokenSymbol = getTokenData(
            tokensData,
            position.marketInfo?.indexTokenAddress,
            "native"
          )?.symbol;
          const liquidationPrice = formatAmount(
            position?.liquidationPrice,
            USD_DECIMALS,
            priceDecimal
          );

          acc.push({
            title: `Open ${longOrShortText} ${tokenSymbol}`,
            price: parseFloat(
              formatAmount(position.entryPrice, USD_DECIMALS, priceDecimal)
            ),
          });
          if (liquidationPrice && liquidationPrice !== "NA") {
            acc.push({
              title: `Liq. ${longOrShortText} ${tokenSymbol}`,
              price: parseFloat(liquidationPrice),
            });
          }
        }

        return acc;
      },
      [] as ChartLine[]
    );

    return orderLines.concat(positionLines);
  }, [chainId, chartTokenAddress, ordersInfo, positionsInfo, tokensData]);

  function onSelectTokenOption(
    address: string,
    marketTokenAddress?: string,
    tradeType?: TradeType
  ) {
    onSelectChartTokenAddress(address, marketTokenAddress, tradeType);

    if (marketTokenAddress) {
      const marketInfo = getByKey(marketsInfoData, marketTokenAddress);
      const nextTradeType = tradeType ?? currentTradeType;

      if (nextTradeType === TradeType.Swap) return;
      if (marketInfo && nextTradeType) {
        const indexName = getMarketIndexName(marketInfo);
        const poolName = getMarketPoolName(marketInfo);

        showNotification({
          message: `${
            nextTradeType === TradeType.Long ? `Long` : `Short`
          } ${indexName} - ${poolName} market selected`,
          type: "success",
        });
      }
    }
  }

  function onSelectChartToken(token: Token) {
    onSelectChartTokenAddress(token.address);
  }

  useEffect(() => {
    setDataProvider(
      new SyntheticsTVDataProvider({
        resolutions: SUPPORTED_RESOLUTIONS_V2,
        oracleKeeperFetcher,
      })
    );
  }, [oracleKeeperFetcher]);

  useEffect(
    function updatePeriod() {
      if (!period || !(period in CHART_PERIODS)) {
        setPeriod(DEFAULT_PERIOD);
      }
    },
    [period, setPeriod]
  );

  return (
    <div className="ExchangeChart tv">
      <div className="ExchangeChart-header">
        <div className="ExchangeChart-info">
          <div className="flex justify-between mx-6 my-[20px] w-10/12">
            <ChartTokenSelector
              chainId={chainId}
              selectedToken={selectedTokenOption}
              className="chart-token-selector"
              onSelectToken={onSelectTokenOption}
              tradeFlags={tradeFlags}
              options={tokenOptions}
              avaialbleTokenOptions={avaialbleTokenOptions}
              positionsInfo={positionsInfo}
            />
            <div className="items-center flex">
              <div>
                {formatUsd(chartToken?.prices?.maxPrice, {
                  displayDecimals: chartToken?.priceDecimals,
                }) || "..."}
              </div>
            </div>

            <div className="Chart-24h-change text-center">
              <div className="ExchangeChart-info-label">24h Change</div>
              <div
                className={`${
                  dayPriceDelta?.deltaPercentage &&
                  dayPriceDelta?.deltaPercentage > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {dayPriceDelta?.deltaPercentageStr || "-"}
              </div>
            </div>
            <div className="ExchangeChart-additional-info">
              <div className="ExchangeChart-info-label">24h High</div>
              <div>
                {dayPriceDelta?.high
                  ? numberWithCommas(
                      dayPriceDelta.high.toFixed(chartToken?.priceDecimals || 2)
                    )
                  : "-"}
              </div>
            </div>
            <div className="ExchangeChart-additional-info Chart-24h-low">
              <div className="ExchangeChart-info-label">24h Low</div>
              <div>
                {dayPriceDelta?.low
                  ? numberWithCommas(
                      dayPriceDelta?.low.toFixed(chartToken?.priceDecimals || 2)
                    )
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ExchangeChart-bottom App-box App-box-border">
        {chartToken && (
          <TVChartContainer
            chartLines={chartLines}
            savedShouldShowPositionLines={savedShouldShowPositionLines}
            symbol={chartToken.symbol}
            chainId={chainId}
            onSelectToken={onSelectChartToken}
            dataProvider={dataProvider}
            period={period}
            setPeriod={setPeriod}
            chartToken={{
              symbol: chartToken.symbol,
              ...chartToken.prices,
            }}
            supportedResolutions={SUPPORTED_RESOLUTIONS_V2}
            tradePageVersion={tradePageVersion}
            setTradePageVersion={setTradePageVersion}
          />
        )}
      </div>
    </div>
  );
}
