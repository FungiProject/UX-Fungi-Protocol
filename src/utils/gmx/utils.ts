import CustomErrors from "../../../abis/CustomErrors.json";
// import { t } from "@lingui/macro";
import words from "lodash/words";
import { StatsTooltipRowProps } from "../../components/Gmx/common/Tooltip/StatsTooltipRow";
import {
  OrderType,
  isIncreaseOrderType,
  isLimitOrderType,
} from "./domain/synthetics/orders";
import {
  formatAcceptablePrice,
  getTriggerNameByOrderType,
} from "./domain/synthetics/positions";
import {
  adaptToV1TokenInfo,
  convertToUsd,
  getTokensRatioByAmounts,
} from "./domain/synthetics/tokens";
import {
  getShouldUseMaxPrice,
  getTriggerThresholdType,
} from "./domain/synthetics/trade";
import {
  PositionTradeAction,
  SwapTradeAction,
  TradeAction,
  TradeActionType,
} from "./domain/synthetics/tradeHistory";
import { BigNumber, ethers } from "ethers";
import { PRECISION, getExchangeRateDisplay } from "./lib/legacy";
import {
  formatDeltaUsd,
  formatTokenAmount,
  formatTokenAmountWithUsd,
  formatUsd,
} from "./lib/numbers";
import { museNeverExist } from "./lib/types";
import { trimStart } from "lodash";

type TooltipProps = StatsTooltipRowProps & { key: string };

type FormatPositionMessageChunk = {
  text: string;
  isError?: boolean;
  tooltipRows?: TooltipProps[];
  tooltipTitle?: string;
  tooltipTitleRed?: boolean;
  tooltipFooterRed?: boolean;
  tooltipFooter?: string;
};
type FormattedMessageResult = FormatPositionMessageChunk[] | null;

export function getOrderActionText(tradeAction: TradeAction) {
  let actionText = "";

  if (tradeAction.eventName === TradeActionType.OrderCreated) {
    actionText = `Create`;
  }

  if (tradeAction.eventName === TradeActionType.OrderCancelled) {
    actionText = `Cancel`;
  }

  if (tradeAction.eventName === TradeActionType.OrderExecuted) {
    actionText = `Execute`;
  }

  if (tradeAction.eventName === TradeActionType.OrderUpdated) {
    actionText = `Update`;
  }

  if (tradeAction.eventName === TradeActionType.OrderFrozen) {
    actionText = `Freeze`;
  }

  return actionText;
}

export const formatPositionMessage = (
  tradeAction: PositionTradeAction,
  minCollateralUsd: BigNumber
): FormattedMessageResult => {
  const indexToken = tradeAction.indexToken;
  const priceDecimals = tradeAction.indexToken.priceDecimals;
  const collateralToken = tradeAction.initialCollateralToken;
  const sizeDeltaUsd = tradeAction.sizeDeltaUsd;
  const collateralDeltaAmount = tradeAction.initialCollateralDeltaAmount;

  const isIncrease = isIncreaseOrderType(tradeAction.orderType);
  const increaseText = isIncrease ? `Increase` : `Decrease`;
  const longText = tradeAction.isLong ? `Long` : `Short`;
  const positionText = `${longText} ${indexToken.symbol}`;
  const sizeDeltaText = `${isIncrease ? "+" : "-"}${formatUsd(sizeDeltaUsd)}`;

  switch (tradeAction.orderType) {
    case OrderType.LimitIncrease:
    case OrderType.LimitSwap:
    case OrderType.LimitDecrease:
    case OrderType.StopLossDecrease: {
      const triggerPrice = tradeAction.triggerPrice;
      const executionPrice = tradeAction.executionPrice;
      const pricePrefix = getTriggerThresholdType(
        tradeAction.orderType!,
        tradeAction.isLong!
      );
      const actionText = getOrderActionText(tradeAction);
      const tokenPrice = getTokenPriceByTradeAction(tradeAction);
      const orderTypeName = isLimitOrderType(tradeAction.orderType)
        ? "Limit"
        : getTriggerNameByOrderType(tradeAction.orderType);

      if (tradeAction.eventName === TradeActionType.OrderExecuted) {
        const executeOrderStr = `Execute ${orderTypeName} Order: ${positionText} ${sizeDeltaText},`;
        return [
          {
            text: `${executeOrderStr} `,
          },
          {
            text: [
              tokenPrice
                ? `Triggered at: ${formatUsd(tokenPrice, {
                    displayDecimals: priceDecimals,
                  })}`
                : undefined,
              `Execution Price: ${formatUsd(executionPrice, {
                displayDecimals: priceDecimals,
              })}`,
            ]
              .filter(Boolean)
              .join(", "),
            tooltipRows: getExecutionPriceTooltipRows(tradeAction),
          },
        ];
      }

      const isFrozen = tradeAction.eventName === TradeActionType.OrderFrozen;
      const prefix = isFrozen
        ? "Execution Failed"
        : `${actionText} ${orderTypeName} Order`;

      const triggerPriceStr = `Trigger Price: ${pricePrefix} ${formatUsd(
        triggerPrice,
        {
          displayDecimals: priceDecimals,
        }
      )}`;
      const acceptablePriceStr = `Acceptable Price: ${formatAcceptablePrice(
        tradeAction.acceptablePrice,
        {
          displayDecimals: priceDecimals,
        }
      )}`;

      const isTakeProfit = tradeAction.orderType === OrderType.LimitDecrease;
      const shouldRenderAcceptablePrice = isTakeProfit || isIncrease;

      if (isFrozen) {
        const arr = [triggerPriceStr];

        if (shouldRenderAcceptablePrice) {
          arr.push(acceptablePriceStr);
        }

        return [
          {
            text: `${orderTypeName} Order Execution Failed`,
            isError: true,
            ...getExecutionFailedTooltipProps(tradeAction),
          },
          { text: `: ${positionText} ${sizeDeltaText}` },
          { text: `, ${arr.join(", ")}` },
        ];
      } else {
        const arr = [
          `${prefix}: ${positionText} ${sizeDeltaText}`,
          triggerPriceStr,
        ];

        if (shouldRenderAcceptablePrice) {
          arr.push(acceptablePriceStr);
        }

        return [{ text: arr.join(", ") }];
      }
    }

    case OrderType.MarketDecrease:
    case OrderType.MarketIncrease:
    case OrderType.MarketSwap: {
      let actionText = {
        [TradeActionType.OrderCreated]: `Request`,
        [TradeActionType.OrderExecuted]: "",
        [TradeActionType.OrderCancelled]: `Cancel`,
        [TradeActionType.OrderUpdated]: `Update`,
        [TradeActionType.OrderFrozen]: `Freeze`,
      }[tradeAction.eventName!];

      if (sizeDeltaUsd?.gt(0)) {
        const pricePrefix =
          tradeAction.eventName === TradeActionType.OrderExecuted
            ? `Execution Price`
            : `Acceptable Price`;
        const price =
          tradeAction.eventName === TradeActionType.OrderExecuted
            ? tradeAction.executionPrice
            : tradeAction.acceptablePrice;
        const formattedPrice = formatAcceptablePrice(price, {
          displayDecimals: priceDecimals,
        });
        const priceStr = `${pricePrefix}: ${formattedPrice}`;
        const marketStr = `Market`;

        return [
          {
            text: trimStart(
              `${actionText} ${marketStr} ${increaseText}: ${positionText} ${sizeDeltaText}, `
            ),
          },
          {
            text: priceStr,
            tooltipRows: getMarketTooltipRows(tradeAction),
          },
        ];
      } else {
        const collateralText = formatTokenAmount(
          collateralDeltaAmount,
          collateralToken.decimals,
          collateralToken.symbol,
          {
            useCommas: true,
          }
        );

        if (isIncrease) {
          return [
            {
              text: `${actionText} Deposit ${collateralText} into ${positionText}`,
            },
          ];
        } else {
          return [
            {
              text: `${actionText} Withdraw ${collateralText} from ${positionText}`,
            },
          ];
        }
      }
    }

    case OrderType.Liquidation: {
      const executionPriceStr = `Execution Price`;

      if (tradeAction.eventName === TradeActionType.OrderExecuted) {
        const executionPrice = tradeAction.executionPrice;
        const maxLeverage = PRECISION.div(
          tradeAction.marketInfo.minCollateralFactor
        );
        const maxLeverageText = Number(maxLeverage).toFixed(1) + "x";
        return [
          {
            text: "Liquidated",
            tooltipTitle: `This position was liquidated as the max leverage of ${maxLeverageText} was exceeded.`,
            tooltipRows: getLiquidationTooltipProps(
              tradeAction,
              minCollateralUsd
            ),
          },
          {
            text: ` ${positionText} ${sizeDeltaText}, ${executionPriceStr}: ${formatUsd(
              executionPrice,
              {
                displayDecimals: priceDecimals,
              }
            )}`,
          },
        ];
      }

      return null;
    }

    default: {
      museNeverExist(tradeAction.orderType);
    }
  }

  return null;
};

export const formatSwapMessage = (tradeAction: SwapTradeAction): string => {
  const tokenIn = tradeAction.initialCollateralToken!;
  const tokenOut = tradeAction.targetCollateralToken!;
  const amountIn = tradeAction.initialCollateralDeltaAmount!;

  const amountOut =
    tradeAction.eventName === TradeActionType.OrderExecuted
      ? tradeAction.executionAmountOut!
      : tradeAction.minOutputAmount!;

  const fromText = formatTokenAmount(
    amountIn,
    tokenIn?.decimals,
    tokenIn?.symbol,
    {
      useCommas: true,
    }
  );
  const toText = formatTokenAmount(
    amountOut,
    tokenOut?.decimals,
    tokenOut?.symbol,
    {
      useCommas: true,
    }
  );
  const orderTypeName = getSwapOrderTypeName(tradeAction);

  if (isLimitOrderType(tradeAction.orderType)) {
    const actionText = getOrderActionText(tradeAction);

    const tokensRatio = getTokensRatioByAmounts({
      fromToken: tokenIn,
      toToken: tokenOut,
      fromTokenAmount: amountIn,
      toTokenAmount: amountOut,
    });

    const fromTokenInfo = tokenIn ? adaptToV1TokenInfo(tokenIn) : undefined;
    const toTokenInfo = tokenOut ? adaptToV1TokenInfo(tokenOut) : undefined;

    const [largest, smallest] =
      tokensRatio?.largestToken.address === tokenIn?.address
        ? [fromTokenInfo, toTokenInfo]
        : [toTokenInfo, fromTokenInfo];

    const ratioText = tokensRatio.ratio.gt(0)
      ? getExchangeRateDisplay(tokensRatio?.ratio, largest, smallest)
      : "0";

    return tradeAction.eventName === TradeActionType.OrderFrozen
      ? `${orderTypeName} Swap Execution Failed: ${fromText} for ${toText}, Price: ${ratioText}`
      : `${actionText} ${orderTypeName} Swap: ${fromText} for ${toText}, Price: ${ratioText}`;
  }

  const actionText =
    tradeAction.eventName === TradeActionType.OrderCreated
      ? `Request`
      : getOrderActionText(tradeAction);

  return `${actionText} ${orderTypeName} Swap: ${fromText} for ${toText}`;
};

function getSwapOrderTypeName(tradeAction: SwapTradeAction) {
  return tradeAction.orderType === OrderType.MarketSwap ? `Market` : `Limit`;
}

function getTokenPriceByTradeAction(tradeAction: PositionTradeAction) {
  return getShouldUseMaxPrice(
    isIncreaseOrderType(tradeAction.orderType),
    tradeAction.isLong
  )
    ? tradeAction.indexTokenPriceMax
    : tradeAction.indexTokenPriceMin;
}

function getLiquidationTooltipProps(
  tradeAction: PositionTradeAction,
  minCollateralUsd: BigNumber
): TooltipProps[] {
  const {
    initialCollateralToken,
    initialCollateralDeltaAmount,
    collateralTokenPriceMin,
    borrowingFeeAmount,
    fundingFeeAmount,
    positionFeeAmount,
    pnlUsd,
    priceImpactUsd,
  } = tradeAction;

  const initialCollateralUsd = convertToUsd(
    initialCollateralDeltaAmount,
    initialCollateralToken?.decimals,
    collateralTokenPriceMin
  );

  const positionFeeUsd = convertToUsd(
    positionFeeAmount,
    initialCollateralToken?.decimals,
    collateralTokenPriceMin
  );
  const borrowingFeeUsd = convertToUsd(
    borrowingFeeAmount,
    initialCollateralToken?.decimals,
    collateralTokenPriceMin
  );
  const fundingFeeUsd = convertToUsd(
    fundingFeeAmount,
    initialCollateralToken?.decimals,
    collateralTokenPriceMin
  );

  return [
    {
      label: `Mark Price`,
      showDollar: false,
      value: formatUsd(getTokenPriceByTradeAction(tradeAction), {
        displayDecimals: tradeAction.indexToken.priceDecimals,
      }),
      key: "mark-price",
    },
    {
      label: `Initial collateral`,
      showDollar: false,
      value: formatTokenAmountWithUsd(
        initialCollateralDeltaAmount,
        initialCollateralUsd,
        initialCollateralToken?.symbol,
        initialCollateralToken?.decimals
      ),
      key: "initial-collateral",
    },
    {
      label: `Min required collateral`,
      showDollar: false,
      value: formatUsd(minCollateralUsd),
      key: "min-collateral",
    },
    {
      label: `Borrow Fee`,
      showDollar: false,
      value: formatUsd(borrowingFeeUsd?.mul(-1)),
      className: "text-red",
      key: "borrow-fee",
    },
    {
      label: `Funding Fee`,
      showDollar: false,
      value: formatUsd(fundingFeeUsd?.mul(-1)),
      className: "text-red",
      key: "funding-fee",
    },
    {
      label: `Position Fee`,
      showDollar: false,
      value: formatUsd(positionFeeUsd?.mul(-1)),
      className: "text-red",
      key: "position-fee",
    },
    {
      label: `Price Impact`,
      showDollar: false,
      value: formatDeltaUsd(priceImpactUsd),
      className: priceImpactUsd?.gt(0) ? "text-green" : "text-red",
      key: "price-impact",
    },
    {
      label: `PnL After Fees`,
      showDollar: false,
      value: formatUsd(pnlUsd),
      className: pnlUsd?.gt(0) ? "text-green" : "text-red",
      key: "pnl-after-fees",
    },
  ].map((row) =>
    row.value?.startsWith("-") ? { className: "text-red", ...row } : row
  );
}

function getExecutionFailedTooltipProps(
  tradeAction: PositionTradeAction
): Partial<FormatPositionMessageChunk> {
  const customErrors = new ethers.Contract(
    ethers.constants.AddressZero,
    CustomErrors.abi
  );
  const res: Partial<FormatPositionMessageChunk> = {};

  if (!tradeAction.reasonBytes) return res;

  let error: ReturnType<typeof customErrors.interface.parseError> | null = null;
  try {
    error = customErrors.interface.parseError(tradeAction.reasonBytes);
  } catch (err) {
    return res;
  }

  if (!error) return res;

  const tokenPrice = getTokenPriceByTradeAction(tradeAction);

  return {
    tooltipTitle: getErrorTooltipTitle(error.name),
    tooltipTitleRed: true,
    tooltipRows: [
      tokenPrice && {
        label: `Mark Price`,
        showDollar: false,
        value: formatUsd(tokenPrice, {
          displayDecimals: tradeAction.indexToken.priceDecimals,
        }),
        key: "mark-price",
      },
    ].filter(Boolean) as TooltipProps[],
  };
}

function getExecutionPriceTooltipRows(
  tradeAction: PositionTradeAction
): TooltipProps[] {
  const triggerPrice = tradeAction.triggerPrice;
  const priceDecimals = tradeAction.indexToken.priceDecimals;

  return [
    {
      label: `Order trigger price`,
      showDollar: false,
      value: formatUsd(triggerPrice, { displayDecimals: priceDecimals }),
      key: "trigger-price",
    },
    tradeAction.orderType === OrderType.StopLossDecrease
      ? undefined
      : {
          label: `Acceptable Price`,
          showDollar: false,
          value: formatAcceptablePrice(tradeAction.acceptablePrice, {
            displayDecimals: priceDecimals,
          }),
          key: "acceptable-price",
        },

    tradeAction.priceImpactUsd && {
      label: `Price Impact`,
      showDollar: false,
      value: formatDeltaUsd(tradeAction.priceImpactUsd),
      className: tradeAction.priceImpactUsd.gt(0) ? "text-green" : "text-red",
      key: "price-impact",
    },
  ].filter(Boolean) as TooltipProps[];
}

function getMarketTooltipRows(
  tradeAction: PositionTradeAction
): TooltipProps[] | undefined {
  const priceDecimals = tradeAction.indexToken.priceDecimals;
  const tokenPrice = getTokenPriceByTradeAction(tradeAction);
  const arr = [
    tokenPrice && {
      label: "Mark Price",
      showDollar: false,
      value: formatUsd(tokenPrice, { displayDecimals: priceDecimals }),
      key: "mark-price",
    },
    tradeAction.priceImpactUsd && {
      label: `Actual Price Impact`,
      showDollar: false,
      value: formatDeltaUsd(tradeAction.priceImpactUsd),
      className: tradeAction.priceImpactUsd.gt(0) ? "text-green" : "text-red",
      key: "price-impact",
    },
  ].filter(Boolean) as TooltipProps[];

  return arr.length > 0 ? arr : undefined;
}

function getErrorTooltipTitle(errorName: string) {
  switch (errorName) {
    case "OrderNotFulfillableAtAcceptablePrice": {
      return `The Execution Price didn't meet the Acceptable Price condition. The Order will get filled when the condition is met.`;
    }

    case "InsufficientReserveForOpenInterest": {
      return `Not enough Available Liquidity to fill the Order. The Order will get filled when the condition is met and there is enough Available Liquidity.`;
    }

    case "InsufficientSwapOutputAmount": {
      return `Not enough Available Swap Liquidity to fill the Order. The Order will get filled when the condition is met and there is enough Available Swap Liquidity.`;
    }

    default:
      return `Reason: ${words(errorName).join(" ").toLowerCase()}`;
  }
}
