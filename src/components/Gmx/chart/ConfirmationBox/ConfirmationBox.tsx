import cx from "classnames";
import Button from "../../common/Buttons/Button";
import Checkbox from "../../common/Checkbox/Checkbox";
import ExchangeInfoRow from "../ExchangeInfoRow/ExchangeInfoRow";
import Modal from "../../common/Modal/Modal";
import StatsTooltipRow from "../../common/Tooltip/StatsTooltipRow";
import Tooltip from "../../common/Tooltip/Tooltip";
import { ValueTransition } from "../ValueTransition/ValueTransition";
import { getContract } from "../../../../utils/gmx/config/contracts";
import {
  BASIS_POINTS_DIVISOR,
  DEFAULT_SLIPPAGE_AMOUNT,
  EXCESSIVE_SLIPPAGE_AMOUNT,
  HIGH_SPREAD_THRESHOLD,
} from "../../../../utils/gmx/config/factors";
import { useSyntheticsEvents } from "../../../../utils/gmx/context/SyntheticsEvents";
import { useUserReferralCode } from "../../../../utils/gmx/domain/referrals/hooks";
import {
  ExecutionFee,
  getBorrowingFactorPerPeriod,
  getFundingFactorPerPeriod,
} from "../../../../utils/gmx/domain/synthetics/fees";
import { MarketInfo } from "../../../../utils/gmx/domain/synthetics/markets";
import {
  OrderType,
  OrdersInfoData,
  PositionOrderInfo,
  createIncreaseOrderUserOp,
  isLimitOrderType,
  isOrderForPosition,
  isTriggerDecreaseOrderType,
} from "../../../../utils/gmx/domain/synthetics/orders";
import { cancelOrdersTxn } from "../../../../utils/gmx/domain/synthetics/orders/cancelOrdersTxn";
import {
  PositionInfo,
  formatAcceptablePrice,
  formatLeverage,
  formatLiquidationPrice,
  getPositionKey,
  getTriggerNameByOrderType,
} from "../../../../utils/gmx/domain/synthetics/positions";
import {
  TokenData,
  TokensData,
  TokensRatio,
  convertToTokenAmount,
  formatTokensRatio,
  getNeedTokenApprove,
  useTokensAllowanceData,
} from "../../../../utils/gmx/domain/synthetics/tokens";
import {
  DecreasePositionAmounts,
  IncreasePositionAmounts,
  NextPositionValues,
  SwapAmounts,
  TradeFees,
  TriggerThresholdType,
  applySlippageToMinOut,
  applySlippageToPrice,
  getExecutionPriceForDecrease,
} from "../../../../utils/gmx/domain/synthetics/trade";
import { TradeFlags } from "../../../../utils/gmx/domain/synthetics/trade/useTradeFlags";
import {
  getIsEquivalentTokens,
  getSpread,
} from "../../../../utils/gmx/domain/tokens";
import { BigNumber } from "ethers";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import { CHART_PERIODS, USD_DECIMALS } from "../../../../utils/gmx/lib/legacy";
import { useAlchemyAccountKitContext } from "@/lib/wallets/AlchemyAccountKitProvider";
import PercentageInput from "../Inputs/PercentageInput";
import { SubaccountNavigationButton } from "../Navigation/SubaccountNavigationButton";
import TooltipWithPortal from "../../common/Tooltip/TooltipWithPortal";
import { useSettings } from "../../../../utils/gmx/context/SettingsContext/SettingsContextProvider";
import {
  useIsLastSubaccountAction,
  useSubaccount,
  useSubaccountCancelOrdersDetailsMessage,
} from "../../../../utils/gmx/context/SubaccountContext/SubaccountContext";
import { AvailableMarketsOptions } from "../../../../utils/gmx/domain/synthetics/trade/useAvailableMarketsOptions";
import { usePriceImpactWarningState } from "../../../../utils/gmx/domain/synthetics/trade/usePriceImpactWarningState";
import { helperToast } from "../../../../utils/gmx/lib/helperToast";
import {
  bigNumberify,
  formatAmount,
  formatDeltaUsd,
  formatPercentage,
  formatTokenAmount,
  formatTokenAmountWithUsd,
  formatUsd,
} from "../../../../utils/gmx/lib/numbers";
import { usePrevious } from "../../../../utils/gmx/lib/usePrevious";
import {
  getPlusOrMinusSymbol,
  getPositiveOrNegativeClass,
} from "../../../../utils/gmx/lib/utils";
import useWallet from "../../../../utils/gmx/lib/wallets/useWallet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useKey, useLatest } from "react-use";
import { AcceptablePriceImpactInputRow } from "../AcceptablePriceImpactInputRow/AcceptablePriceImpactInputRow";
import { HighPriceImpactWarning } from "../../common/Notifications/HighPriceImpactWarning";
import { TradeFeesRow } from "../TradeInfo/TradeFeesRow";
import { sendUserOperations } from "@/utils/gmx/lib/userOperations/sendUserOperations";
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { createDecreaseOrderUserOp } from "@/utils/gmx/domain/synthetics/orders/createDecreaseOrderUserOp";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { uniq } from "lodash";
import { createSwapOrderUserOp } from "@/utils/gmx/domain/synthetics/orders/createSwapOrderUserOp";
import { createWrapOrUnwrapOrderUserOp } from "@/utils/gmx/domain/synthetics/orders/createWrapOrUnwrapUserOp";

export type Props = {
  isVisible: boolean;
  tradeFlags: TradeFlags;
  isWrapOrUnwrap: boolean;
  fromToken?: TokenData;
  toToken?: TokenData;
  markPrice?: BigNumber;
  markRatio?: TokensRatio;
  triggerPrice?: BigNumber;
  fixedTriggerThresholdType?: TriggerThresholdType;
  fixedTriggerOrderType?: OrderType.LimitDecrease | OrderType.StopLossDecrease;
  selectedTriggerAcceptablePriceImpactBps?: BigNumber;
  defaultTriggerAcceptablePriceImpactBps?: BigNumber;
  triggerRatio?: TokensRatio;
  marketInfo?: MarketInfo;
  collateralToken?: TokenData;
  swapAmounts?: SwapAmounts;
  marketsOptions?: AvailableMarketsOptions;
  increaseAmounts?: IncreasePositionAmounts;
  decreaseAmounts?: DecreasePositionAmounts;
  nextPositionValues?: NextPositionValues;
  keepLeverage?: boolean;
  swapLiquidityUsd?: BigNumber;
  longLiquidityUsd?: BigNumber;
  shortLiquidityUsd?: BigNumber;
  fees?: TradeFees;
  executionFee?: ExecutionFee;
  error?: string;
  existingPosition?: PositionInfo;
  shouldDisableValidation: boolean;
  isHigherSlippageAllowed?: boolean;
  ordersData?: OrdersInfoData;
  tokensData?: TokensData;
  setSelectedTriggerAcceptablePriceImapctBps: (value: BigNumber) => void;
  setIsHigherSlippageAllowed: (isHigherSlippageAllowed: boolean) => void;
  setKeepLeverage: (keepLeverage: boolean) => void;
  onClose: () => void;
  onSubmitted: () => void;
  setPendingTxns: (txns: any) => void;
};

export function ConfirmationBox(p: Props) {
  const {
    tradeFlags,
    isWrapOrUnwrap,
    fromToken,
    toToken,
    markPrice,
    markRatio,
    triggerPrice,
    fixedTriggerThresholdType,
    fixedTriggerOrderType,
    defaultTriggerAcceptablePriceImpactBps,
    triggerRatio,
    marketInfo,
    collateralToken,
    swapAmounts,
    increaseAmounts,
    decreaseAmounts,
    nextPositionValues,
    swapLiquidityUsd,
    longLiquidityUsd,
    shortLiquidityUsd,
    keepLeverage,
    fees,
    executionFee,
    error,
    existingPosition,
    shouldDisableValidation,
    marketsOptions,
    ordersData,
    tokensData,
    setSelectedTriggerAcceptablePriceImapctBps,
    setKeepLeverage,
    onClose,
    onSubmitted,
    setPendingTxns,
  } = p;

  const {
    isLong,
    isShort,
    isPosition,
    isSwap,
    isMarket,
    isLimit,
    isTrigger,
    isIncrease,
  } = tradeFlags;
  const { indexToken } = marketInfo || {};

  const { signer, account, scAccount } = useWallet();
  const { chainId } = useChainId();
  const { login: openConnectModal } = useAlchemyAccountKitContext();
  const { alchemyProvider } = useAlchemyAccountKitContext();
  const { setPendingPosition, setPendingOrder } = useSyntheticsEvents();
  const { savedAllowedSlippage } = useSettings();

  const prevIsVisible = usePrevious(p.isVisible);

  const { referralCodeForTxn } = useUserReferralCode(signer, chainId, account);

  const [isTriggerWarningAccepted, setIsTriggerWarningAccepted] =
    useState(false);
  const [isLimitOrdersVisible, setIsLimitOrdersVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allowedSlippage, setAllowedSlippage] = useState(savedAllowedSlippage);
  const submitButtonRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    setAllowedSlippage(savedAllowedSlippage);
  }, [savedAllowedSlippage, p.isVisible]);

  const payAmount = useMemo(() => {
    if (isSwap && !isWrapOrUnwrap) {
      return swapAmounts?.amountIn;
    }
    if (isIncrease) {
      return increaseAmounts?.initialCollateralAmount;
    }
  }, [
    increaseAmounts?.initialCollateralAmount,
    isIncrease,
    isSwap,
    isWrapOrUnwrap,
    swapAmounts?.amountIn,
  ]);

  const { tokensAllowanceData } = useTokensAllowanceData(chainId, {
    spenderAddress: getContract(chainId, "SyntheticsRouter"),
    tokenAddresses: fromToken ? [fromToken.address] : [],
    skip: !p.isVisible,
  });

  const tokensToApprove = (function getTokensToApprove() {
    const addresses: string[] = [];

    if (!tokensAllowanceData) {
      return addresses;
    }

    if (
      fromToken &&
      payAmount &&
      getNeedTokenApprove(tokensAllowanceData, fromToken.address, payAmount)
    ) {
      addresses.push(fromToken.address);
    }

    return uniq(addresses);
  })();

  const needPayTokenApproval =
    tokensAllowanceData &&
    fromToken &&
    payAmount &&
    getNeedTokenApprove(tokensAllowanceData, fromToken.address, payAmount);

  const positionKey = useMemo(() => {
    if (!account || !marketInfo || !collateralToken) {
      return undefined;
    }

    return getPositionKey(
      account,
      marketInfo.marketTokenAddress,
      collateralToken.address,
      isLong
    );
  }, [account, collateralToken, isLong, marketInfo]);

  const positionOrders = useMemo(() => {
    if (!positionKey || !ordersData) {
      return [];
    }

    return Object.values(ordersData).filter((order) =>
      isOrderForPosition(order, positionKey)
    ) as PositionOrderInfo[];
  }, [ordersData, positionKey]);

  const existingLimitOrders = useMemo(
    () => positionOrders.filter((order) => isLimitOrderType(order.orderType)),
    [positionOrders]
  );

  const existingTriggerOrders = useMemo(
    () =>
      positionOrders.filter((order) =>
        isTriggerDecreaseOrderType(order.orderType)
      ),
    [positionOrders]
  );

  const decreaseOrdersThatWillBeExecuted = useMemo(() => {
    if (!existingPosition || !markPrice) {
      return [];
    }

    return existingTriggerOrders.filter((order) => {
      return order.triggerThresholdType === TriggerThresholdType.Above
        ? markPrice.gt(order.triggerPrice)
        : markPrice.lt(order.triggerPrice);
    });
  }, [existingPosition, existingTriggerOrders, markPrice]);

  const swapSpreadInfo = useMemo(() => {
    let spread = BigNumber.from(0);

    if (isSwap && fromToken && toToken) {
      const fromSpread = getSpread(fromToken.prices);
      const toSpread = getSpread(toToken.prices);

      spread = fromSpread.add(toSpread);
    } else if (isIncrease && fromToken && indexToken) {
      const fromSpread = getSpread(fromToken.prices);
      const toSpread = getSpread(indexToken.prices);

      spread = fromSpread.add(toSpread);

      if (isLong) {
        spread = fromSpread;
      }
    }

    const isHigh = spread.gt(HIGH_SPREAD_THRESHOLD);

    const showSpread = isMarket;

    return { spread, showSpread, isHigh };
  }, [isSwap, fromToken, toToken, isIncrease, indexToken, isMarket, isLong]);

  const collateralSpreadInfo = useMemo(() => {
    if (!indexToken || !collateralToken) {
      return undefined;
    }

    let totalSpread = getSpread(indexToken.prices);

    if (getIsEquivalentTokens(collateralToken, indexToken)) {
      return {
        spread: totalSpread,
        isHigh: totalSpread.gt(HIGH_SPREAD_THRESHOLD),
      };
    }

    totalSpread = totalSpread.add(getSpread(collateralToken!.prices!));

    return {
      spread: totalSpread,
      isHigh: totalSpread.gt(HIGH_SPREAD_THRESHOLD),
    };
  }, [collateralToken, indexToken]);

  const title = useMemo(() => {
    if (isMarket) {
      if (isSwap) {
        return `Confirm Swap`;
      }

      return isLong ? `Confirm Long` : `Confirm Short`;
    }

    if (isLimit) {
      return `Confirm Limit Order`;
    }

    return `Confirm ${getTriggerNameByOrderType(fixedTriggerOrderType)} Order`;
  }, [fixedTriggerOrderType, isLimit, isLong, isMarket, isSwap]);

  const priceImpactWarningState = usePriceImpactWarningState({
    positionPriceImpact: fees?.positionPriceImpact,
    swapPriceImpact: fees?.swapPriceImpact,
    tradeFlags,
    place: "confirmationBox",
  });

  const setIsHighPositionImpactAcceptedRef = useLatest(
    priceImpactWarningState.setIsHighPositionImpactAccepted
  );
  const setIsHighSwapImpactAcceptedRef = useLatest(
    priceImpactWarningState.setIsHighSwapImpactAccepted
  );

  useEffect(() => {
    setIsHighPositionImpactAcceptedRef.current(false);
    setIsHighSwapImpactAcceptedRef.current(false);
  }, [
    p.isVisible,
    setIsHighPositionImpactAcceptedRef,
    setIsHighSwapImpactAcceptedRef,
  ]);

  const submitButtonState = useMemo(() => {
    if (isSubmitting) {
      return {
        text: `Creating Order...`,
        disabled: true,
      };
    }

    if (error) {
      return {
        text: error,
        disabled: true,
      };
    }

    if (
      isIncrease &&
      decreaseOrdersThatWillBeExecuted.length > 0 &&
      !isTriggerWarningAccepted
    ) {
      return {
        text: `Accept confirmation of trigger orders`,
        disabled: true,
      };
    }

    let text = "";

    if (isMarket) {
      if (isSwap) {
        text = `Swap`;
      } else {
        text = isLong ? `Long` : `Short`;
      }
    } else if (isLimit) {
      text = `Confirm Limit Order`;
    } else {
      text = `Confirm ${getTriggerNameByOrderType(
        fixedTriggerOrderType
      )} Order`;
    }

    return {
      text,
      disabled: false,
    };
  }, [
    isLimit,
    priceImpactWarningState.validationError,
    isSubmitting,
    error,
    needPayTokenApproval,
    isIncrease,
    decreaseOrdersThatWillBeExecuted.length,
    isTriggerWarningAccepted,
    isMarket,
    fromToken?.assetSymbol,
    fromToken?.symbol,
    isSwap,
    isLong,
    fixedTriggerOrderType,
  ]);

  useKey(
    "Enter",
    () => {
      if (p.isVisible && !submitButtonState.disabled) {
        submitButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
        onSubmit();
      }
    },
    {},
    [p.isVisible, submitButtonState.disabled]
  );

  const subaccountRequiredBalance = p.executionFee?.feeTokenAmount ?? null;
  const subaccount = useSubaccount(subaccountRequiredBalance);
  const isLastSubaccountAction = useIsLastSubaccountAction(1);
  const cancelOrdersDetailsMessage = useSubaccountCancelOrdersDetailsMessage(
    subaccountRequiredBalance ?? undefined,
    1
  );

  const routerAddress = getContract(chainId, "SyntheticsRouter");

  function onCancelOrderClick(key: string): void {
    if (!signer) return;
    cancelOrdersTxn(chainId, signer, subaccount, {
      orderKeys: [key],
      setPendingTxns: p.setPendingTxns,
      isLastSubaccountAction,
      detailsMsg: cancelOrdersDetailsMessage,
    });
  }

  async function onSubmitWrapOrUnwrap() {
    if (!scAccount || !swapAmounts || !fromToken) {
      return Promise.resolve();
    }

    const userOps = tokensToApprove.map((address: string) =>
      createApproveTokensUserOp({
        tokenAddress: address,
        spender: routerAddress,
      })
    );

    const createWrapOrUnwrapOrderOp = await createWrapOrUnwrapOrderUserOp(
      chainId,
      {
        amount: swapAmounts.amountIn,
        isWrap: Boolean(fromToken.isNative),
        setPendingTxns,
      }
    );
    userOps.push(createWrapOrUnwrapOrderOp);

    return sendUserOperations(alchemyProvider, chainId, userOps);

    // return createWrapOrUnwrapTxn(chainId, signer, {
    //   amount: swapAmounts.amountIn,
    //   isWrap: Boolean(fromToken.isNative),
    //   setPendingTxns,
    // });
  }

  async function onSubmitSwap() {
    if (
      !scAccount ||
      !tokensData ||
      !swapAmounts?.swapPathStats ||
      !fromToken ||
      !toToken ||
      !executionFee ||
      typeof allowedSlippage !== "number"
    ) {
      helperToast.error(`Error submitting order`);
      return Promise.resolve();
    }

    const userOps = tokensToApprove.map((address: string) =>
      createApproveTokensUserOp({
        tokenAddress: address,
        spender: routerAddress,
      })
    );

    const createSwapOrderOp = await createSwapOrderUserOp(chainId, subaccount, {
      account: scAccount,
      fromTokenAddress: fromToken.address,
      fromTokenAmount: swapAmounts.amountIn,
      swapPath: swapAmounts.swapPathStats?.swapPath,
      toTokenAddress: toToken.address,
      orderType: isLimit ? OrderType.LimitSwap : OrderType.MarketSwap,
      minOutputAmount: swapAmounts.minOutputAmount,
      referralCode: referralCodeForTxn,
      executionFee: executionFee.feeTokenAmount,
      allowedSlippage,
      tokensData,
      setPendingTxns,
      setPendingOrder,
    });

    userOps.push(createSwapOrderOp);

    return sendUserOperations(alchemyProvider, chainId, userOps);

    // return createSwapOrderTxn(chainId, signer, subaccount, {
    //   account:scAccount,
    //   fromTokenAddress: fromToken.address,
    //   fromTokenAmount: swapAmounts.amountIn,
    //   swapPath: swapAmounts.swapPathStats?.swapPath,
    //   toTokenAddress: toToken.address,
    //   orderType: isLimit ? OrderType.LimitSwap : OrderType.MarketSwap,
    //   minOutputAmount: swapAmounts.minOutputAmount,
    //   referralCode: referralCodeForTxn,
    //   executionFee: executionFee.feeTokenAmount,
    //   allowedSlippage,
    //   tokensData,
    //   setPendingTxns,
    //   setPendingOrder,
    // });
  }

  async function onSubmitIncreaseOrder() {
    if (
      !tokensData ||
      !scAccount ||
      !fromToken ||
      !collateralToken ||
      !increaseAmounts?.acceptablePrice ||
      !executionFee ||
      !marketInfo ||
      typeof allowedSlippage !== "number"
    ) {
      helperToast.error(`Error submitting order`);
      return Promise.resolve();
    }

    const userOps = tokensToApprove.map((address: string) =>
      createApproveTokensUserOp({
        tokenAddress: address,
        spender: routerAddress,
      })
    );

    const createIncreaseOrderOp = await createIncreaseOrderUserOp(
      chainId,
      subaccount,
      {
        account: scAccount as string,
        marketAddress: marketInfo.marketTokenAddress,
        initialCollateralAddress: fromToken?.address,
        initialCollateralAmount: increaseAmounts.initialCollateralAmount,
        targetCollateralAddress: collateralToken.address,
        collateralDeltaAmount: increaseAmounts.collateralDeltaAmount,
        swapPath: increaseAmounts.swapPathStats?.swapPath || [],
        sizeDeltaUsd: increaseAmounts.sizeDeltaUsd,
        sizeDeltaInTokens: increaseAmounts.sizeDeltaInTokens,
        triggerPrice: isLimit ? triggerPrice : undefined,
        acceptablePrice: increaseAmounts.acceptablePrice,
        isLong,
        orderType: isLimit ? OrderType.LimitIncrease : OrderType.MarketIncrease,
        executionFee: executionFee.feeTokenAmount,
        allowedSlippage,
        referralCode: referralCodeForTxn,
        indexToken: marketInfo.indexToken,
        tokensData,
        skipSimulation: isLimit || shouldDisableValidation,
        setPendingTxns: p.setPendingTxns,
        setPendingOrder,
        setPendingPosition,
      }
    );

    userOps.push(createIncreaseOrderOp);

    return sendUserOperations(alchemyProvider, chainId, userOps);
  }

  async function onSubmitDecreaseOrder() {
    if (
      !scAccount ||
      !marketInfo ||
      !collateralToken ||
      fixedTriggerOrderType === undefined ||
      fixedTriggerThresholdType === undefined ||
      !decreaseAmounts?.acceptablePrice ||
      !decreaseAmounts?.triggerPrice ||
      !executionFee ||
      !tokensData ||
      typeof allowedSlippage !== "number"
    ) {
      helperToast.error(`Error submitting order`);
      return Promise.resolve();
    }

    const userOps = tokensToApprove.map((address: string) =>
      createApproveTokensUserOp({
        tokenAddress: address,
        spender: routerAddress,
      })
    );

    const createDecreaseOrderOp = await createDecreaseOrderUserOp(
      chainId,
      subaccount,
      {
        account: scAccount as string,
        marketAddress: marketInfo.marketTokenAddress,
        swapPath: [],
        initialCollateralDeltaAmount: decreaseAmounts.collateralDeltaAmount,
        initialCollateralAddress: collateralToken.address,
        receiveTokenAddress: collateralToken.address,
        triggerPrice: decreaseAmounts.triggerPrice,
        acceptablePrice: decreaseAmounts.acceptablePrice,
        sizeDeltaUsd: decreaseAmounts.sizeDeltaUsd,
        sizeDeltaInTokens: decreaseAmounts.sizeDeltaInTokens,
        minOutputUsd: BigNumber.from(0),
        isLong,
        decreasePositionSwapType: decreaseAmounts.decreaseSwapType,
        orderType: fixedTriggerOrderType,
        executionFee: executionFee.feeTokenAmount,
        allowedSlippage,
        referralCode: referralCodeForTxn,
        // Skip simulation to avoid EmptyPosition error
        // skipSimulation: !existingPosition || shouldDisableValidation,
        skipSimulation: true,
        indexToken: marketInfo.indexToken,
        tokensData,
      },
      {
        setPendingTxns,
        setPendingOrder,
        setPendingPosition,
      }
    );

    // return createDecreaseOrderTxn(
    //   chainId,
    //   signer,
    //   subaccount,
    //   {
    //     account,
    //     marketAddress: marketInfo.marketTokenAddress,
    //     swapPath: [],
    //     initialCollateralDeltaAmount: decreaseAmounts.collateralDeltaAmount,
    //     initialCollateralAddress: collateralToken.address,
    //     receiveTokenAddress: collateralToken.address,
    //     triggerPrice: decreaseAmounts.triggerPrice,
    //     acceptablePrice: decreaseAmounts.acceptablePrice,
    //     sizeDeltaUsd: decreaseAmounts.sizeDeltaUsd,
    //     sizeDeltaInTokens: decreaseAmounts.sizeDeltaInTokens,
    //     minOutputUsd: BigNumber.from(0),
    //     isLong,
    //     decreasePositionSwapType: decreaseAmounts.decreaseSwapType,
    //     orderType: fixedTriggerOrderType,
    //     executionFee: executionFee.feeTokenAmount,
    //     allowedSlippage,
    //     referralCode: referralCodeForTxn,
    //     // Skip simulation to avoid EmptyPosition error
    //     // skipSimulation: !existingPosition || shouldDisableValidation,
    //     skipSimulation: true,
    //     indexToken: marketInfo.indexToken,
    //     tokensData,
    //   },
    //   {
    //     setPendingTxns,
    //     setPendingOrder,
    //     setPendingPosition,
    //   }
    // );

    userOps.push(createDecreaseOrderOp);

    return sendUserOperations(alchemyProvider, chainId, userOps);
  }

  function onSubmit() {
    setIsSubmitting(true);

    let txnPromise: Promise<any>;

    if (!account) {
      openConnectModal?.();
      return;
    } else if (isWrapOrUnwrap) {
      txnPromise = onSubmitWrapOrUnwrap();
    } else if (isSwap) {
      txnPromise = onSubmitSwap();
    } else if (isIncrease) {
      txnPromise = onSubmitIncreaseOrder();
    } else {
      txnPromise = onSubmitDecreaseOrder();
    }

    txnPromise
      .then(() => {
        onSubmitted();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  useEffect(
    function reset() {
      if (p.isVisible !== prevIsVisible) {
        setIsTriggerWarningAccepted(false);
      }
    },
    [p.isVisible, prevIsVisible]
  );

  function renderSubaccountNavigationButton() {
    return (
      <SubaccountNavigationButton
        executionFee={p.executionFee?.feeTokenAmount}
        closeConfirmationBox={onClose}
        isNativeToken={Boolean(fromToken?.isNative)}
        tradeFlags={tradeFlags}
      />
    );
  }

  function renderMain() {
    if (isSwap) {
      return (
        <>
          <div className="Confirmation-box-main">
            <div className="flex text-lg justify-center">
              <span className="mr-2">Pay</span>
              {formatTokenAmountWithUsd(
                swapAmounts?.amountIn,
                swapAmounts?.usdIn,
                fromToken?.symbol,
                fromToken?.decimals
              )}
            </div>
            <div className="flex items-center justify-center ">
              <ArrowDownIcon className="h-7 w-7 my-1" />
            </div>
            <div className="flex text-lg justify-center">
              <span className="mr-2">Receive</span>
              {formatTokenAmountWithUsd(
                swapAmounts?.amountOut,
                swapAmounts?.usdOut,
                toToken?.symbol,
                toToken?.decimals
              )}
            </div>
          </div>
        </>
      );
    }

    if (isIncrease) {
      return (
        <>
          <div>
            <span className="flex text-lg justify-center">
              <span className="mr-2">Pay </span>{" "}
              {formatTokenAmountWithUsd(
                increaseAmounts?.initialCollateralAmount,
                increaseAmounts?.initialCollateralUsd,
                fromToken?.symbol,
                fromToken?.decimals
              )}
            </span>
            <div className="flex items-center justify-center ">
              <ArrowDownIcon className="h-7 w-7 my-1" />
            </div>
            <div className="flex text-lg justify-center">
              <span className="mr-2"> {isLong ? `Long` : `Short`}</span>
              {formatTokenAmountWithUsd(
                increaseAmounts?.sizeDeltaInTokens,
                increaseAmounts?.sizeDeltaUsd,
                toToken?.symbol,
                toToken?.decimals
              )}
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className={cx("Confirmation-box-main ConfirmationBox-main")}>
          Decrease&nbsp;{indexToken?.symbol} {isLong ? `Long` : `Short`}
        </div>
        {renderSubaccountNavigationButton()}
      </>
    );
  }

  function renderOrderItem(order: PositionOrderInfo) {
    return (
      <li key={order.key} className="font-sm">
        <p>
          {isLimitOrderType(order.orderType) ? `Increase` : `Decrease`}{" "}
          {order.indexToken?.symbol} {formatUsd(order.sizeDeltaUsd)}{" "}
          {order.isLong ? `Long` : `Short`} &nbsp;
          {order.triggerThresholdType}
          {formatUsd(order.triggerPrice, {
            displayDecimals: toToken?.priceDecimals,
          })}{" "}
        </p>
        <button type="button" onClick={() => onCancelOrderClick(order.key)}>
          Cancel
        </button>
      </li>
    );
  }

  const longShortText = isLong ? `Long` : `Short`;

  function renderDifferentTokensWarning() {
    if (!isPosition || !fromToken || !toToken) {
      return null;
    }
    const isCollateralTokenNonStable = !collateralToken?.isStable;
    const collateralTokenSymbol =
      collateralToken?.[collateralToken?.isWrapped ? "baseSymbol" : "symbol"];
    const indexTokenSymbol =
      indexToken?.[indexToken?.isWrapped ? "baseSymbol" : "symbol"];

    if (
      isCollateralTokenNonStable &&
      collateralTokenSymbol !== indexTokenSymbol
    ) {
      return (
        <div className="Confirmation-box-info">
          You have selected {collateralTokenSymbol} as Collateral, the
          Liquidation Price will vary based on the price of{" "}
          {collateralTokenSymbol}.
        </div>
      );
    }

    if (
      isLong &&
      isCollateralTokenNonStable &&
      collateralTokenSymbol === indexTokenSymbol
    ) {
      return (
        <div className="Confirmation-box-info">
          You have selected {collateralTokenSymbol} as collateral, the
          Liquidation Price is higher compared to using a stablecoin as
          collateral since the worth of the collateral will change with its
          price. If required, you can change the collateral type using the
          Collateral In option in the trade box.
        </div>
      );
    }

    if (
      isShort &&
      isCollateralTokenNonStable &&
      collateralTokenSymbol === indexTokenSymbol
    ) {
      return (
        <div className="Confirmation-box-info">
          You have selected {collateralTokenSymbol} as collateral to short{" "}
          {indexTokenSymbol}.
        </div>
      );
    }
  }

  const isOrphanOrder =
    marketsOptions?.collateralWithPosition &&
    collateralToken &&
    !getIsEquivalentTokens(
      marketsOptions.collateralWithPosition,
      collateralToken
    );

  const executionPriceUsd = useMemo(() => {
    if (!marketInfo) return null;
    if (!fees?.positionPriceImpact?.deltaUsd) return null;
    if (!decreaseAmounts) return null;
    if (!triggerPrice) return null;

    return getExecutionPriceForDecrease(
      triggerPrice,
      fees.positionPriceImpact.deltaUsd,
      decreaseAmounts.sizeDeltaUsd,
      isLong
    );
  }, [
    decreaseAmounts,
    fees?.positionPriceImpact?.deltaUsd,
    isLong,
    marketInfo,
    triggerPrice,
  ]);

  function renderDifferentCollateralWarning() {
    if (!isOrphanOrder) {
      return null;
    }

    if (isMarket) {
      return (
        <div className="Confirmation-box-warning">
          You have an existing position with{" "}
          {marketsOptions?.collateralWithPosition?.symbol} as collateral. This
          action will not apply for that position.
        </div>
      );
    }

    return (
      <div className="Confirmation-box-warning">
        You have an existing position with{" "}
        {marketsOptions?.collateralWithPosition?.symbol} as collateral. This
        Order will not be valid for that Position.
      </div>
    );
  }

  function renderExistingLimitOrdersWarning() {
    if (!existingLimitOrders?.length || !toToken) {
      return;
    }

    if (existingLimitOrders.length === 1) {
      const order = existingLimitOrders[0];

      const sizeText = formatUsd(order.sizeDeltaUsd);

      return (
        <div className="Confirmation-box-info">
          You have an active Limit Order to Increase {longShortText}{" "}
          {order.indexToken?.symbol} {sizeText} at price{" "}
          {formatUsd(order.triggerPrice, {
            displayDecimals: toToken.priceDecimals,
          })}
          .
        </div>
      );
    } else {
      return (
        <div>
          <div className="Confirmation-box-info">
            <span>
              You have multiple existing Increase {longShortText}{" "}
              {toToken.symbol} limit orders{" "}
            </span>
            <span
              onClick={() => setIsLimitOrdersVisible((p) => !p)}
              className="view-orders"
            >
              ({isLimitOrdersVisible ? `hide` : `view`})
            </span>
          </div>
          {isLimitOrdersVisible && (
            <ul className="order-list">
              {existingLimitOrders.map(renderOrderItem)}
            </ul>
          )}
        </div>
      );
    }
  }

  function renderExistingTriggerErrors() {
    if (!decreaseOrdersThatWillBeExecuted?.length) {
      return;
    }

    return (
      <>
        <div className="Confirmation-box-warning">
          You have an active trigger order that might execute immediately after
          you open this position. Please cancel the order or accept the
          confirmation to continue.
        </div>
        <ul className="order-list">
          {decreaseOrdersThatWillBeExecuted.map(renderOrderItem)}
        </ul>
      </>
    );
  }

  function renderExistingTriggerWarning() {
    if (
      !existingTriggerOrders?.length ||
      decreaseOrdersThatWillBeExecuted.length > 0 ||
      renderExistingLimitOrdersWarning()
    ) {
      return;
    }

    return (
      <div className="Confirmation-box-info">
        You have an active trigger order that could impact this position.
      </div>
    );
  }

  function renderAvailableLiquidity() {
    const riskThresholdBps = 5000;
    let availableLiquidityUsd: BigNumber | undefined = undefined;
    let availableLiquidityAmount: BigNumber | undefined = undefined;
    let isLiquidityRisk = false;

    let tooltipContent = "";

    if (isSwap && swapAmounts) {
      availableLiquidityUsd = swapLiquidityUsd;

      availableLiquidityAmount = convertToTokenAmount(
        availableLiquidityUsd,
        toToken?.decimals,
        toToken?.prices.maxPrice
      );

      isLiquidityRisk = availableLiquidityUsd!
        .mul(riskThresholdBps)
        .div(BASIS_POINTS_DIVISOR)
        .lt(swapAmounts.usdOut);

      tooltipContent = isLiquidityRisk
        ? `There may not be sufficient liquidity to execute your order when the Min. Receive are met.`
        : `The order will only execute if the Min. Receive is met and there is sufficient liquidity.`;
    }

    if (isIncrease && increaseAmounts) {
      availableLiquidityUsd = isLong ? longLiquidityUsd : shortLiquidityUsd;

      isLiquidityRisk = availableLiquidityUsd!
        .mul(riskThresholdBps)
        .div(BASIS_POINTS_DIVISOR)
        .lt(increaseAmounts.sizeDeltaUsd);

      tooltipContent = isLiquidityRisk
        ? `There may not be sufficient liquidity to execute your order when the price conditions are met.`
        : `The order will only execute if the price conditions are met and there is sufficient liquidity.`;
    }

    return (
      <ExchangeInfoRow label={`Available Liquidity`}>
        <Tooltip
          position="right-bottom"
          handleClassName={isLiquidityRisk ? "negative" : ""}
          handle={
            isSwap
              ? formatTokenAmount(
                  availableLiquidityAmount,
                  toToken?.decimals,
                  toToken?.symbol
                )
              : formatUsd(availableLiquidityUsd)
          }
          renderContent={() => tooltipContent}
        />
      </ExchangeInfoRow>
    );
  }

  function renderSwapSpreadWarining() {
    if (!isMarket) {
      return null;
    }

    if (swapSpreadInfo.spread && swapSpreadInfo.isHigh) {
      return (
        <div className="Confirmation-box-warning">
          The spread is {`>`} 1%, please ensure the trade details are acceptable
          before comfirming
        </div>
      );
    }
  }

  function renderLimitPriceWarning() {
    return (
      <div className="Confirmation-box-info">
        Limit Order Price will vary based on Fees and Price Impact to guarantee
        the Min. Receive amount.
      </div>
    );
  }

  const renderCollateralSpreadWarning = useCallback(() => {
    if (collateralSpreadInfo && collateralSpreadInfo.isHigh) {
      return (
        <div className="Confirmation-box-warning">
          Transacting with a depegged stable coin is subject to spreads
          reflecting the worse of current market price or $1.00, with
          transactions involving multiple stablecoins may have multiple spreads.
        </div>
      );
    }
  }, [collateralSpreadInfo]);

  function renderAllowedSlippage(defaultSlippage, setSlippage) {
    return (
      <ExchangeInfoRow
        label={
          <TooltipWithPortal
            handle={`Allowed Slippage`}
            position="left-top"
            renderContent={() => {
              return (
                <div className="text-white">
                  You can edit the default Allowed Slippage in the settings menu
                  on the top right of the page.
                  <br />
                  <br />
                  Note that a low allowed slippage, e.g. less than{" "}
                  {formatPercentage(bigNumberify(DEFAULT_SLIPPAGE_AMOUNT), {
                    signed: false,
                  })}
                  , may result in failed orders if prices are volatile.
                </div>
              );
            }}
          />
        }
      >
        <PercentageInput
          onChange={setSlippage}
          defaultValue={defaultSlippage}
          highValue={EXCESSIVE_SLIPPAGE_AMOUNT}
          highValueWarningText={`Slippage is too high`}
        />
      </ExchangeInfoRow>
    );
  }

  function renderAcceptablePriceImpactInput() {
    return (
      <AcceptablePriceImpactInputRow
        defaultAcceptablePriceImpactBps={defaultTriggerAcceptablePriceImpactBps}
        fees={fees}
        setSelectedAcceptablePriceImpactBps={
          setSelectedTriggerAcceptablePriceImapctBps
        }
      />
    );
  }

  function renderHighPriceImpactWarning() {
    if (!priceImpactWarningState.shouldShowWarning) return null;
    return (
      <HighPriceImpactWarning
        priceImpactWarinigState={priceImpactWarningState}
      />
    );
  }

  function renderLeverage(
    from: BigNumber | undefined,
    to: BigNumber | undefined,
    emptyValue = false
  ) {
    return (
      <>
        <ExchangeInfoRow
          label={`Leverage`}
          value={
            emptyValue ? (
              "-"
            ) : (
              <ValueTransition
                from={formatLeverage(from)}
                to={formatLeverage(to) ?? "-"}
              />
            )
          }
        />
        <div className="border-b-1" />
      </>
    );
  }

  function renderIncreaseOrderSection() {
    if (!marketInfo || !fromToken || !collateralToken || !toToken) {
      return null;
    }

    const borrowingRate = getBorrowingFactorPerPeriod(
      marketInfo,
      isLong,
      CHART_PERIODS["1h"]
    ).mul(100);
    const fundigRate = getFundingFactorPerPeriod(
      marketInfo,
      isLong,
      CHART_PERIODS["1h"]
    ).mul(100);
    const isCollateralSwap = !getIsEquivalentTokens(fromToken, collateralToken);
    const existingPriceDecimals = p.existingPosition?.indexToken?.priceDecimals;
    const toTokenPriceDecimals = toToken?.priceDecimals;

    const shouldApplySlippage = isMarket;
    const acceptablePrice =
      shouldApplySlippage && increaseAmounts?.acceptablePrice
        ? applySlippageToPrice(
            allowedSlippage,
            increaseAmounts.acceptablePrice,
            true,
            isLong
          )
        : increaseAmounts?.acceptablePrice;

    return (
      <>
        <div>
          {renderMain()}

          {renderDifferentCollateralWarning()}
          {renderCollateralSpreadWarning()}
          {renderExistingLimitOrdersWarning()}
          {renderExistingTriggerErrors()}
          {renderExistingTriggerWarning()}
          {renderDifferentTokensWarning()}

          {isLimit && renderAvailableLiquidity()}
          {renderLeverage(
            existingPosition?.leverage,
            nextPositionValues?.nextLeverage
          )}
          {isMarket &&
            renderAllowedSlippage(savedAllowedSlippage, setAllowedSlippage)}
          {isMarket && collateralSpreadInfo?.spread && (
            <ExchangeInfoRow
              label={`Collateral Spread`}
              isWarning={swapSpreadInfo.isHigh}
              isTop={true}
              className="border-b-1 pb-4"
            >
              {formatAmount(
                collateralSpreadInfo.spread.mul(100),
                USD_DECIMALS,
                2,
                true
              )}
              %
            </ExchangeInfoRow>
          )}

          <ExchangeInfoRow
            className="SwapBox-info-row"
            label={`Entry Price`}
            value={
              <ValueTransition
                from={formatUsd(p.existingPosition?.entryPrice, {
                  displayDecimals: existingPriceDecimals,
                })}
                to={formatUsd(nextPositionValues?.nextEntryPrice, {
                  displayDecimals: toTokenPriceDecimals,
                })}
              />
            }
          />

          {isLimit && (
            <ExchangeInfoRow
              className="SwapBox-info-row"
              label={`Limit Price`}
              value={
                formatUsd(triggerPrice, {
                  displayDecimals: toTokenPriceDecimals,
                }) || "-"
              }
            />
          )}

          <ExchangeInfoRow
            className="SwapBox-info-row"
            label={`Acceptable Price`}
            value={
              formatAcceptablePrice(acceptablePrice, {
                displayDecimals: toTokenPriceDecimals,
              }) || "-"
            }
          />
          {isLimit && increaseAmounts && renderAcceptablePriceImpactInput()}

          <ExchangeInfoRow
            className="SwapBox-info-row"
            label={`Mark Price`}
            value={
              formatUsd(markPrice, {
                displayDecimals: toTokenPriceDecimals,
              }) || "-"
            }
          />

          <ExchangeInfoRow
            className="border-b-1 pb-4"
            label={`Liq. Price`}
            value={
              <ValueTransition
                from={
                  p.existingPosition
                    ? formatLiquidationPrice(
                        p.existingPosition?.liquidationPrice,
                        {
                          displayDecimals: existingPriceDecimals,
                        }
                      )
                    : undefined
                }
                to={
                  formatLiquidationPrice(nextPositionValues?.nextLiqPrice, {
                    displayDecimals: toTokenPriceDecimals,
                  }) || "-"
                }
              />
            }
          />
          <div className="flex justify-between">
            <div>
              {isCollateralSwap ? (
                <Tooltip
                  handle={
                    <span className="Exchange-info-label">
                      Collateral ({collateralToken?.symbol})
                    </span>
                  }
                  position="left-top"
                  renderContent={() => {
                    return (
                      <div>
                        {fromToken?.symbol} will be swapped to{" "}
                        {collateralToken?.symbol} on order execution.{" "}
                        {isLimit && (
                          <span>
                            Collateral value may differ due to different Price
                            Impact at the time of execution.
                          </span>
                        )}
                      </div>
                    );
                  }}
                />
              ) : (
                <span className="Exchange-info-label">
                  Collateral ({collateralToken?.symbol})
                </span>
              )}
            </div>
            <div className="align-right">
              <Tooltip
                handle={formatUsd(increaseAmounts?.collateralDeltaUsd)}
                position="right-top"
                renderContent={() => {
                  return (
                    <>
                      Your position's collateral after deducting fees.
                      <br />
                      <br />
                      <StatsTooltipRow
                        label={`Pay Amount`}
                        value={
                          formatUsd(increaseAmounts?.initialCollateralUsd) ||
                          "-"
                        }
                        showDollar={false}
                      />
                      <StatsTooltipRow
                        label={`Fees`}
                        value={
                          fees?.payTotalFees?.deltaUsd &&
                          !fees.payTotalFees.deltaUsd.eq(0)
                            ? formatUsd(fees.payTotalFees.deltaUsd)
                            : "0.00$"
                        }
                        showDollar={false}
                        className={getPositiveOrNegativeClass(
                          fees?.payTotalFees?.deltaUsd
                        )}
                      />
                      <div className="Tooltip-divider" />
                      <StatsTooltipRow
                        label={`Collateral`}
                        value={
                          formatUsd(increaseAmounts?.collateralDeltaUsd) || "-"
                        }
                        showDollar={false}
                      />
                    </>
                  );
                }}
              />
            </div>
          </div>
          <TradeFeesRow
            {...fees}
            fundingFeeRateStr={
              fundigRate &&
              `${getPlusOrMinusSymbol(fundigRate)}${formatAmount(
                fundigRate.abs(),
                30,
                4
              )}% / 1h`
            }
            borrowFeeRateStr={
              borrowingRate && `-${formatAmount(borrowingRate, 30, 4)}% / 1h`
            }
            executionFee={p.executionFee}
            feesType="increase"
          />
          {decreaseOrdersThatWillBeExecuted?.length > 0 && (
            <div className="line-divider" />
          )}
          {decreaseOrdersThatWillBeExecuted?.length > 0 && (
            <div className="PositionEditor-allow-higher-slippage">
              <Checkbox
                isChecked={isTriggerWarningAccepted}
                setIsChecked={setIsTriggerWarningAccepted}
              >
                <span className="text-warning font-sm">
                  I am aware of the trigger orders
                </span>
              </Checkbox>
            </div>
          )}
        </div>
      </>
    );
  }

  function renderSwapSection() {
    return (
      <>
        <div>
          {renderMain()}
          {renderSwapSpreadWarining()}
          {isLimit && renderLimitPriceWarning()}
          {swapSpreadInfo.showSpread && swapSpreadInfo.spread && (
            <ExchangeInfoRow label={`Spread`} isWarning={swapSpreadInfo.isHigh}>
              {formatAmount(
                swapSpreadInfo.spread.mul(100),
                USD_DECIMALS,
                2,
                true
              )}
              %
            </ExchangeInfoRow>
          )}
          {isLimit && renderAvailableLiquidity()}
          {isMarket &&
            renderAllowedSlippage(savedAllowedSlippage, setAllowedSlippage)}
          <ExchangeInfoRow label={`Mark Price`} isTop>
            {formatTokensRatio(fromToken, toToken, markRatio)}
          </ExchangeInfoRow>
          {isLimit && (
            <ExchangeInfoRow label={`Limit Price`}>
              <Tooltip
                position="right-bottom"
                handle={formatTokensRatio(fromToken, toToken, triggerRatio)}
                renderContent={() =>
                  `Limit Order Price to guarantee Min. Receive amount is updated in real time in the Orders tab after the order has been created.`
                }
              />
            </ExchangeInfoRow>
          )}

          <ExchangeInfoRow label={`${fromToken?.symbol} Price`}>
            {formatUsd(swapAmounts?.priceIn, {
              displayDecimals: fromToken?.priceDecimals,
            })}
          </ExchangeInfoRow>

          <ExchangeInfoRow label={`${toToken?.symbol} Price`}>
            {formatUsd(swapAmounts?.priceOut, {
              displayDecimals: toToken?.priceDecimals,
            })}
          </ExchangeInfoRow>

          {!p.isWrapOrUnwrap && (
            <TradeFeesRow
              {...fees}
              isTop
              executionFee={p.executionFee}
              feesType="swap"
            />
          )}

          <ExchangeInfoRow label={`Min. Receive`} isTop>
            {isMarket && swapAmounts?.minOutputAmount
              ? formatTokenAmount(
                  applySlippageToMinOut(
                    allowedSlippage,
                    swapAmounts.minOutputAmount
                  ),
                  toToken?.decimals,
                  toToken?.symbol
                )
              : formatTokenAmount(
                  swapAmounts?.minOutputAmount,
                  toToken?.decimals,
                  toToken?.symbol
                )}
          </ExchangeInfoRow>
        </div>
      </>
    );
  }

  function renderTriggerDecreaseSection() {
    const existingPriceDecimals = p.existingPosition?.indexToken?.priceDecimals;
    const toTokenPriceDecimals = toToken?.priceDecimals;
    return (
      <>
        <div>
          {renderMain()}
          {renderDifferentCollateralWarning()}

          {isTrigger && existingPosition?.leverage && (
            <Checkbox
              asRow
              isChecked={keepLeverage}
              setIsChecked={setKeepLeverage}
            >
              <span className="muted font-sm">
                Keep leverage at {formatLeverage(existingPosition.leverage)}{" "}
              </span>
            </Checkbox>
          )}

          <ExchangeInfoRow
            label={`Trigger Price`}
            value={
              triggerPrice
                ? `${fixedTriggerThresholdType} ${formatUsd(triggerPrice, {
                    displayDecimals: toTokenPriceDecimals,
                  })}`
                : "..."
            }
          />

          <ExchangeInfoRow
            isTop
            label={`Mark Price`}
            value={
              p.markPrice
                ? formatUsd(p.markPrice, {
                    displayDecimals: toTokenPriceDecimals,
                  })
                : "..."
            }
          />

          {existingPosition && (
            <ExchangeInfoRow
              label={`Entry Price`}
              value={
                formatUsd(existingPosition?.entryPrice, {
                  displayDecimals: indexToken?.priceDecimals,
                }) || "-"
              }
            />
          )}

          <ExchangeInfoRow
            label={`Execution Price`}
            value={
              executionPriceUsd
                ? formatUsd(executionPriceUsd, {
                    displayDecimals: indexToken?.priceDecimals,
                  })
                : "-"
            }
          />

          {decreaseAmounts &&
            decreaseAmounts.triggerOrderType !== OrderType.StopLossDecrease && (
              <>
                {renderAcceptablePriceImpactInput()}
                <ExchangeInfoRow
                  className="SwapBox-info-row"
                  label={`Acceptable Price`}
                  value={
                    formatAcceptablePrice(decreaseAmounts?.acceptablePrice, {
                      displayDecimals: toTokenPriceDecimals,
                    }) || "-"
                  }
                />
              </>
            )}

          {p.existingPosition && (
            <ExchangeInfoRow
              label={`Liq. Price`}
              value={
                nextPositionValues?.nextSizeUsd?.gt(0) ? (
                  <ValueTransition
                    from={
                      formatUsd(existingPosition?.liquidationPrice, {
                        displayDecimals: existingPriceDecimals,
                      })!
                    }
                    to={formatUsd(nextPositionValues.nextLiqPrice, {
                      displayDecimals: existingPriceDecimals,
                    })}
                  />
                ) : (
                  "-"
                )
              }
            />
          )}

          <ExchangeInfoRow
            label={p.existingPosition?.sizeInUsd ? `Size` : `Decrease size`}
            isTop
            value={
              p.existingPosition?.sizeInUsd ? (
                <ValueTransition
                  from={formatUsd(p.existingPosition.sizeInUsd)!}
                  to={formatUsd(nextPositionValues?.nextSizeUsd)}
                />
              ) : decreaseAmounts?.sizeDeltaUsd ? (
                formatUsd(decreaseAmounts.sizeDeltaUsd)
              ) : (
                "-"
              )
            }
          />

          {!p.existingPosition && (
            <ExchangeInfoRow
              label={`Collateral`}
              value={collateralToken?.symbol}
            />
          )}

          {p.existingPosition && (
            <ExchangeInfoRow
              label={`Collateral (${p.existingPosition?.collateralToken?.symbol})`}
              value={
                <ValueTransition
                  from={formatUsd(existingPosition?.remainingCollateralUsd)!}
                  to={formatUsd(nextPositionValues?.nextCollateralUsd)}
                />
              }
            />
          )}

          {!p.keepLeverage &&
            p.existingPosition?.leverage &&
            renderLeverage(
              existingPosition?.leverage,
              nextPositionValues?.nextLeverage,
              nextPositionValues?.nextSizeUsd?.lte(0)
            )}
          {existingPosition && (
            <ExchangeInfoRow
              label={`PnL`}
              value={
                <ValueTransition
                  from={
                    <>
                      {formatDeltaUsd(decreaseAmounts?.estimatedPnl)} (
                      {formatPercentage(
                        decreaseAmounts?.estimatedPnlPercentage,
                        { signed: true }
                      )}
                      )
                    </>
                  }
                  to={
                    <>
                      {formatDeltaUsd(nextPositionValues?.nextPnl)} (
                      {formatPercentage(nextPositionValues?.nextPnlPercentage, {
                        signed: true,
                      })}
                      )
                    </>
                  }
                />
              }
            />
          )}

          <TradeFeesRow
            {...fees}
            executionFee={p.executionFee}
            feesType="decrease"
          />

          {existingPosition && decreaseAmounts?.receiveUsd && (
            <ExchangeInfoRow
              label={`Receive`}
              value={formatTokenAmountWithUsd(
                decreaseAmounts.receiveTokenAmount,
                decreaseAmounts.receiveUsd,
                collateralToken?.symbol,
                collateralToken?.decimals
              )}
            />
          )}
        </div>
      </>
    );
  }

  const hasCheckboxesSection = Boolean(
    priceImpactWarningState.shouldShowWarning ||
      (needPayTokenApproval && fromToken)
  );

  return (
    <div className="Confirmation-box">
      <Modal
        isVisible={p.isVisible}
        setIsVisible={onClose}
        label={title}
        allowContentTouchMove
      >
        {isSwap && renderSwapSection()}
        {isIncrease && renderIncreaseOrderSection()}
        {isTrigger && renderTriggerDecreaseSection()}
        {hasCheckboxesSection && <div className="line-divider" />}
        {renderHighPriceImpactWarning()}

        {/* {needPayTokenApproval && fromToken && (
          <>
            <ApproveTokenButton
              tokenAddress={fromToken.address}
              tokenSymbol={fromToken.assetSymbol ?? fromToken.symbol}
              spenderAddress={getContract(chainId, "SyntheticsRouter")}
            />
          </>
        )} */}

        <div className="Confirmation-box-row" ref={submitButtonRef}>
          <Button
            variant="primary-action"
            className={`mt-4 ${
              submitButtonState.disabled && !shouldDisableValidation
                ? "opacity-50"
                : ""
            } w-full bg-main rounded-xl py-3 text-white font-semibold`}
            type="submit"
            onClick={onSubmit}
            disabled={submitButtonState.disabled && !shouldDisableValidation}
          >
            {submitButtonState.text}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
