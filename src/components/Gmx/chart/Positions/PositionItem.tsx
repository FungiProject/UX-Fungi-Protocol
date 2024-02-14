import cx from "classnames";
import PositionDropdown from "./PositionDropdown";
import StatsTooltipRow from "../../common/Tooltip/StatsTooltipRow";
import Tooltip from "../../common/Tooltip/Tooltip";
import {
  PositionOrderInfo,
  isDecreaseOrderType,
  isIncreaseOrderType,
} from "../../../../utils/gmx/domain/synthetics/orders";
import {
  PositionInfo,
  formatEstimatedLiquidationTime,
  formatLeverage,
  formatLiquidationPrice,
  getEstimatedLiquidationTimeInHours,
  getTriggerNameByOrderType,
  usePositionsConstants,
} from "../../../../utils/gmx/domain/synthetics/positions";
import {
  formatDeltaUsd,
  formatTokenAmount,
  formatUsd,
} from "../../../../utils/gmx/lib/numbers";
import { AiOutlineEdit } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";

import Button from "../../common/Buttons/Button";
import TokenIcon from "../../common/TokenIcon/TokenIcon";
import { useSettings } from "../../../../utils/gmx/context/SettingsContext/SettingsContextProvider";
import {
  getBorrowingFeeRateUsd,
  getFundingFeeRateUsd,
} from "../../../../utils/gmx/domain/synthetics/fees";
import {
  getMarketIndexName,
  getMarketPoolName,
} from "../../../../utils/gmx/domain/synthetics/markets";
import {
  TradeMode,
  TradeType,
  getTriggerThresholdType,
} from "../../../../utils/gmx/domain/synthetics/trade";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import { CHART_PERIODS } from "../../../../utils/gmx/lib/legacy";
import { FaAngleRight } from "react-icons/fa";
import { useMedia } from "react-use";
import { Fragment } from "react";
import { getPositiveOrNegativeClass } from "../../../../utils/gmx/lib/utils";

export type Props = {
  position: PositionInfo;
  positionOrders: PositionOrderInfo[];
  hideActions?: boolean;
  showPnlAfterFees: boolean;
  savedShowPnlAfterFees: boolean;
  onClosePositionClick?: () => void;
  onEditCollateralClick?: () => void;
  onShareClick: () => void;
  onSelectPositionClick?: (tradeMode?: TradeMode) => void;
  onOrdersClick?: () => void;
  isLarge: boolean;
  currentMarketAddress?: string;
  currentCollateralAddress?: string;
  currentTradeType?: TradeType;
  openSettings: () => void;
  onGetPendingFeesClick: () => void;
};

export function PositionItem(p: Props) {
  const { showDebugValues } = useSettings();
  const { positionOrders } = p;
  const displayedPnl = p.savedShowPnlAfterFees
    ? p.position.pnlAfterFees
    : p.position.pnl;
  const displayedPnlPercentage = p.savedShowPnlAfterFees
    ? p.position.pnlAfterFeesPercentage
    : p.position.pnlPercentage;
  const { chainId } = useChainId();
  const isMobile = useMedia("(max-width: 1100px)");
  const indexPriceDecimals = p.position?.indexToken?.priceDecimals;
  const { minCollateralUsd } = usePositionsConstants(chainId);

  const isCurrentTradeTypeLong = p.currentTradeType === TradeType.Long;
  const isCurrentMarket =
    p.currentMarketAddress === p.position.marketAddress &&
    p.currentCollateralAddress === p.position.collateralTokenAddress &&
    isCurrentTradeTypeLong === p.position.isLong;

  function renderNetValue() {
    return (
      <Tooltip
        handle={formatUsd(p.position.netValue)}
        position={p.isLarge ? "left-bottom" : "right-bottom"}
        handleClassName="plain"
        renderContent={() => (
          <div>
            {p.position.uiFeeUsd.gt(0)
              ? `Net Value: Initial Collateral + PnL - Borrow Fee - Negative Funding Fee - Close Fee - UI Fee`
              : `Net Value: Initial Collateral + PnL - Borrow Fee - Negative Funding Fee - Close Fee`}
            <br />
            <br />
            <StatsTooltipRow
              label={`Initial Collateral`}
              value={formatUsd(p.position.collateralUsd) || "..."}
              showDollar={false}
            />
            <StatsTooltipRow
              label={`PnL`}
              value={formatDeltaUsd(p.position?.pnl) || "..."}
              showDollar={false}
              className={getPositiveOrNegativeClass(p.position.pnl)}
            />
            <StatsTooltipRow
              label={`Accrued Borrow Fee`}
              value={
                formatUsd(p.position.pendingBorrowingFeesUsd?.mul(-1)) || "..."
              }
              showDollar={false}
              className={cx({
                "text-red": !p.position.pendingBorrowingFeesUsd.isZero(),
              })}
            />
            <StatsTooltipRow
              label={`Accrued Negative Funding Fee`}
              value={
                formatUsd(p.position.pendingFundingFeesUsd.mul(-1)) || "..."
              }
              showDollar={false}
              className={cx({
                "text-red": !p.position.pendingFundingFeesUsd.isZero(),
              })}
            />
            <StatsTooltipRow
              label={`Close Fee`}
              showDollar={false}
              value={formatUsd(p.position.closingFeeUsd?.mul(-1)) || "..."}
              className="text-red"
            />
            {p.position.uiFeeUsd.gt(0) && (
              <StatsTooltipRow
                label={`UI Fee`}
                showDollar={false}
                value={formatUsd(p.position.uiFeeUsd.mul(-1))}
                className="text-red"
              />
            )}
            <br />
            <StatsTooltipRow
              label={`PnL After Fees`}
              value={formatDeltaUsd(
                p.position.pnlAfterFees,
                p.position.pnlAfterFeesPercentage
              )}
              showDollar={false}
              className={getPositiveOrNegativeClass(p.position.pnlAfterFees)}
            />
          </div>
        )}
      />
    );
  }

  function renderCollateral() {
    return (
      <>
        <div className="flex items-center justify-center ml-4">
          <Tooltip
            handle={`${formatUsd(p.position.remainingCollateralUsd)}`}
            position={p.isLarge ? "left-bottom" : "right-bottom"}
            className="PositionItem-collateral-tooltip"
            handleClassName={cx("plain", {
              negative: p.position.hasLowCollateral,
            })}
            renderContent={() => {
              const fundingFeeRateUsd = getFundingFeeRateUsd(
                p.position.marketInfo,
                p.position.isLong,
                p.position.sizeInUsd,
                CHART_PERIODS["1d"]
              );
              const borrowingFeeRateUsd = getBorrowingFeeRateUsd(
                p.position.marketInfo,
                p.position.isLong,
                p.position.sizeInUsd,
                CHART_PERIODS["1d"]
              );
              return (
                <>
                  {p.position.hasLowCollateral && (
                    <div>
                      WARNING: This position has a low amount of collateral
                      after deducting fees, deposit more collateral to reduce
                      the position's liquidation risk.
                      <br />
                      <br />
                    </div>
                  )}
                  <StatsTooltipRow
                    label={`Initial Collateral`}
                    value={
                      <>
                        <div>
                          {formatTokenAmount(
                            p.position.collateralAmount,
                            p.position.collateralToken.decimals,
                            p.position.collateralToken.symbol,
                            {
                              useCommas: true,
                            }
                          )}{" "}
                          ({formatUsd(p.position.collateralUsd)})
                        </div>
                      </>
                    }
                    showDollar={false}
                  />
                  <br />
                  <StatsTooltipRow
                    label={`Accrued Borrow Fee`}
                    showDollar={false}
                    value={
                      formatUsd(p.position.pendingBorrowingFeesUsd.mul(-1)) ||
                      "..."
                    }
                    className={cx({
                      "text-red": !p.position.pendingBorrowingFeesUsd.isZero(),
                    })}
                  />
                  <StatsTooltipRow
                    label={`Accrued Negative Funding Fee`}
                    showDollar={false}
                    value={
                      formatDeltaUsd(
                        p.position.pendingFundingFeesUsd.mul(-1)
                      ) || "..."
                    }
                    className={cx({
                      "text-red": !p.position.pendingFundingFeesUsd.isZero(),
                    })}
                  />
                  <StatsTooltipRow
                    label={`Accrued Positive Funding Fee`}
                    showDollar={false}
                    value={
                      formatDeltaUsd(
                        p.position.pendingClaimableFundingFeesUsd
                      ) || "..."
                    }
                    className={cx({
                      "text-green":
                        p.position.pendingClaimableFundingFeesUsd.gt(0),
                    })}
                  />
                  <br />
                  <StatsTooltipRow
                    showDollar={false}
                    label={`Current Borrow Fee / Day`}
                    value={formatUsd(borrowingFeeRateUsd.mul(-1))}
                    className={cx({
                      "text-red": borrowingFeeRateUsd.gt(0),
                    })}
                  />
                  <StatsTooltipRow
                    showDollar={false}
                    label={`Current Funding Fee / Day`}
                    value={formatDeltaUsd(fundingFeeRateUsd)}
                    className={getPositiveOrNegativeClass(fundingFeeRateUsd)}
                  />
                  <br />
                  <span>
                    Use the Edit Collateral icon to deposit or withdraw
                    collateral.
                  </span>
                  <br />
                  <br />
                  <span>
                    Negative Funding Fees are settled against the collateral
                    automatically and will influence the liquidation price.
                    Positive Funding Fees can be claimed under Claimable Funding
                    after realizing any action on the position.
                  </span>
                </>
              );
            }}
          />

          {/* {!p.position.isOpening &&
            !p.hideActions &&
            p.onEditCollateralClick && (
              <span className="edit-icon" onClick={p.onEditCollateralClick}>
                <AiOutlineEdit fontSize={16} />
              </span>
            )} */}
        </div>

        <div className="ml-3">
          {`(${formatTokenAmount(
            p.position.remainingCollateralAmount,
            p.position.collateralToken?.decimals,
            p.position.collateralToken?.symbol,
            {
              useCommas: true,
            }
          )})`}
        </div>
      </>
    );
  }

  function renderLiquidationPrice() {
    let liqPriceWarning: string | undefined;
    const estimatedLiquidationHours = getEstimatedLiquidationTimeInHours(
      p.position,
      minCollateralUsd
    );

    if (!p.position.liquidationPrice) {
      if (
        !p.position.isLong &&
        p.position.collateralAmount.gte(p.position.sizeInTokens)
      ) {
        liqPriceWarning = `Since your position's Collateral is ${p.position.collateralToken.symbol} with a value larger than the Position Size, the Collateral value will increase to cover any negative PnL.`;
      } else if (
        p.position.isLong &&
        p.position.collateralToken.isStable &&
        p.position.collateralUsd.gte(p.position.sizeInUsd)
      ) {
        liqPriceWarning = `Since your position's Collateral is ${p.position.collateralToken.symbol} with a value larger than the Position Size, the Collateral value will cover any negative PnL.`;
      }
    }

    const getLiqPriceTooltipContent = () => (
      <>
        {liqPriceWarning && <div>{liqPriceWarning}</div>}
        {estimatedLiquidationHours ? (
          <div>
            <div>
              {!liqPriceWarning &&
                "Liquidation Price is influenced by Fees, Collateral value, and Price Impact."}
            </div>
            <br />
            <StatsTooltipRow
              label={"Estimated time to Liquidation"}
              value={formatEstimatedLiquidationTime(estimatedLiquidationHours)}
              showDollar={false}
            />
            <br />
            <div>
              Estimation based on current Borrow and Funding Fees rates reducing
              position's Collateral over time, excluding any price movement.
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    );

    if (liqPriceWarning || estimatedLiquidationHours) {
      return (
        <Tooltip
          handle={
            formatLiquidationPrice(p.position.liquidationPrice, {
              displayDecimals: indexPriceDecimals,
            }) || "..."
          }
          position={"right-bottom"}
          handleClassName={cx("plain", {
            "LiqPrice-soft-warning":
              estimatedLiquidationHours && estimatedLiquidationHours < 24 * 7,
            "LiqPrice-hard-warning":
              estimatedLiquidationHours && estimatedLiquidationHours < 24,
          })}
          renderContent={getLiqPriceTooltipContent}
        />
      );
    }

    return (
      formatLiquidationPrice(p.position.liquidationPrice, {
        displayDecimals: indexPriceDecimals,
      }) || "..."
    );
  }

  function renderOrderText(order: PositionOrderInfo) {
    const triggerThresholdType = getTriggerThresholdType(
      order.orderType,
      order.isLong
    );
    const isIncrease = isIncreaseOrderType(order.orderType);
    return (
      <div key={order.key}>
        {isDecreaseOrderType(order.orderType)
          ? getTriggerNameByOrderType(order.orderType, true)
          : `Limit`}
        : {triggerThresholdType}{" "}
        {formatUsd(order.triggerPrice, {
          displayDecimals: order.indexToken?.priceDecimals,
        })}
        :{" "}
        <span>
          {isIncrease ? "+" : "-"}
          {formatUsd(order.sizeDeltaUsd)}
        </span>
      </div>
    );
  }

  function renderPositionOrders(isSmall = false) {
    if (positionOrders.length === 0) return null;

    if (isSmall) {
      return positionOrders.map((order) => {
        if (order.errorLevel) {
          return (
            <div key={order.key} className="Position-list-order">
              <Tooltip
                handle={renderOrderText(order)}
                position="right-bottom"
                handleClassName={cx("position-order-error", {
                  "level-warning": order.errorLevel === "warning",
                  "level-error": order.errorLevel === "error",
                })}
                renderContent={() =>
                  order.errors.map((error) => (
                    <span
                      key={error.msg}
                      className={cx("mb-xs", "position-order-error", {
                        "level-warning": order.errorLevel === "warning",
                        "level-error": order.errorLevel === "error",
                      })}
                    >
                      {error.msg}
                    </span>
                  ))
                }
              />
            </div>
          );
        }
        return (
          <div className="Position-list-order">{renderOrderText(order)}</div>
        );
      });
    }

    const ordersErrorList = positionOrders.filter(
      (order) => order.errorLevel === "error"
    );
    const ordersWarningsList = positionOrders.filter(
      (order) => order.errorLevel === "warning"
    );
    const hasErrors = ordersErrorList.length + ordersWarningsList.length > 0;

    return (
      <div onClick={p.onOrdersClick}>
        <Tooltip
          className="Position-list-active-orders"
          handle={
            <div>
              Orders{" "}
              <span
                className={cx({
                  "position-order-error": hasErrors,
                  "level-error": ordersErrorList.length > 0,
                  "level-warning":
                    !ordersErrorList.length && ordersWarningsList.length > 0,
                })}
              >
                ({positionOrders.length})
              </span>
            </div>
          }
          position="left-bottom"
          handleClassName={cx([
            "Exchange-list-info-label",
            "Exchange-position-list-orders",
            "plain",
            "clickable",
            "text-gray",
          ])}
          renderContent={() => (
            <>
              <strong>Active Orders</strong>
              {positionOrders.map((order) => {
                const errors = order.errors;
                return (
                  <div
                    key={order.key}
                    className="Position-list-order active-order-tooltip"
                  >
                    <div className="Position-list-order-label">
                      {renderOrderText(order)}
                      <FaAngleRight fontSize={14} />
                    </div>

                    {errors.map((err, i) => (
                      <Fragment key={err.msg}>
                        <div
                          className={cx(
                            "order-error-text",
                            `level-${err.level}`
                          )}
                        >
                          {err.msg}
                        </div>
                        {i < errors.length - 1 && <br />}
                      </Fragment>
                    ))}
                  </div>
                );
              })}
            </>
          )}
        />
      </div>
    );
  }

  function renderLarge() {
    const indexName = getMarketIndexName(p.position.marketInfo);
    const poolName = getMarketPoolName(p.position.marketInfo);
    return (
      <div
        className={`py-2 flex items-center grid grid-cols-10 text-center ${
          isCurrentMarket
            ? "border-l-4 border-main bg-gray-100"
            : "border-l-4 border-white"
        }`}
      >
        <div
          className="flex flex-col items-center justify-center col-span-2 ml-6"
          onClick={() => {
            p.onSelectPositionClick?.();
          }}
        >
          {/* title */}
          <div className="Exchange-list-title flex items-center">
            <TokenIcon
              className="mr-4"
              symbol={p.position.marketInfo.indexToken.symbol}
              displaySize={20}
              importSize={24}
            />
            {p.position.marketInfo.indexToken.symbol}
            {p.position.pendingUpdate && (
              <ImSpinner2 className="spin position-loading-icon" />
            )}
          </div>
          <div className="Exchange-list-info-label">
            <span className="text-sm">
              {formatLeverage(p.position.leverage) || "..."}&nbsp;
            </span>
            <span
              className={`${
                !p.position.isLong ? "text-red-400" : "text-green-400"
              }`}
            >
              {p.position.isLong ? `Long` : `Short`}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {/* netValue */}
          {p.position.isOpening ? (
            `Opening...`
          ) : (
            <div>
              {renderNetValue()}
              {displayedPnl && (
                <div
                  onClick={p.openSettings}
                  className={`flex ml-3 font-medium text-xs ${
                    Number(displayedPnl) <= 0
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {formatDeltaUsd(displayedPnl, displayedPnlPercentage)}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="ml-8">
          {formatUsd(p.position.sizeInUsd)}
          {renderPositionOrders()}
        </div>
        <div>
          {/* collateral */}
          <div>{renderCollateral()}</div>
        </div>
        <div>
          {/* entryPrice */}
          {p.position.isOpening
            ? `Opening...`
            : formatUsd(p.position.entryPrice, {
                displayDecimals: indexPriceDecimals,
              })}
        </div>
        <div>
          {/* markPrice */}
          {formatUsd(p.position.markPrice, {
            displayDecimals: indexPriceDecimals,
          })}
        </div>
        <div>
          {/* liqPrice */}
          {renderLiquidationPrice()}
        </div>
        <div>
          {/* Close */}
          {!p.position.isOpening && !p.hideActions && (
            <button
              className="Exchange-list-action"
              onClick={p.onClosePositionClick}
              disabled={p.position.sizeInUsd.eq(0)}
            >
              Close
            </button>
          )}
        </div>
        <div>
          {!p.position.isOpening && !p.hideActions && (
            <PositionDropdown
              handleEditCollateral={p.onEditCollateralClick}
              handleMarketSelect={() => p.onSelectPositionClick?.()}
              handleMarketIncreaseSize={() =>
                p.onSelectPositionClick?.(TradeMode.Market)
              }
              handleShare={p.onShareClick}
              handleLimitIncreaseSize={() =>
                p.onSelectPositionClick?.(TradeMode.Limit)
              }
              handleTriggerClose={() =>
                p.onSelectPositionClick?.(TradeMode.Trigger)
              }
            />
          )}
        </div>
      </div>
    );
  }

  function renderSmall() {
    const indexName = getMarketIndexName(p.position.marketInfo);
    const poolName = getMarketPoolName(p.position.marketInfo);
    return (
      <div className="App-card">
        <div>
          <div
            className={cx("App-card-title Position-card-title", {
              "Position-active-card": isCurrentMarket,
            })}
            onClick={() => p.onSelectPositionClick?.()}
          >
            <span className="Exchange-list-title inline-flex">
              <TokenIcon
                className="PositionList-token-icon"
                symbol={p.position.marketInfo.indexToken?.symbol}
                displaySize={20}
                importSize={24}
              />
              {p.position.marketInfo.indexToken?.symbol}
            </span>
            <div>
              <span className="Position-leverage">
                {formatLeverage(p.position.leverage)}&nbsp;
              </span>
              <span
                className={cx("Exchange-list-side", {
                  positive: p.position.isLong,
                  negative: !p.position.isLong,
                })}
              >
                {p.position.isLong ? `Long` : `Short`}
              </span>
            </div>
            {p.position.pendingUpdate && (
              <ImSpinner2 className="spin position-loading-icon" />
            )}
          </div>

          <div className="App-card-divider" />
          <div className="App-card-content">
            {showDebugValues && (
              <div className="App-card-row">
                <div className="label">Key</div>
                <div className="debug-key muted">{p.position.contractKey}</div>
              </div>
            )}
            <div className="App-card-row">
              <div className="label">Market</div>
              <div onClick={() => p.onSelectPositionClick?.()}>
                <div className="items-top">
                  <span>{indexName && indexName}</span>
                  <span className="subtext">{poolName && `[${poolName}]`}</span>
                </div>
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">Net Value</div>
              <div>{renderNetValue()}</div>
            </div>
            <div className="App-card-row">
              <div className="label">PnL</div>
              <div>
                <span
                  className={cx(
                    "Exchange-list-info-label cursor-pointer Position-pnl",
                    {
                      positive: displayedPnl?.gt(0),
                      negative: displayedPnl?.lt(0),
                      muted: displayedPnl?.eq(0),
                    }
                  )}
                  onClick={p.openSettings}
                >
                  {formatDeltaUsd(displayedPnl, displayedPnlPercentage)}
                </span>
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">Size</div>
              <div>{formatUsd(p.position.sizeInUsd)}</div>
            </div>
            <div className="App-card-row">
              <div className="label">Collateral</div>
              <div>{renderCollateral()}</div>
            </div>
          </div>
          <div className="App-card-divider" />
          <div className="App-card-content">
            <div className="App-card-row">
              <div className="label">Entry Price</div>
              <div>
                {formatUsd(p.position.entryPrice, {
                  displayDecimals: indexPriceDecimals,
                })}
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">Mark Price</div>
              <div>
                {formatUsd(p.position.markPrice, {
                  displayDecimals: indexPriceDecimals,
                })}
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">Liq. Price</div>
              <div>{renderLiquidationPrice()}</div>
            </div>
          </div>
          <div className="App-card-divider" />
          <div className="App-card-row">
            <div className="label">Orders</div>
            <div>
              {!p.positionOrders?.length && "None"}
              {renderPositionOrders(true)}
            </div>
          </div>
          {!p.hideActions && (
            <>
              <div className="App-card-divider" />
              <div className="Position-item-action">
                <div className="Position-item-buttons">
                  <Button
                    variant="secondary"
                    disabled={p.position.sizeInUsd.eq(0)}
                    onClick={p.onClosePositionClick}
                  >
                    Close
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={p.position.sizeInUsd.eq(0)}
                    onClick={p.onEditCollateralClick}
                  >
                    Edit Collateral
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={p.position.sizeInUsd.eq(0)}
                    onClick={() => {
                      // TODO: remove after adding trigger functionality to Modal
                      window.scrollTo({ top: isMobile ? 500 : 0 });
                      p.onSelectPositionClick?.(TradeMode.Trigger);
                    }}
                  >
                    TP/SL
                  </Button>
                </div>
                <div>
                  {!p.position.isOpening && !p.hideActions && (
                    <PositionDropdown
                      handleMarketSelect={() => p.onSelectPositionClick?.()}
                      handleMarketIncreaseSize={() =>
                        p.onSelectPositionClick?.(TradeMode.Market)
                      }
                      handleShare={p.onShareClick}
                      handleLimitIncreaseSize={() =>
                        p.onSelectPositionClick?.(TradeMode.Limit)
                      }
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return p.isLarge ? renderLarge() : renderSmall();
}
