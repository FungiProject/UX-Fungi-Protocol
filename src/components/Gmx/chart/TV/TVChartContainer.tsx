import Loader from "../../../Loader/LoaderGMX";
import { TV_SAVE_LOAD_CHARTS_KEY } from "../../../../utils/gmx/config/localStorage";
import {
  getPriceDecimals,
  isChartAvailabeForToken,
} from "../../../../utils/gmx/config/tokens";
import { SUPPORTED_RESOLUTIONS_V1 } from "../../../../utils/gmx/config/tradingview";
import { Token, getMidPrice } from "../../../../utils/gmx/domain/tokens";
import { TVDataProvider } from "../../../../utils/gmx/domain/tradingview/TVDataProvider";
import useTVDatafeed from "../../../../utils/gmx/domain/tradingview/useTVDatafeed";
import { getObjectKeyFromValue } from "../../../../utils/gmx/domain/tradingview/utils";
import { BigNumber } from "ethers";
import { USD_DECIMALS } from "../../../../utils/gmx/lib/legacy";
import { formatAmount } from "../../../../utils/gmx/lib/numbers";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalStorage, useMedia } from "react-use";
import {
  ChartData,
  IChartingLibraryWidget,
  IPositionLineAdapter,
} from "../../../../charting_library";
import { SaveLoadAdapter } from "../../../../utils/gmx/SaveLoadAdapter";
import {
  defaultChartProps,
  disabledFeaturesOnMobile,
} from "../../../../utils/gmx/constants";

export type ChartLine = {
  price: number;
  title: string;
};

type Props = {
  symbol: string;
  chainId: number;
  savedShouldShowPositionLines: boolean;
  chartLines: ChartLine[];
  onSelectToken: (token: Token) => void;
  period: string;
  setPeriod: (period: string) => void;
  dataProvider?: TVDataProvider;
  chartToken: {
    symbol: string;
    minPrice: BigNumber;
    maxPrice: BigNumber;
  };
  supportedResolutions: typeof SUPPORTED_RESOLUTIONS_V1;
  tradePageVersion: number;
  setTradePageVersion: (version: number) => void;
};

export default function TVChartContainer({
  symbol,
  chainId,
  savedShouldShowPositionLines,
  chartLines,
  onSelectToken,
  dataProvider,
  period,
  setPeriod,
  chartToken,
  supportedResolutions,
  tradePageVersion,
  setTradePageVersion,
}: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
  const [chartReady, setChartReady] = useState(false);
  const [chartDataLoading, setChartDataLoading] = useState(true);
  const [tvCharts, setTvCharts] = useLocalStorage<ChartData[] | undefined>(
    TV_SAVE_LOAD_CHARTS_KEY,
    []
  );
  const { datafeed } = useTVDatafeed({ dataProvider });
  const isMobile = useMedia("(max-width: 550px)");
  const symbolRef = useRef(symbol);

  useEffect(() => {
    if (chartToken.maxPrice && chartToken.minPrice && chartToken.symbol) {
      let priceDecimals: number;

      try {
        priceDecimals = getPriceDecimals(chainId, chartToken.symbol);
      } catch (e) {
        return;
      }

      const averagePrice = getMidPrice(chartToken);
      const formattedPrice = parseFloat(
        formatAmount(averagePrice, USD_DECIMALS, priceDecimals)
      );
      dataProvider?.setCurrentChartToken({
        price: formattedPrice,
        ticker: chartToken.symbol,
        isChartReady: chartReady,
      });
    }
  }, [chartToken, chartReady, dataProvider, chainId]);

  const drawLineOnChart = useCallback(
    (title: string, price: number) => {
      if (chartReady && tvWidgetRef.current?.activeChart?.().dataReady()) {
        const chart = tvWidgetRef.current.activeChart();
        const positionLine = chart.createPositionLine({ disableUndo: true });

        return positionLine
          .setText(title)
          .setPrice(price)
          .setQuantity("")
          .setLineStyle(1)
          .setLineLength(1)
          .setBodyFont(`normal 12pt "Relative", sans-serif`)
          .setBodyTextColor("#fff")
          .setLineColor("#3a3e5e")
          .setBodyBackgroundColor("#3a3e5e")
          .setBodyBorderColor("#3a3e5e");
      }
    },
    [chartReady]
  );

  useEffect(
    function updateLines() {
      const lines: (IPositionLineAdapter | undefined)[] = [];
      if (savedShouldShowPositionLines) {
        chartLines.forEach((order) => {
          lines.push(drawLineOnChart(order.title, order.price));
        });
      }
      return () => {
        lines.forEach((line) => line?.remove());
      };
    },
    [chartLines, savedShouldShowPositionLines, drawLineOnChart]
  );

  useEffect(() => {
    if (
      chartReady &&
      tvWidgetRef.current &&
      symbol !== tvWidgetRef.current?.activeChart?.().symbol()
    ) {
      if (isChartAvailabeForToken(chainId, symbol)) {
        tvWidgetRef.current.setSymbol(
          symbol,
          tvWidgetRef.current.activeChart().resolution(),
          () => null
        );
      }
    }
  }, [symbol, chartReady, period, chainId]);

  useEffect(() => {
    const widgetOptions = {
      debug: false,
      symbol: symbolRef.current, // Using ref to avoid unnecessary re-renders on symbol change and still have access to the latest symbol
      datafeed: datafeed,
      theme: defaultChartProps.theme,
      container: chartContainerRef.current,
      library_path: defaultChartProps.library_path,
      locale: defaultChartProps.locale,
      loading_screen: defaultChartProps.loading_screen,
      enabled_features: defaultChartProps.enabled_features,
      disabled_features: isMobile
        ? defaultChartProps.disabled_features.concat(disabledFeaturesOnMobile)
        : defaultChartProps.disabled_features,
      client_id: defaultChartProps.clientId,
      user_id: defaultChartProps.userId,
      fullscreen: defaultChartProps.fullscreen,
      autosize: defaultChartProps.autosize,
      custom_css_url: defaultChartProps.custom_css_url,
      overrides: defaultChartProps.overrides,
      interval: getObjectKeyFromValue(period, supportedResolutions),
      favorites: {
        ...defaultChartProps.favorites,
        intervals: Object.keys(supportedResolutions),
      },
      custom_formatters: defaultChartProps.custom_formatters,
      save_load_adapter: new SaveLoadAdapter(
        chainId,
        tvCharts,
        setTvCharts,
        onSelectToken,
        tradePageVersion,
        setTradePageVersion
      ),
    };

    tvWidgetRef.current = new window.TradingView.widget(widgetOptions);
    tvWidgetRef.current!.onChartReady(function () {
      setChartReady(true);
      tvWidgetRef.current!.applyOverrides({
        "paneProperties.background": "#16182e",
        "paneProperties.backgroundType": "solid",
      });
      tvWidgetRef.current
        ?.activeChart()
        .onIntervalChanged()
        .subscribe(null, (interval) => {
          if (supportedResolutions[interval]) {
            const period = supportedResolutions[interval];
            setPeriod(period);
          }
        });

      tvWidgetRef.current?.activeChart().dataReady(() => {
        setChartDataLoading(false);
      });
    });

    dataProvider?.resetCache();

    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
        setChartReady(false);
        setChartDataLoading(true);
      }
    };
    // We don't want to re-initialize the chart when the symbol changes. This will make the chart flicker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, dataProvider]);

  return (
    <div
      className={`h-96 mb-8 ${
        chartDataLoading ? "bg-gray-200" : "bg-[#16182e]"
      } flex justify-center items-center`}
    >
      {chartDataLoading && <Loader />}
      <div
        style={{
          visibility: !chartDataLoading ? "visible" : "hidden",
          width: !chartDataLoading ? "100%" : "0%",
        }}
        ref={chartContainerRef}
        className="TVChartContainer ExchangeChart-bottom-content h-96"
      />
    </div>
  );
}
