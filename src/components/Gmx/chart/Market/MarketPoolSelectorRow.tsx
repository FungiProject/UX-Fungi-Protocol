import ExchangeInfoRow from "../ExchangeInfoRow/ExchangeInfoRow";
import { PoolSelector } from "../../common/PoolSelector/PoolSelector";
import Tooltip from "../../common/Tooltip/Tooltip";
import {
  Market,
  MarketInfo,
  getMarketIndexName,
  getMarketPoolName,
} from "../../../../utils/gmx/domain/synthetics/markets";
import { AvailableMarketsOptions } from "../../../../utils/gmx/domain/synthetics/trade/useAvailableMarketsOptions";
import { Token } from "../../../../utils/gmx/domain/tokens";
import { BigNumber } from "ethers";
import { formatPercentage } from "../../../../utils/gmx/lib/numbers";
import { useCallback, useMemo } from "react";

export type Props = {
  indexToken?: Token;
  selectedMarket?: MarketInfo;
  marketsOptions?: AvailableMarketsOptions;
  hasExistingPosition?: boolean;
  hasExistingOrder?: boolean;
  isOutPositionLiquidity?: boolean;
  currentPriceImpactBps?: BigNumber;
  onSelectMarketAddress: (marketAddress?: string) => void;
};

export function MarketPoolSelectorRow(p: Props) {
  const {
    selectedMarket,
    indexToken,
    marketsOptions,
    hasExistingOrder,
    hasExistingPosition,
    isOutPositionLiquidity,
    currentPriceImpactBps,
    onSelectMarketAddress,
  } = p;

  const {
    isNoSufficientLiquidityInAnyMarket,
    marketWithOrder,
    marketWithPosition,
    maxLiquidityMarket,
    availableMarkets,
    minPriceImpactMarket,
    minPriceImpactBps,
  } = marketsOptions || {};

  const indexName = indexToken
    ? getMarketIndexName({ indexToken, isSpotOnly: false })
    : undefined;

  const isSelectedMarket = useCallback(
    (market: Market) => {
      return (
        selectedMarket &&
        market.marketTokenAddress === selectedMarket.marketTokenAddress
      );
    },
    [selectedMarket]
  );

  const message = useMemo(() => {
    if (isNoSufficientLiquidityInAnyMarket) {
      return (
        <div className="MarketSelector-tooltip-row">
          Insufficient liquidity in any {indexToken?.symbol}/USD market pools
          for your order.
          <br />
          <br />
          V2 is newly live, and liquidity may be low initially.
        </div>
      );
    }

    if (
      isOutPositionLiquidity &&
      maxLiquidityMarket &&
      !isSelectedMarket(maxLiquidityMarket)
    ) {
      return (
        <div className="MarketSelector-tooltip-row">
          <div>
            Insufficient liquidity in{" "}
            {selectedMarket ? getMarketPoolName(selectedMarket) : "..."} market
            pool. <br />
            <div
              className="MarketSelector-tooltip-row-action clickable underline muted "
              onClick={() =>
                onSelectMarketAddress(maxLiquidityMarket!.marketTokenAddress)
              }
            >
              Switch to {getMarketPoolName(maxLiquidityMarket)} market pool.
            </div>
          </div>
        </div>
      );
    }

    if (
      !hasExistingPosition &&
      marketWithPosition &&
      !isSelectedMarket(marketWithPosition)
    ) {
      return (
        <div className="MarketSelector-tooltip-row">
          <div>
            You have an existing position in the{" "}
            {getMarketPoolName(marketWithPosition)} market pool.{" "}
            <div
              className="MarketSelector-tooltip-row-action clickable underline muted"
              onClick={() => {
                onSelectMarketAddress(marketWithPosition.marketTokenAddress);
              }}
            >
              Switch to {getMarketPoolName(marketWithPosition)} market pool.
            </div>{" "}
          </div>
        </div>
      );
    }

    if (
      !marketWithPosition &&
      !hasExistingOrder &&
      marketWithOrder &&
      !isSelectedMarket(marketWithOrder)
    ) {
      return (
        <div className="MarketSelector-tooltip-row">
          <div>
            You have an existing order in the{" "}
            {getMarketPoolName(marketWithOrder)} market pool.{" "}
            <div
              className="MarketSelector-tooltip-row-action clickable underline muted"
              onClick={() => {
                onSelectMarketAddress(marketWithOrder.marketTokenAddress);
              }}
            >
              Switch to {getMarketPoolName(marketWithOrder)} market pool.
            </div>{" "}
          </div>
        </div>
      );
    }

    if (
      !marketWithPosition &&
      !marketWithOrder &&
      minPriceImpactMarket &&
      minPriceImpactBps &&
      !isSelectedMarket(minPriceImpactMarket)
    ) {
      return (
        <div className="MarketSelector-tooltip-row">
          <div>
            You can get a{" "}
            {formatPercentage(currentPriceImpactBps?.sub(minPriceImpactBps))}{" "}
            better execution price in the{" "}
            {getMarketPoolName(minPriceImpactMarket)} market pool.
            <div
              className="MarketSelector-tooltip-row-action clickable underline muted"
              onClick={() =>
                onSelectMarketAddress(minPriceImpactMarket.marketTokenAddress)
              }
            >
              Switch to {getMarketPoolName(minPriceImpactMarket)} market pool.
            </div>
          </div>
        </div>
      );
    }

    return null;
  }, [
    currentPriceImpactBps,
    hasExistingOrder,
    hasExistingPosition,
    indexToken?.symbol,
    isNoSufficientLiquidityInAnyMarket,
    isOutPositionLiquidity,
    isSelectedMarket,
    marketWithOrder,
    marketWithPosition,
    maxLiquidityMarket,
    minPriceImpactBps,
    minPriceImpactMarket,
    onSelectMarketAddress,
    selectedMarket,
  ]);

  return (
    <ExchangeInfoRow
      className="py-[21px]"
      label={
        message ? (
          <Tooltip
            handle={`Pool`}
            position="left-bottom"
            className="MarketSelector-tooltip"
            renderContent={() => (
              <div className="MarketSelector-tooltip-content">{message}</div>
            )}
          />
        ) : (
          `Pool`
        )
      }
      value={
        <>
          <PoolSelector
            label={`Pool`}
            className="SwapBox-info-dropdown"
            selectedIndexName={indexName}
            selectedMarketAddress={selectedMarket?.marketTokenAddress}
            markets={availableMarkets || []}
            isSideMenu
            onSelectMarket={(marketInfo) =>
              onSelectMarketAddress(marketInfo.marketTokenAddress)
            }
          />
        </>
      }
    />
  );
}
