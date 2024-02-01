// import { Trans, t } from "@lingui/macro";
import cx from "classnames";
import Button from "./Button";
import Checkbox from "./Checkbox";
import StatsTooltipRow from "./StatsTooltipRow";
import TokenIcon from "./TokenIcon";
import Tooltip from "./Tooltip";
import { useSettings } from "../../../utils/gmx/context/SettingsContext/SettingsContextProvider";
import {
  MarketsInfoData,
  getMarketIndexName,
  getMarketPoolName,
} from "../../../utils/gmx/domain/synthetics/markets";
import {
  OrderInfo,
  OrderType,
  PositionOrderInfo,
  SwapOrderInfo,
  isDecreaseOrderType,
  isIncreaseOrderType,
  isSwapOrderType,
} from "../../../utils/gmx/domain/synthetics/orders";
import { PositionsInfoData } from "../../../utils/gmx/domain/synthetics/positions";
import { getTriggerNameByOrderType } from "../../../utils/gmx/domain/synthetics/positions";
import {
  adaptToV1TokenInfo,
  convertToTokenAmount,
  convertToUsd,
} from "../../../utils/gmx/domain/synthetics/tokens";
import { getMarkPrice } from "../../../utils/gmx/domain/synthetics/trade";
import {
  USD_DECIMALS,
  getExchangeRate,
  getExchangeRateDisplay,
} from "../../../utils/gmx/lib/legacy";
import {
  formatAmount,
  formatTokenAmount,
  formatUsd,
} from "../../../utils/gmx/lib/numbers";
import { getByKey } from "../../../utils/gmx/lib/objects";
import { useMemo } from "react";

type Props = {
  order: OrderInfo;
  onSelectOrder?: () => void;
  onEditOrder?: () => void;
  onCancelOrder?: () => void;
  isSelected?: boolean;
  isCanceling?: boolean;
  hideActions?: boolean;
  isLarge: boolean;
  marketsInfoData?: MarketsInfoData;
  positionsInfoData?: PositionsInfoData;
};

export function OrderItem(p: Props) {
  const { showDebugValues } = useSettings();

  const isCollateralSwap =
    p.order.initialCollateralToken.address !==
    p.order.targetCollateralToken.address;

  function getCollateralText() {
    const initialCollateralToken = p.order.initialCollateralToken;
    const targetCollateralToken = p.order.targetCollateralToken;

    const collateralUsd = convertToUsd(
      p.order.initialCollateralDeltaAmount,
      initialCollateralToken.decimals,
      initialCollateralToken.prices.minPrice
    );

    const targetCollateralAmount = convertToTokenAmount(
      collateralUsd,
      targetCollateralToken.decimals,
      targetCollateralToken.prices.minPrice
    );

    const tokenAmountText = formatTokenAmount(
      targetCollateralAmount,
      targetCollateralToken?.decimals,
      targetCollateralToken?.symbol
    );

    return `${tokenAmountText}`;
  }

  function getSwapRatioText() {
    if (!isSwapOrderType(p.order.orderType)) return {};

    const fromToken = p.order.initialCollateralToken;
    const toToken = p.order.targetCollateralToken;

    const fromTokenInfo = fromToken ? adaptToV1TokenInfo(fromToken) : undefined;
    const toTokenInfo = toToken ? adaptToV1TokenInfo(toToken) : undefined;

    const triggerRatio = (p.order as SwapOrderInfo).triggerRatio;

    const markExchangeRate =
      fromToken && toToken
        ? getExchangeRate(
            adaptToV1TokenInfo(fromToken),
            adaptToV1TokenInfo(toToken),
            false
          )
        : undefined;

    const swapRatioText = `${formatAmount(
      triggerRatio?.ratio,
      USD_DECIMALS,
      triggerRatio?.smallestToken.isStable ? 2 : 4
    )} ${triggerRatio?.smallestToken.symbol} / ${
      triggerRatio?.largestToken.symbol
    }`;

    const markSwapRatioText = getExchangeRateDisplay(
      markExchangeRate,
      fromTokenInfo,
      toTokenInfo
    );

    return { swapRatioText, markSwapRatioText };
  }

  function renderTitle() {
    if (isSwapOrderType(p.order.orderType)) {
      if (showDebugValues) {
        return (
          <Tooltip
            handle={renderTitleWithIcon(p.order)}
            position="left-bottom"
            renderContent={() => (
              <>
                <StatsTooltipRow
                  label={"Key"}
                  value={<div className="debug-key muted">{p.order.key}</div>}
                  showDollar={false}
                />
                <StatsTooltipRow
                  label={"Amount"}
                  value={
                    <div className="debug-key muted">
                      {p.order.minOutputAmount.toString()}
                    </div>
                  }
                  showDollar={false}
                />
              </>
            )}
          />
        );
      }

      if (p.order.errors.length) {
        return (
          <Tooltip
            handle={renderTitleWithIcon(p.order)}
            className={cx(
              `order-error-text-msg`,
              `level-${p.order.errorLevel}`
            )}
            position="left-bottom"
            renderContent={() => (
              <>
                {p.order.errors.map((error, i) => (
                  <div
                    className={cx({
                      "OrderItem-tooltip-row": i > 0,
                    })}
                    key={error.msg}
                  >
                    <span
                      className={
                        error!.level === "error" ? "negative" : "warning"
                      }
                    >
                      {error.msg}
                    </span>
                  </div>
                ))}
              </>
            )}
          />
        );
      }

      return renderTitleWithIcon(p.order);
    }

    const positionOrder = p.order as PositionOrderInfo;
    const indexName = getMarketIndexName(positionOrder.marketInfo);
    const poolName = getMarketPoolName(positionOrder.marketInfo);

    return (
      <Tooltip
        handle={renderTitleWithIcon(p.order)}
        position="left-bottom"
        className={
          p.order.errorLevel
            ? `order-error-text-msg level-${p.order.errorLevel}`
            : undefined
        }
        renderContent={() => {
          return (
            <>
              <StatsTooltipRow
                label={`Market`}
                value={
                  <div className="items-center">
                    <span>{indexName && indexName}</span>
                    <span className="subtext lh-1">
                      {poolName && `[${poolName}]`}
                    </span>
                  </div>
                }
                showDollar={false}
              />
              <StatsTooltipRow
                label={`Collateral`}
                value={getCollateralText()}
                showDollar={false}
              />

              {isCollateralSwap && (
                <div className="OrderItem-tooltip-row">
                  <div>
                    {formatTokenAmount(
                      p.order.initialCollateralDeltaAmount,
                      p.order.initialCollateralToken.decimals,
                      p.order.initialCollateralToken.symbol
                    )}{" "}
                    will be swapped to {p.order.targetCollateralToken.symbol} on
                    order execution.
                  </div>
                </div>
              )}

              {showDebugValues && (
                <div className="OrderItem-tooltip-row">
                  <StatsTooltipRow
                    label={"Key"}
                    value={
                      <div className="debug-key muted">{positionOrder.key}</div>
                    }
                    showDollar={false}
                  />
                </div>
              )}

              {p.order.errors.length ? (
                <>
                  {p.order.errors.map((error) => (
                    <div className="OrderItem-tooltip-row" key={error.msg}>
                      <span
                        className={
                          error!.level === "error" ? "negative" : "warning"
                        }
                      >
                        {error.msg}
                      </span>
                    </div>
                  ))}
                </>
              ) : null}
            </>
          );
        }}
      />
    );
  }

  function renderTitleWithIcon(order: OrderInfo) {
    if (isSwapOrderType(order.orderType)) {
      const {
        initialCollateralToken,
        targetCollateralToken,
        minOutputAmount,
        initialCollateralDeltaAmount,
      } = order;

      const fromTokenText = formatTokenAmount(
        initialCollateralDeltaAmount,
        initialCollateralToken.decimals,
        ""
      );

      const fromTokenWithIcon = (
        <span className="nobr">
          <TokenIcon
            className="mr-xs"
            symbol={initialCollateralToken.symbol}
            displaySize={18}
            importSize={24}
          />
          {initialCollateralToken.symbol}
        </span>
      );

      const toTokenText = formatTokenAmount(
        minOutputAmount,
        targetCollateralToken.decimals,
        ""
      );

      const toTokenWithIcon = (
        <span className="nobr">
          <TokenIcon
            className="mr-xs"
            symbol={targetCollateralToken.symbol}
            displaySize={18}
            importSize={24}
          />
          {targetCollateralToken.symbol}
        </span>
      );

      return (
        <span>
          Swap {fromTokenText} {fromTokenWithIcon} for {toTokenText}{" "}
          {toTokenWithIcon}
        </span>
      );
    } else {
      const marketInfo = getByKey(p.marketsInfoData, order.marketAddress);
      const indexToken = marketInfo?.indexToken;
      const { orderType, isLong, sizeDeltaUsd } = order;

      const symbolWithIcon = (
        <span>
          {indexToken && (
            <TokenIcon
              className="mr-xs"
              symbol={indexToken?.symbol}
              displaySize={18}
              importSize={24}
            />
          )}
          {indexToken?.symbol}
        </span>
      );

      const longShortText = isLong ? `Long` : `Short`;
      const sizeText = formatUsd(sizeDeltaUsd);
      const increaseOrDecreaseText = isIncreaseOrderType(orderType)
        ? `Increase`
        : `Decrease`;

      return (
        <span>
          {increaseOrDecreaseText} {symbolWithIcon} {longShortText} by{" "}
          {sizeText}
        </span>
      );
    }
  }

  function renderTriggerPrice() {
    if (isSwapOrderType(p.order.orderType)) {
      const toAmount = p.order.minOutputAmount;
      const toToken = p.order.targetCollateralToken;
      const toAmountText = formatTokenAmount(
        toAmount,
        toToken?.decimals,
        toToken?.symbol
      );

      const { swapRatioText } = getSwapRatioText();

      return (
        <>
          {!p.hideActions ? (
            <Tooltip
              position="right-bottom"
              handle={swapRatioText}
              renderContent={() =>
                `You will receive at least ${toAmountText} if this order is executed. This price is being updated in real time based on Swap Fees and Price Impact.`
              }
            />
          ) : (
            swapRatioText
          )}
        </>
      );
    } else {
      return (
        <Tooltip
          handle={`${positionOrder.triggerThresholdType} ${formatUsd(
            positionOrder.triggerPrice,
            {
              displayDecimals: priceDecimals,
            }
          )}`}
          position="right-bottom"
          renderContent={() => (
            <>
              <StatsTooltipRow
                label={`Acceptable Price`}
                value={
                  positionOrder.orderType === OrderType.StopLossDecrease
                    ? "NA"
                    : `${positionOrder.triggerThresholdType} ${formatUsd(
                        positionOrder.acceptablePrice,
                        {
                          displayDecimals: priceDecimals,
                        }
                      )}`
                }
                showDollar={false}
              />
            </>
          )}
        />
      );
    }
  }

  const positionOrder = p.order as PositionOrderInfo;
  const priceDecimals = positionOrder?.indexToken?.priceDecimals;

  const markPrice = useMemo(() => {
    if (isSwapOrderType(p.order.orderType)) {
      return undefined;
    }
    return getMarkPrice({
      prices: positionOrder.indexToken.prices,
      isIncrease: isIncreaseOrderType(positionOrder.orderType),
      isLong: positionOrder.isLong,
    });
  }, [
    p.order.orderType,
    positionOrder?.indexToken?.prices,
    positionOrder.isLong,
    positionOrder.orderType,
  ]);

  function renderMarkPrice() {
    if (isSwapOrderType(p.order.orderType)) {
      const { markSwapRatioText } = getSwapRatioText();

      return markSwapRatioText;
    } else {
      return (
        <Tooltip
          handle={formatUsd(markPrice, { displayDecimals: priceDecimals })}
          position="right-bottom"
          renderContent={() => {
            return (
              <div>
                <p>
                  The order will be executed when the oracle price is{" "}
                  {positionOrder.triggerThresholdType}{" "}
                  {formatUsd(positionOrder.triggerPrice, {
                    displayDecimals: priceDecimals,
                  })}
                  .
                </p>
                <p>
                  Note that there may be rare cases where the order cannot be
                  executed, for example, if the chain is down and no oracle
                  reports are produced or if the price impact exceeds your
                  acceptable price.
                </p>
              </div>
            );
          }}
        />
      );
    }
  }

  function renderLarge() {
    return (
      <tr className="Exchange-list-item">
        {!p.hideActions && p.onSelectOrder && (
          <td className="Exchange-list-item-type">
            <div>
              <Checkbox
                isChecked={p.isSelected}
                setIsChecked={p.onSelectOrder}
              />
            </div>
          </td>
        )}
        <td className="Exchange-list-item-type">
          {isDecreaseOrderType(p.order.orderType)
            ? getTriggerNameByOrderType(positionOrder.orderType)
            : `Limit`}
        </td>
        <td className="Order-list-item-text">{renderTitle()}</td>
        <td>{renderTriggerPrice()}</td>
        <td>{renderMarkPrice()}</td>
        {!p.hideActions && (
          <>
            {p.onEditOrder && (
              <td>
                <button
                  className="Exchange-list-action"
                  onClick={p.onEditOrder}
                >
                  Edit
                </button>
              </td>
            )}
            {p.onCancelOrder && (
              <td>
                <button
                  className="Exchange-list-action"
                  onClick={p.onCancelOrder}
                  disabled={p.isCanceling}
                >
                  Cancel
                </button>
              </td>
            )}
          </>
        )}
      </tr>
    );
  }

  function renderSmall() {
    return (
      <div className="App-card">
        <div>
          <div className="Order-list-card-title">{renderTitle()}</div>
          <div className="App-card-divider" />
          <div className="App-card-content">
            {showDebugValues && (
              <div className="App-card-row">
                <div className="label">Key</div>
                <div className="debug-key muted">{p.order.key}</div>
              </div>
            )}
            <div className="App-card-row">
              <div className="label">Order Type</div>
              <div>
                {isDecreaseOrderType(p.order.orderType)
                  ? getTriggerNameByOrderType(positionOrder.orderType)
                  : `Limit`}
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">Trigger Price</div>
              <div>{renderTriggerPrice()}</div>
            </div>

            <div className="App-card-row">
              <div className="label">Mark Price</div>
              <div>{renderMarkPrice()}</div>
            </div>
          </div>
        </div>
        {!p.hideActions && (
          <div className="App-card-actions">
            <div className="App-card-divider"></div>
            <div className="remove-top-margin">
              {p.onEditOrder && (
                <Button
                  variant="secondary"
                  className="mr-md mt-md"
                  onClick={p.onEditOrder}
                >
                  Edit
                </Button>
              )}

              {p.onCancelOrder && (
                <Button
                  variant="secondary"
                  className="mt-md"
                  onClick={p.onCancelOrder}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return p.isLarge ? renderLarge() : renderSmall();
}
