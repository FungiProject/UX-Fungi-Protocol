import Button from "../../common/Buttons/Button";
import BuyInputSection from "../../common/BuyInputSection/BuyInputSection";
import Checkbox from "../../common/Checkbox/Checkbox";
import ExchangeInfoRow from "../ExchangeInfoRow/ExchangeInfoRow";
import LeverageSlider from "../Slider/LeverageSlider";
import { MarketSelector } from "../Market/MarketSelector";
import { ConfirmationBox } from "../ConfirmationBox/ConfirmationBox";
import Tab from "../../common/Tab/Tab";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import TokenWithIcon from "../../common/TokenIcon/TokenWithIcon";
import TokenSelector from "../../common/TokenSelector/TokenSelector";
import { ValueTransition } from "../ValueTransition/ValueTransition";
import Tooltip from "../../common/Tooltip/Tooltip";
import { MarketCard } from "../Market/MarketCard";
import { SwapCard } from "../SwapCard/SwapCard";
import { TradeFeesRow } from "../TradeInfo/TradeFeesRow";
import { HighPriceImpactWarning } from "../../common/Notifications/HighPriceImpactWarning";
import ExternalLink from "../../common/ExternalLink/ExternalLink";
import { CollateralSelectorRow } from "../CollateralSelector/CollateralSelectorRow";
import { MarketPoolSelectorRow } from "../Market/MarketPoolSelectorRow";

import { BASIS_POINTS_DIVISOR } from "../../../../utils/gmx/config/factors";
import {
  getKeepLeverageKey,
  getLeverageEnabledKey,
  getLeverageKey,
} from "../../../../utils/gmx/config/localStorage";
import { MAX_METAMASK_MOBILE_DECIMALS } from "../../../../utils/gmx/config/ui";
import { useSettings } from "../../../../utils/gmx/context/SettingsContext/SettingsContextProvider";
import { useHasOutdatedUi } from "../../../../utils/gmx/domain/legacy";
import { useUserReferralInfo } from "../../../../utils/gmx/domain/referrals/hooks";
import {
  estimateExecuteDecreaseOrderGasLimit,
  estimateExecuteIncreaseOrderGasLimit,
  estimateExecuteSwapOrderGasLimit,
  getExecutionFee,
  useGasLimits,
  useGasPrice,
} from "../../../../utils/gmx/domain/synthetics/fees";
import {
  MarketInfo,
  MarketsInfoData,
  getAvailableUsdLiquidityForPosition,
  getMarketIndexName,
} from "../../../../utils/gmx/domain/synthetics/markets";
import {
  DecreasePositionSwapType,
  OrderInfo,
  OrderType,
  OrdersInfoData,
} from "../../../../utils/gmx/domain/synthetics/orders";
import {
  PositionInfo,
  PositionsInfoData,
  formatLeverage,
  formatLiquidationPrice,
  getTriggerNameByOrderType,
  usePositionsConstants,
} from "../../../../utils/gmx/domain/synthetics/positions";
import {
  TokenData,
  TokensData,
  TokensRatio,
  convertToUsd,
  getTokensRatioByPrice,
} from "../../../../utils/gmx/domain/synthetics/tokens";
import {
  AvailableTokenOptions,
  SwapAmounts,
  TradeFeesType,
  TradeMode,
  TradeType,
  TriggerThresholdType,
  getDecreasePositionAmounts,
  getExecutionPriceForDecrease,
  getIncreasePositionAmounts,
  getMarkPrice,
  getNextPositionValuesForDecreaseTrade,
  getNextPositionValuesForIncreaseTrade,
  getSwapAmountsByFromValue,
  getSwapAmountsByToValue,
  getTradeFees,
  useSwapRoutes,
} from "../../../../utils/gmx/domain/synthetics/trade";
import { useAvailableMarketsOptions } from "../../../../utils/gmx/domain/synthetics/trade/useAvailableMarketsOptions";
import { usePriceImpactWarningState } from "../../../../utils/gmx/domain/synthetics/trade/usePriceImpactWarningState";
import { TradeFlags } from "../../../../utils/gmx/domain/synthetics/trade/useTradeFlags";
import {
  ValidationResult,
  getCommonError,
  getDecreaseError,
  getIncreaseError,
  getSwapError,
} from "../../../../utils/gmx/domain/synthetics/trade/utils/validation";
import { BigNumber } from "ethers";
import longImg from "../../../../img/long.svg";
import shortImg from "../../../../img/short.svg";
import swapImg from "../../../../img/swap.svg";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import { DUST_BNB, USD_DECIMALS } from "../../../../utils/gmx/lib/legacy";
import { useLocalStorageSerializeKey } from "../../../../utils/gmx/lib/localstorage";
import {
  formatAmount,
  formatAmountFree,
  formatDeltaUsd,
  formatPercentage,
  formatTokenAmount,
  formatTokenAmountWithUsd,
  formatUsd,
  limitDecimals,
  parseValue,
} from "../../../../utils/gmx/lib/numbers";
import { useSafeState } from "../../../../utils/gmx/lib/useSafeState";
import useIsMetamaskMobile from "../../../../utils/gmx/lib/wallets/useIsMetamaskMobile";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useLatest, usePrevious } from "react-use";

import useUiFeeFactor from "../../../../utils/gmx/domain/synthetics/fees/utils/useUiFeeFactor";
import { museNeverExist } from "../../../../utils/gmx/lib/types";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import useWallet from "@/hooks/useWallet";

export type Props = {
  tradeType: TradeType;
  tradeMode: TradeMode;
  availableTradeModes: TradeMode[];
  tradeFlags: TradeFlags;
  isWrapOrUnwrap: boolean;
  fromTokenAddress?: string;
  fromToken?: TokenData;
  toTokenAddress?: string;
  toToken?: TokenData;
  marketAddress?: string;
  marketInfo?: MarketInfo;
  collateralAddress?: string;
  collateralToken?: TokenData;
  avaialbleTokenOptions: AvailableTokenOptions;
  existingPosition?: PositionInfo;
  existingOrder?: OrderInfo;
  positionsInfo?: PositionsInfoData;
  ordersInfo?: OrdersInfoData;
  allowedSlippage: number;
  savedIsPnlInLeverage: boolean;
  isHigherSlippageAllowed: boolean;
  shouldDisableValidation?: boolean;
  marketsInfoData?: MarketsInfoData;
  tokensData?: TokensData;
  setIsHigherSlippageAllowed: (value: boolean) => void;
  onSelectFromTokenAddress: (fromTokenAddress?: string) => void;
  onSelectToTokenAddress: (toTokenAddress?: string) => void;
  onSelectTradeType: (tradeType: TradeType) => void;
  onSelectTradeMode: (tradeMode: TradeMode) => void;
  setPendingTxns: (txns: any) => void;
  onSelectMarketAddress: (marketAddress?: string) => void;
  onSelectCollateralAddress: (collateralAddress?: string) => void;
  switchTokenAddresses: () => void;
};

const tradeTypeIcons = {
  [TradeType.Long]: longImg.src,
  [TradeType.Short]: shortImg.src,
  [TradeType.Swap]: swapImg.src,
};

export function TradeBox(p: Props) {
  const {
    tradeMode,
    tradeType,
    tradeFlags,
    availableTradeModes,
    isWrapOrUnwrap,
    tokensData,
    fromTokenAddress,
    fromToken,
    toTokenAddress,
    toToken,
    marketAddress,
    marketInfo,
    collateralAddress,
    collateralToken,
    avaialbleTokenOptions,
    savedIsPnlInLeverage,
    positionsInfo,
    existingPosition,
    existingOrder,
    ordersInfo,
    shouldDisableValidation,
    allowedSlippage,
    isHigherSlippageAllowed,
    marketsInfoData,
    setIsHigherSlippageAllowed,
    onSelectMarketAddress,
    onSelectCollateralAddress,
    onSelectFromTokenAddress,
    onSelectToTokenAddress,
    onSelectTradeMode,
    onSelectTradeType,
    setPendingTxns,
    switchTokenAddresses,
  } = p;
  const {
    isLong,
    isSwap,
    isIncrease,
    isPosition,
    isLimit,
    isTrigger,
    isMarket,
  } = tradeFlags;
  const { login, scAccount } = useWallet();
  const {
    swapTokens,
    indexTokens,
    infoTokens,
    sortedIndexTokensWithPoolValue,
    sortedLongAndShortTokens,
    sortedAllMarkets,
  } = avaialbleTokenOptions;

  const tradeTypeLabels = useMemo(() => {
    return {
      [TradeType.Long]: `Long`,
      [TradeType.Short]: `Short`,
      [TradeType.Swap]: `Swap`,
    };
  }, []);

  const tradeModeLabels = {
    [TradeMode.Market]: `Market`,
    [TradeMode.Limit]: `Limit`,
    [TradeMode.Trigger]: `TP/SL`,
  };

  const { chainId } = useChainId();
  const isMetamaskMobile = useIsMetamaskMobile();
  const { gasPrice } = useGasPrice(chainId);
  const { gasLimits } = useGasLimits(chainId);
  const userReferralInfo = useUserReferralInfo(chainId, scAccount);

  const { showDebugValues, savedAcceptablePriceImpactBuffer } = useSettings();
  const { data: hasOutdatedUi } = useHasOutdatedUi();
  const { minCollateralUsd, minPositionSizeUsd } =
    usePositionsConstants(chainId);
  const uiFeeFactor = useUiFeeFactor(chainId);
  const [stage, setStage] = useState<"trade" | "confirmation" | "processing">(
    "trade"
  );
  const [focusedInput, setFocusedInput] = useState<"from" | "to">();

  const [fixedTriggerThresholdType, setFixedTriggerThresholdType] =
    useState<TriggerThresholdType>();
  const [fixedTriggerOrderType, setFixedTriggerOrderType] = useState<
    OrderType.LimitDecrease | OrderType.StopLossDecrease
  >();

  const [
    defaultTriggerAcceptablePriceImpactBps,
    setDefaultTriggerAcceptablePriceImapctBps,
  ] = useState<BigNumber>();
  const [
    selectedTriggerAcceptablePriceImpactBps,
    setSelectedAcceptablePriceImapctBps,
  ] = useState<BigNumber>();

  const [fromTokenInputValue, setFromTokenInputValueRaw] = useSafeState("");
  const [toTokenInputValue, setToTokenInputValueRaw] = useSafeState("");

  const fromTokenAmount = fromToken
    ? parseValue(fromTokenInputValue || "0", fromToken.decimals)!
    : BigNumber.from(0);
  const fromTokenPrice = fromToken?.prices.minPrice;
  const fromUsd = convertToUsd(
    fromTokenAmount,
    fromToken?.decimals,
    fromTokenPrice
  );
  const isNotMatchAvailableBalance =
    fromToken?.balance?.gt(0) && !fromToken.balance.eq(fromTokenAmount);

  const toTokenAmount = toToken
    ? parseValue(toTokenInputValue || "0", toToken.decimals)!
    : BigNumber.from(0);

  const markPrice = useMemo(() => {
    if (!toToken) {
      return undefined;
    }

    if (isSwap) {
      return toToken.prices.minPrice;
    }

    return getMarkPrice({ prices: toToken.prices, isIncrease, isLong });
  }, [isIncrease, isLong, isSwap, toToken]);

  const [closeSizeInputValue, setCloseSizeInputValue] = useState("");
  const closeSizeUsd = parseValue(closeSizeInputValue || "0", USD_DECIMALS)!;

  const [triggerPriceInputValue, setTriggerPriceInputValue] =
    useState<string>("");
  const triggerPrice = parseValue(triggerPriceInputValue, USD_DECIMALS);

  const [triggerRatioInputValue, setTriggerRatioInputValue] =
    useState<string>("");
  const { markRatio, triggerRatio } = useMemo(() => {
    if (!isSwap || !fromToken || !toToken || !fromTokenPrice || !markPrice) {
      return {};
    }

    const markRatio = getTokensRatioByPrice({
      fromToken,
      toToken,
      fromPrice: fromTokenPrice,
      toPrice: markPrice,
    });

    const triggerRatioValue = parseValue(triggerRatioInputValue, USD_DECIMALS);

    if (!triggerRatioValue) {
      return { markRatio };
    }

    const triggerRatio: TokensRatio = {
      ratio: triggerRatioValue?.gt(0) ? triggerRatioValue : markRatio.ratio,
      largestToken: markRatio.largestToken,
      smallestToken: markRatio.smallestToken,
    };

    return {
      markRatio,
      triggerRatio,
    };
  }, [
    fromToken,
    fromTokenPrice,
    isSwap,
    markPrice,
    toToken,
    triggerRatioInputValue,
  ]);

  const [leverageOption, setLeverageOption] = useLocalStorageSerializeKey(
    getLeverageKey(chainId),
    2
  );
  const leverage = BigNumber.from(
    parseInt(String(Number(leverageOption!) * BASIS_POINTS_DIVISOR))
  );

  const [isLeverageEnabled, setIsLeverageEnabled] = useLocalStorageSerializeKey(
    getLeverageEnabledKey(chainId),
    true
  );
  const [keepLeverage, setKeepLeverage] = useLocalStorageSerializeKey(
    getKeepLeverageKey(chainId),
    true
  );

  const swapRoute = useSwapRoutes({
    marketsInfoData,
    fromTokenAddress,
    toTokenAddress: isPosition ? collateralAddress : toTokenAddress,
  });

  const swapAmounts = useMemo(() => {
    if (!isSwap || !fromToken || !toToken || !fromTokenPrice) {
      return undefined;
    }

    if (isWrapOrUnwrap) {
      const tokenAmount =
        focusedInput === "from" ? fromTokenAmount : toTokenAmount;
      const usdAmount = convertToUsd(
        tokenAmount,
        fromToken.decimals,
        fromTokenPrice
      )!;
      const price = fromTokenPrice;

      const swapAmounts: SwapAmounts = {
        amountIn: tokenAmount,
        usdIn: usdAmount!,
        amountOut: tokenAmount,
        usdOut: usdAmount!,
        swapPathStats: undefined,
        priceIn: price,
        priceOut: price,
        minOutputAmount: tokenAmount,
      };

      return swapAmounts;
    } else if (focusedInput === "from") {
      return getSwapAmountsByFromValue({
        tokenIn: fromToken,
        tokenOut: toToken,
        amountIn: fromTokenAmount,
        triggerRatio: triggerRatio || markRatio,
        isLimit,
        findSwapPath: swapRoute.findSwapPath,
        uiFeeFactor,
      });
    } else {
      return getSwapAmountsByToValue({
        tokenIn: fromToken,
        tokenOut: toToken,
        amountOut: toTokenAmount,
        triggerRatio: triggerRatio || markRatio,
        isLimit,
        findSwapPath: swapRoute.findSwapPath,
        uiFeeFactor,
      });
    }
  }, [
    focusedInput,
    fromToken,
    fromTokenAmount,
    fromTokenPrice,
    isLimit,
    isSwap,
    isWrapOrUnwrap,
    markRatio,
    swapRoute.findSwapPath,
    toToken,
    toTokenAmount,
    triggerRatio,
    uiFeeFactor,
  ]);

  const increaseAmounts = useMemo(() => {
    if (
      !isIncrease ||
      !toToken ||
      !fromToken ||
      !collateralToken ||
      !marketInfo
    ) {
      return undefined;
    }

    return getIncreasePositionAmounts({
      marketInfo,
      indexToken: toToken,
      initialCollateralToken: fromToken,
      collateralToken,
      isLong,
      initialCollateralAmount: fromTokenAmount,
      indexTokenAmount: toTokenAmount,
      leverage,
      triggerPrice: isLimit ? triggerPrice : undefined,
      position: existingPosition,
      fixedAcceptablePriceImpactBps: selectedTriggerAcceptablePriceImpactBps,
      acceptablePriceImpactBuffer: savedAcceptablePriceImpactBuffer,
      findSwapPath: swapRoute.findSwapPath,
      userReferralInfo,
      uiFeeFactor,
      strategy: isLeverageEnabled
        ? focusedInput === "from"
          ? "leverageByCollateral"
          : "leverageBySize"
        : "independent",
    });
  }, [
    collateralToken,
    existingPosition,
    selectedTriggerAcceptablePriceImpactBps,
    focusedInput,
    fromToken,
    fromTokenAmount,
    isIncrease,
    isLeverageEnabled,
    isLimit,
    isLong,
    leverage,
    marketInfo,
    savedAcceptablePriceImpactBuffer,
    swapRoute.findSwapPath,
    toToken,
    toTokenAmount,
    triggerPrice,
    userReferralInfo,
    uiFeeFactor,
  ]);

  const decreaseAmounts = useMemo(() => {
    if (
      !isTrigger ||
      !closeSizeUsd ||
      !marketInfo ||
      !collateralToken ||
      !minCollateralUsd ||
      !minPositionSizeUsd
    ) {
      return undefined;
    }

    return getDecreasePositionAmounts({
      marketInfo,
      collateralToken,
      isLong,
      position: existingPosition,
      closeSizeUsd: closeSizeUsd,
      keepLeverage: keepLeverage!,
      triggerPrice,
      fixedAcceptablePriceImpactBps: selectedTriggerAcceptablePriceImpactBps,
      acceptablePriceImpactBuffer: savedAcceptablePriceImpactBuffer,
      userReferralInfo,
      minCollateralUsd,
      minPositionSizeUsd,
      uiFeeFactor,
    });
  }, [
    isTrigger,
    closeSizeUsd,
    marketInfo,
    collateralToken,
    minCollateralUsd,
    minPositionSizeUsd,
    isLong,
    existingPosition,
    keepLeverage,
    triggerPrice,
    selectedTriggerAcceptablePriceImpactBps,
    savedAcceptablePriceImpactBuffer,
    userReferralInfo,
    uiFeeFactor,
  ]);

  const nextPositionValues = useMemo(() => {
    if (!isPosition || !minCollateralUsd || !marketInfo || !collateralToken) {
      return undefined;
    }

    if (
      isIncrease &&
      increaseAmounts?.acceptablePrice &&
      fromTokenAmount.gt(0)
    ) {
      return getNextPositionValuesForIncreaseTrade({
        marketInfo,
        collateralToken,
        existingPosition,
        isLong,
        collateralDeltaUsd: increaseAmounts.collateralDeltaUsd,
        collateralDeltaAmount: increaseAmounts.collateralDeltaAmount,
        sizeDeltaUsd: increaseAmounts.sizeDeltaUsd,
        sizeDeltaInTokens: increaseAmounts.sizeDeltaInTokens,
        indexPrice: increaseAmounts.indexPrice,
        showPnlInLeverage: savedIsPnlInLeverage,
        minCollateralUsd,
        userReferralInfo,
      });
    }

    if (isTrigger && decreaseAmounts?.acceptablePrice && closeSizeUsd.gt(0)) {
      return getNextPositionValuesForDecreaseTrade({
        existingPosition,
        marketInfo,
        collateralToken,
        sizeDeltaUsd: decreaseAmounts.sizeDeltaUsd,
        sizeDeltaInTokens: decreaseAmounts.sizeDeltaInTokens,
        estimatedPnl: decreaseAmounts.estimatedPnl,
        realizedPnl: decreaseAmounts.realizedPnl,
        collateralDeltaUsd: decreaseAmounts.collateralDeltaUsd,
        collateralDeltaAmount: decreaseAmounts.collateralDeltaAmount,
        payedRemainingCollateralUsd:
          decreaseAmounts.payedRemainingCollateralUsd,
        payedRemainingCollateralAmount:
          decreaseAmounts.payedRemainingCollateralAmount,
        showPnlInLeverage: savedIsPnlInLeverage,
        isLong,
        minCollateralUsd,
        userReferralInfo,
      });
    }
  }, [
    closeSizeUsd,
    collateralToken,
    decreaseAmounts,
    existingPosition,
    fromTokenAmount,
    increaseAmounts,
    isIncrease,
    isLong,
    isPosition,
    isTrigger,
    marketInfo,
    minCollateralUsd,
    savedIsPnlInLeverage,
    userReferralInfo,
  ]);

  const { fees, feesType, executionFee } = useMemo(() => {
    if (!gasLimits || !gasPrice || !tokensData) {
      return {};
    }

    if (isSwap && swapAmounts?.swapPathStats) {
      const estimatedGas = estimateExecuteSwapOrderGasLimit(gasLimits, {
        swapsCount: swapAmounts.swapPathStats.swapPath.length,
      });

      return {
        fees: getTradeFees({
          isIncrease: false,
          initialCollateralUsd: swapAmounts.usdIn,
          sizeDeltaUsd: BigNumber.from(0),
          swapSteps: swapAmounts.swapPathStats.swapSteps,
          positionFeeUsd: BigNumber.from(0),
          swapPriceImpactDeltaUsd:
            swapAmounts.swapPathStats.totalSwapPriceImpactDeltaUsd,
          positionPriceImpactDeltaUsd: BigNumber.from(0),
          borrowingFeeUsd: BigNumber.from(0),
          fundingFeeUsd: BigNumber.from(0),
          feeDiscountUsd: BigNumber.from(0),
          swapProfitFeeUsd: BigNumber.from(0),
          uiFeeFactor,
        }),
        executionFee: getExecutionFee(
          chainId,
          gasLimits,
          tokensData,
          estimatedGas,
          gasPrice
        ),
        feesType: "swap" as TradeFeesType,
      };
    }

    if (isIncrease && increaseAmounts) {
      const estimatedGas = estimateExecuteIncreaseOrderGasLimit(gasLimits, {
        swapsCount: increaseAmounts.swapPathStats?.swapPath.length,
      });

      return {
        fees: getTradeFees({
          isIncrease: true,
          initialCollateralUsd: increaseAmounts.initialCollateralUsd,
          sizeDeltaUsd: increaseAmounts.sizeDeltaUsd,
          swapSteps: increaseAmounts.swapPathStats?.swapSteps || [],
          positionFeeUsd: increaseAmounts.positionFeeUsd,
          swapPriceImpactDeltaUsd:
            increaseAmounts.swapPathStats?.totalSwapPriceImpactDeltaUsd ||
            BigNumber.from(0),
          positionPriceImpactDeltaUsd:
            increaseAmounts.positionPriceImpactDeltaUsd,
          borrowingFeeUsd:
            existingPosition?.pendingBorrowingFeesUsd || BigNumber.from(0),
          fundingFeeUsd:
            existingPosition?.pendingFundingFeesUsd || BigNumber.from(0),
          feeDiscountUsd: increaseAmounts.feeDiscountUsd,
          swapProfitFeeUsd: BigNumber.from(0),
          uiFeeFactor,
        }),
        executionFee: getExecutionFee(
          chainId,
          gasLimits,
          tokensData,
          estimatedGas,
          gasPrice
        ),
        feesType: "increase" as TradeFeesType,
      };
    }

    if (isTrigger && decreaseAmounts) {
      const swapsCount =
        decreaseAmounts.decreaseSwapType === DecreasePositionSwapType.NoSwap
          ? 0
          : 1;
      const estimatedGas = estimateExecuteDecreaseOrderGasLimit(gasLimits, {
        swapsCount,
      });

      return {
        fees: getTradeFees({
          isIncrease: false,
          initialCollateralUsd:
            existingPosition?.collateralUsd || BigNumber.from(0),
          sizeDeltaUsd: decreaseAmounts.sizeDeltaUsd,
          swapSteps: [],
          positionFeeUsd: decreaseAmounts.positionFeeUsd,
          swapPriceImpactDeltaUsd: BigNumber.from(0),
          positionPriceImpactDeltaUsd:
            decreaseAmounts.positionPriceImpactDeltaUsd,
          borrowingFeeUsd: decreaseAmounts.borrowingFeeUsd,
          fundingFeeUsd: decreaseAmounts.fundingFeeUsd,
          feeDiscountUsd: decreaseAmounts.feeDiscountUsd,
          swapProfitFeeUsd: decreaseAmounts.swapProfitFeeUsd,
          uiFeeFactor,
        }),
        executionFee: getExecutionFee(
          chainId,
          gasLimits,
          tokensData,
          estimatedGas,
          gasPrice
        ),
        feesType: "decrease" as TradeFeesType,
      };
    }

    return {};
  }, [
    chainId,
    decreaseAmounts,
    existingPosition,
    gasLimits,
    gasPrice,
    increaseAmounts,
    isIncrease,
    isSwap,
    isTrigger,
    swapAmounts,
    tokensData,
    uiFeeFactor,
  ]);

  const priceImpactWarningState = usePriceImpactWarningState({
    positionPriceImpact: fees?.positionPriceImpact,
    swapPriceImpact: fees?.swapPriceImpact,
    tradeFlags,
    place: "tradeBox",
  });

  const setIsHighPositionImpactAcceptedRef = useLatest(
    priceImpactWarningState.setIsHighPositionImpactAccepted
  );
  const setIsHighSwapImpactAcceptedRef = useLatest(
    priceImpactWarningState.setIsHighSwapImpactAccepted
  );

  const setFromTokenInputValue = useCallback(
    (value: string, shouldResetPriceImpactWarning: boolean) => {
      setFromTokenInputValueRaw(value);
      if (shouldResetPriceImpactWarning) {
        setIsHighPositionImpactAcceptedRef.current(false);
        setIsHighSwapImpactAcceptedRef.current(false);
      }
    },
    [
      setFromTokenInputValueRaw,
      setIsHighPositionImpactAcceptedRef,
      setIsHighSwapImpactAcceptedRef,
    ]
  );
  const setToTokenInputValue = useCallback(
    (value: string, shouldResetPriceImpactWarning: boolean) => {
      setToTokenInputValueRaw(value);
      if (shouldResetPriceImpactWarning) {
        setIsHighPositionImpactAcceptedRef.current(false);
        setIsHighSwapImpactAcceptedRef.current(false);
      }
    },
    [
      setToTokenInputValueRaw,
      setIsHighPositionImpactAcceptedRef,
      setIsHighSwapImpactAcceptedRef,
    ]
  );

  const marketsOptions = useAvailableMarketsOptions({
    marketsInfoData,
    isIncrease,
    disable: !isPosition,
    indexToken: toToken,
    isLong,
    increaseSizeUsd: increaseAmounts?.sizeDeltaUsd,
    positionsInfo,
    ordersInfo,
    hasExistingOrder: Boolean(existingOrder),
    hasExistingPosition: Boolean(existingPosition),
  });
  const { availableMarkets } = marketsOptions;

  const availableCollaterals = useMemo(() => {
    if (!marketInfo) {
      return [];
    }

    if (marketInfo.isSameCollaterals) {
      return [marketInfo.longToken];
    }

    return [marketInfo.longToken, marketInfo.shortToken];
  }, [marketInfo]);

  const swapOutLiquidity = swapRoute.maxSwapLiquidity;

  const { longLiquidity, shortLiquidity, isOutPositionLiquidity } =
    useMemo(() => {
      if (!marketInfo || !isIncrease) {
        return {};
      }
      const longLiquidity = getAvailableUsdLiquidityForPosition(
        marketInfo,
        true
      );
      const shortLiquidity = getAvailableUsdLiquidityForPosition(
        marketInfo,
        false
      );

      const isOutPositionLiquidity = isLong
        ? longLiquidity.lt(increaseAmounts?.sizeDeltaUsd || 0)
        : shortLiquidity.lt(increaseAmounts?.sizeDeltaUsd || 0);

      return {
        longLiquidity,
        shortLiquidity,
        isOutPositionLiquidity,
      };
    }, [increaseAmounts, isIncrease, isLong, marketInfo]);

  const { buttonErrorText, tooltipContent } = useMemo(() => {
    const commonError = getCommonError({
      chainId,
      isConnected: Boolean(scAccount),
      hasOutdatedUi,
    });

    let tradeError: ValidationResult = [undefined];

    if (isSwap) {
      tradeError = getSwapError({
        fromToken,
        toToken,
        fromTokenAmount,
        fromUsd: swapAmounts?.usdIn,
        toTokenAmount,
        toUsd: swapAmounts?.usdOut,
        swapPathStats: swapAmounts?.swapPathStats,
        swapLiquidity: swapOutLiquidity,
        priceImpactWarning: priceImpactWarningState,
        isLimit,
        isWrapOrUnwrap,
        triggerRatio,
        markRatio,
        fees,
      });
    } else if (isIncrease) {
      tradeError = getIncreaseError({
        marketInfo,
        indexToken: toToken,
        initialCollateralToken: fromToken,
        initialCollateralAmount: fromTokenAmount,
        initialCollateralUsd: increaseAmounts?.initialCollateralUsd,
        targetCollateralToken: collateralToken,
        collateralUsd: increaseAmounts?.collateralDeltaUsd,
        sizeDeltaUsd: increaseAmounts?.sizeDeltaUsd,
        existingPosition,
        fees,
        swapPathStats: increaseAmounts?.swapPathStats,
        collateralLiquidity: swapOutLiquidity,
        minCollateralUsd,
        longLiquidity,
        shortLiquidity,
        isLong,
        markPrice,
        triggerPrice,
        priceImpactWarning: priceImpactWarningState,
        isLimit,
        nextPositionValues,
      });
    } else if (isTrigger) {
      tradeError = getDecreaseError({
        marketInfo,
        inputSizeUsd: closeSizeUsd,
        sizeDeltaUsd: decreaseAmounts?.sizeDeltaUsd,
        triggerPrice,
        markPrice,
        existingPosition,
        isContractAccount: false,
        receiveToken: existingPosition?.collateralToken,
        nextPositionValues,
        isLong,
        isTrigger: true,
        minCollateralUsd,
        priceImpactWarning: priceImpactWarningState,
        isNotEnoughReceiveTokenLiquidity: false,
        fixedTriggerThresholdType:
          stage === "confirmation" ? fixedTriggerThresholdType : undefined,
      });
    }

    const buttonErrorText = commonError[0] || tradeError[0];
    const tooltipName = commonError[1] || tradeError[1];

    let tooltipContent: ReactNode = null;
    if (tooltipName) {
      switch (tooltipName) {
        case "maxLeverage":
          tooltipContent = (
            <>
              <span>
                Decrease the Leverage by using the slider. If the Leverage
                slider is disabled, you can increase the Pay amount or reduce
                the Order size.
              </span>
              <br />
              <br />
              <ExternalLink href="https://docs.gmx.io/docs/trading/v2/#max-leverage">
                More Info
              </ExternalLink>
              .
            </>
          );
          break;

        default:
          museNeverExist(tooltipName);
      }
    }

    return { buttonErrorText, tooltipContent };
  }, [
    chainId,
    scAccount,
    hasOutdatedUi,
    isSwap,
    isIncrease,
    isTrigger,
    fromToken,
    toToken,
    fromTokenAmount,
    swapAmounts?.usdIn,
    swapAmounts?.usdOut,
    swapAmounts?.swapPathStats,
    toTokenAmount,
    swapOutLiquidity,
    isLimit,
    isWrapOrUnwrap,
    triggerRatio,
    markRatio,
    fees,
    marketInfo,
    increaseAmounts?.initialCollateralUsd,
    increaseAmounts?.collateralDeltaUsd,
    increaseAmounts?.sizeDeltaUsd,
    increaseAmounts?.swapPathStats,
    collateralToken,
    existingPosition,
    minCollateralUsd,
    longLiquidity,
    shortLiquidity,
    isLong,
    markPrice,
    triggerPrice,
    priceImpactWarningState,
    nextPositionValues,
    closeSizeUsd,
    decreaseAmounts?.sizeDeltaUsd,
    stage,
    fixedTriggerThresholdType,
  ]);

  const isSubmitButtonDisabled = useMemo(() => {
    if (!scAccount) {
      return false;
    }
    if (buttonErrorText) {
      return true;
    }
  }, [buttonErrorText, scAccount]);

  const submitButtonText = useMemo(() => {
    if (buttonErrorText) {
      return buttonErrorText;
    }

    if (isMarket) {
      if (isSwap) {
        return `Swap ${fromToken?.symbol}`;
      } else {
        return `${tradeTypeLabels[tradeType!]} ${toToken?.symbol}`;
      }
    } else if (isLimit) {
      return `Create Limit order`;
    } else {
      return `Create ${getTriggerNameByOrderType(
        decreaseAmounts?.triggerOrderType
      )} Order`;
    }
  }, [
    decreaseAmounts?.triggerOrderType,
    buttonErrorText,
    fromToken?.symbol,
    isLimit,
    isMarket,
    isSwap,
    toToken?.symbol,
    tradeType,
    tradeTypeLabels,
  ]);

  function onSubmit() {
    if (!scAccount) {
      login?.();
      return;
    }

    if (
      isTrigger &&
      decreaseAmounts?.triggerThresholdType &&
      decreaseAmounts?.triggerOrderType &&
      decreaseAmounts.acceptablePrice
    ) {
      setFixedTriggerOrderType(decreaseAmounts.triggerOrderType);
      setFixedTriggerThresholdType(decreaseAmounts.triggerThresholdType);
      setSelectedAcceptablePriceImapctBps(
        decreaseAmounts.recommendedAcceptablePriceDeltaBps.abs()
      );
      setDefaultTriggerAcceptablePriceImapctBps(
        decreaseAmounts.recommendedAcceptablePriceDeltaBps.abs()
      );
    }

    if (isLimit && increaseAmounts?.acceptablePrice) {
      setSelectedAcceptablePriceImapctBps(
        increaseAmounts.acceptablePriceDeltaBps.abs()
      );
      setDefaultTriggerAcceptablePriceImapctBps(
        increaseAmounts.acceptablePriceDeltaBps.abs()
      );
    }

    setStage("confirmation");
  }

  const prevIsISwap = usePrevious(isSwap);

  useEffect(
    function updateInputAmounts() {
      if (!fromToken || !toToken || (!isSwap && !isIncrease)) {
        return;
      }

      // reset input values when switching between swap and position tabs
      if (isSwap !== prevIsISwap) {
        setFocusedInput("from");
        setFromTokenInputValue("", true);
        return;
      }

      if (isSwap && swapAmounts) {
        if (focusedInput === "from") {
          setToTokenInputValue(
            swapAmounts.amountOut.gt(0)
              ? formatAmountFree(swapAmounts.amountOut, toToken.decimals)
              : "",
            false
          );
        } else {
          setFromTokenInputValue(
            swapAmounts.amountIn.gt(0)
              ? formatAmountFree(swapAmounts.amountIn, fromToken.decimals)
              : "",
            false
          );
        }
      }

      if (isIncrease && increaseAmounts) {
        if (focusedInput === "from") {
          setToTokenInputValue(
            increaseAmounts.indexTokenAmount?.gt(0)
              ? formatAmountFree(
                  increaseAmounts.indexTokenAmount,
                  toToken.decimals
                )
              : "",
            false
          );
        } else {
          setFromTokenInputValue(
            increaseAmounts.initialCollateralAmount.gt(0)
              ? formatAmountFree(
                  increaseAmounts.initialCollateralAmount,
                  fromToken.decimals
                )
              : "",
            false
          );
        }
      }
    },
    [
      focusedInput,
      fromToken,
      increaseAmounts,
      isIncrease,
      isSwap,
      prevIsISwap,
      setFromTokenInputValue,
      setToTokenInputValue,
      swapAmounts,
      toToken,
    ]
  );

  useEffect(
    function updatePositionMarket() {
      if (!isPosition || !marketsOptions.availableMarkets) {
        return;
      }

      const needUpdateMarket =
        !marketAddress ||
        !marketsOptions.availableMarkets.find(
          (m) => m.marketTokenAddress === marketAddress
        );

      if (needUpdateMarket && marketsOptions.marketWithPosition) {
        onSelectMarketAddress(
          marketsOptions.marketWithPosition.marketTokenAddress
        );
        return;
      }

      const optimalMarket =
        marketsOptions.minPriceImpactMarket ||
        marketsOptions.maxLiquidityMarket ||
        marketsOptions.availableMarkets[0];

      if (needUpdateMarket && optimalMarket) {
        onSelectMarketAddress(optimalMarket.marketTokenAddress);
        return;
      }
    },
    [
      availableMarkets,
      chainId,
      isLong,
      isPosition,
      marketAddress,
      marketsOptions.availableMarkets,
      marketsOptions.collateralWithPosition,
      marketsOptions.marketWithPosition,
      marketsOptions.maxLiquidityMarket,
      marketsOptions.minPriceImpactMarket,
      onSelectCollateralAddress,
      onSelectMarketAddress,
    ]
  );

  const prevMarketAddress = usePrevious(marketAddress);
  useEffect(
    function updatePositionCollateral() {
      if (!isPosition) {
        return;
      }

      if (
        marketAddress &&
        prevMarketAddress !== marketAddress &&
        marketsOptions.collateralWithPosition
      ) {
        onSelectCollateralAddress(
          marketsOptions.collateralWithPosition.address
        );
      }
    },
    [
      isPosition,
      marketAddress,
      marketsOptions.collateralWithPosition,
      onSelectCollateralAddress,
      prevMarketAddress,
    ]
  );

  useEffect(
    function resetTriggerPrice() {
      setTriggerPriceInputValue("");
    },
    [toTokenAddress, tradeMode]
  );

  function onSwitchTokens() {
    setFocusedInput((old) => (old === "from" ? "to" : "from"));
    switchTokenAddresses();
    setFromTokenInputValue(toTokenInputValue || "", true);
    setToTokenInputValue(fromTokenInputValue || "", true);
  }

  const onConfirmationClose = useCallback(() => {
    setSelectedAcceptablePriceImapctBps(undefined);
    setDefaultTriggerAcceptablePriceImapctBps(undefined);
    setFixedTriggerOrderType(undefined);
    setFixedTriggerThresholdType(undefined);
    setStage("trade");
  }, []);

  const onConfirmed = useCallback(() => {
    if (isMarket) {
      setStage("processing");
      return;
    }
    setStage("trade");
  }, [isMarket]);

  if (showDebugValues) {
    const swapPathStats =
      swapAmounts?.swapPathStats || increaseAmounts?.swapPathStats;

    if (swapPathStats) {
      // eslint-disable-next-line no-console
      console.log("Swap Path", {
        path: swapPathStats.swapPath
          .map((marketAddress) => marketsInfoData?.[marketAddress]?.name)
          .join(" -> "),
        priceImpact: swapPathStats.swapSteps
          .map((step) => formatDeltaUsd(step.priceImpactDeltaUsd))
          .join(" -> "),
        usdOut: swapPathStats.swapSteps
          .map((step) => formatUsd(step.usdOut))
          .join(" -> "),
      });
    }
  }

  function onMaxClick() {
    if (fromToken?.balance) {
      const maxAvailableAmount = fromToken.isNative
        ? fromToken.balance.sub(BigNumber.from(DUST_BNB).mul(2))
        : fromToken.balance;
      setFocusedInput("from");
      const formattedAmount = formatAmountFree(
        maxAvailableAmount,
        fromToken.decimals
      );
      const finalAmount = isMetamaskMobile
        ? limitDecimals(formattedAmount, MAX_METAMASK_MOBILE_DECIMALS)
        : formattedAmount;
      setFromTokenInputValue(finalAmount, true);
    }
  }

  function renderTokenInputs() {
    return (
      <div className="relative">
        <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px] mb-[24px]">
          <BuyInputSection
            topLeftLabel={`Pay`}
            topLeftValue={
              fromUsd?.gt(0)
                ? formatUsd(
                    isIncrease ? increaseAmounts?.initialCollateralUsd : fromUsd
                  )
                : ""
            }
            topRightLabel={`Balance`}
            topRightValue={formatTokenAmount(
              fromToken?.balance,
              fromToken?.decimals,
              "",
              {
                useCommas: true,
              }
            )}
            onClickTopRightLabel={onMaxClick}
            inputValue={fromTokenInputValue}
            onInputValueChange={(e) => {
              setFocusedInput("from");
              setFromTokenInputValue(e.target.value, true);
            }}
            showMaxButton={isNotMatchAvailableBalance}
            onClickMax={onMaxClick}
          >
            {" "}
            {fromTokenAddress && (
              <TokenSelector
                label={`Pay`}
                chainId={chainId}
                tokenAddress={fromTokenAddress}
                onSelectToken={(token) =>
                  onSelectFromTokenAddress(token.address)
                }
                height="h-[400px]"
                tokens={swapTokens}
                infoTokens={infoTokens}
                className="GlpSwap-from-token"
                showSymbolImage={true}
                showTokenImgInDropdown={true}
                extendedSortSequence={sortedLongAndShortTokens}
              />
            )}
          </BuyInputSection>
        </div>

        <div
          className="flex items-center justify-center arrows-swapper-token rounded-xl absolute inset-0 top-[38%] bg-white"
          onClick={onSwitchTokens}
        >
          <ArrowsUpDownIcon className="h-7 w-7" />
        </div>

        {isSwap && (
          <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px]">
            <BuyInputSection
              topLeftLabel={`Receive`}
              topLeftValue={
                swapAmounts?.usdOut.gt(0) ? formatUsd(swapAmounts?.usdOut) : ""
              }
              topRightLabel={`Balance`}
              topRightValue={formatTokenAmount(
                toToken?.balance,
                toToken?.decimals,
                "",
                {
                  useCommas: true,
                }
              )}
              inputValue={toTokenInputValue}
              onInputValueChange={(e) => {
                setFocusedInput("to");
                setToTokenInputValue(e.target.value, true);
              }}
              showMaxButton={false}
              preventFocusOnLabelClick="right"
            >
              {toTokenAddress && (
                <TokenSelector
                  label={`Receive`}
                  chainId={chainId}
                  tokenAddress={toTokenAddress}
                  onSelectToken={(token) =>
                    onSelectToTokenAddress(token.address)
                  }
                  height="h-[400px]"
                  tokens={swapTokens}
                  infoTokens={infoTokens}
                  className="GlpSwap-from-token"
                  showSymbolImage={true}
                  showBalances={true}
                  showTokenImgInDropdown={true}
                  extendedSortSequence={sortedLongAndShortTokens}
                />
              )}
            </BuyInputSection>{" "}
          </div>
        )}

        {isIncrease && (
          <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px]">
            <BuyInputSection
              topLeftLabel={tradeTypeLabels[tradeType!]}
              topLeftValue={
                increaseAmounts?.sizeDeltaUsd.gt(0)
                  ? formatUsd(increaseAmounts?.sizeDeltaUsd, {
                      fallbackToZero: true,
                    })
                  : ""
              }
              topRightLabel={`Leverage`}
              topRightValue={
                formatLeverage(
                  isLeverageEnabled
                    ? leverage
                    : increaseAmounts?.estimatedLeverage
                ) || "-"
              }
              inputValue={toTokenInputValue}
              onInputValueChange={(e) => {
                setFocusedInput("to");
                setToTokenInputValue(e.target.value, true);
              }}
              showMaxButton={false}
            >
              {toTokenAddress && (
                <TokenSelector
                  label={tradeTypeLabels[tradeType!]}
                  chainId={chainId}
                  tokenAddress={toTokenAddress}
                  onSelectToken={(token) =>
                    onSelectToTokenAddress(token.address)
                  }
                  height="h-[400px]"
                  tokens={indexTokens}
                  infoTokens={infoTokens}
                  className="GlpSwap-from-token"
                  showSymbolImage={true}
                  showBalances={false}
                  showTokenImgInDropdown={true}
                  extendedSortSequence={sortedIndexTokensWithPoolValue}
                />
              )}
            </BuyInputSection>{" "}
          </div>
        )}
      </div>
    );
  }

  function renderDecreaseSizeInput() {
    return (
      <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px]">
        <BuyInputSection
          topLeftLabel={`Close`}
          topRightLabel={existingPosition?.sizeInUsd ? `Max` : undefined}
          topRightValue={
            existingPosition?.sizeInUsd
              ? formatUsd(existingPosition.sizeInUsd)
              : undefined
          }
          inputValue={closeSizeInputValue}
          onInputValueChange={(e) => setCloseSizeInputValue(e.target.value)}
          onClickTopRightLabel={() =>
            setCloseSizeInputValue(
              formatAmount(existingPosition?.sizeInUsd, USD_DECIMALS, 2)
            )
          }
          showMaxButton={
            existingPosition?.sizeInUsd.gt(0) &&
            !closeSizeUsd?.eq(existingPosition.sizeInUsd)
          }
          onClickMax={() =>
            setCloseSizeInputValue(
              formatAmount(existingPosition?.sizeInUsd, USD_DECIMALS, 2)
            )
          }
          showPercentSelector={existingPosition?.sizeInUsd.gt(0)}
          onPercentChange={(percent) =>
            setCloseSizeInputValue(
              formatAmount(
                existingPosition?.sizeInUsd.mul(percent).div(100),
                USD_DECIMALS,
                2
              )
            )
          }
        >
          USD
        </BuyInputSection>
      </div>
    );
  }

  function renderTriggerPriceInput() {
    return (
      <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px] mt-4">
        <BuyInputSection
          topLeftLabel={`Price`}
          topRightLabel={`Mark`}
          topRightValue={formatUsd(markPrice, {
            displayDecimals: toToken?.priceDecimals,
          })}
          onClickTopRightLabel={() => {
            setTriggerPriceInputValue(
              formatAmount(markPrice, USD_DECIMALS, toToken?.priceDecimals || 2)
            );
          }}
          inputValue={triggerPriceInputValue}
          onInputValueChange={(e) => {
            setTriggerPriceInputValue(e.target.value);
          }}
        >
          USD
        </BuyInputSection>
      </div>
    );
  }

  function renderTriggerRatioInput() {
    return (
      <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px] mt-4">
        <BuyInputSection
          topLeftLabel={`Price`}
          topRightLabel={`Mark`}
          topRightValue={formatAmount(markRatio?.ratio, USD_DECIMALS, 4)}
          onClickTopRightLabel={() => {
            setTriggerRatioInputValue(
              formatAmount(markRatio?.ratio, USD_DECIMALS, 10)
            );
          }}
          inputValue={triggerRatioInputValue}
          onInputValueChange={(e) => {
            setTriggerRatioInputValue(e.target.value);
          }}
        >
          {markRatio && (
            <div className="flex">
              <TokenWithIcon
                symbol={markRatio.smallestToken.symbol}
                displaySize={24}
              />{" "}
              <span className="mx-2">per</span>
              <TokenWithIcon
                symbol={markRatio.largestToken.symbol}
                displaySize={24}
              />
            </div>
          )}
        </BuyInputSection>
      </div>
    );
  }

  function renderPositionControls() {
    return (
      <>
        {isIncrease && (
          <>
            <ToggleSwitch
              className="Exchange-leverage-slider-settings"
              isChecked={isLeverageEnabled ?? false}
              setIsChecked={setIsLeverageEnabled}
            ></ToggleSwitch>
            {isLeverageEnabled && (
              <LeverageSlider
                value={leverageOption}
                onChange={setLeverageOption}
                isPositive={isLong}
                marks={[0.1, 1.1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 50]}
              />
            )}{" "}
          </>
        )}
        {isTrigger && (
          <ExchangeInfoRow
            className="SwapBox-info-row"
            label={`Market`}
            value={
              <MarketSelector
                label={`Market`}
                className="SwapBox-info-dropdown"
                selectedIndexName={
                  toToken
                    ? getMarketIndexName({
                        indexToken: toToken,
                        isSpotOnly: false,
                      })
                    : undefined
                }
                markets={sortedAllMarkets || []}
                isSideMenu
                onSelectMarket={(indexName, marketInfo) =>
                  onSelectToTokenAddress(marketInfo.indexToken.address)
                }
              />
            }
          />
        )}
        <MarketPoolSelectorRow
          selectedMarket={marketInfo}
          indexToken={toToken}
          marketsOptions={marketsOptions}
          hasExistingOrder={Boolean(existingOrder)}
          hasExistingPosition={Boolean(existingPosition)}
          isOutPositionLiquidity={isOutPositionLiquidity}
          currentPriceImpactBps={increaseAmounts?.acceptablePriceDeltaBps}
          onSelectMarketAddress={onSelectMarketAddress}
        />
        <CollateralSelectorRow
          selectedMarketAddress={marketInfo?.marketTokenAddress}
          selectedCollateralAddress={collateralAddress}
          availableCollaterals={availableCollaterals}
          marketsOptions={marketsOptions}
          hasExistingOrder={Boolean(existingOrder)}
          hasExistingPosition={Boolean(existingPosition)}
          onSelectCollateralAddress={onSelectCollateralAddress}
          isMarket={isMarket}
        />{" "}
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
      </>
    );
  }

  function renderIncreaseOrderInfo() {
    return (
      <>
        <ExchangeInfoRow
          className="SwapBox-info-row"
          label={`Leverage`}
          value={
            nextPositionValues?.nextLeverage &&
            increaseAmounts?.sizeDeltaUsd.gt(0) ? (
              <ValueTransition
                from={formatLeverage(existingPosition?.leverage)}
                to={formatLeverage(nextPositionValues?.nextLeverage) || "-"}
              />
            ) : (
              formatLeverage(
                isLeverageEnabled
                  ? leverage
                  : increaseAmounts?.estimatedLeverage
              ) || "-"
            )
          }
        />

        <ExchangeInfoRow
          className="SwapBox-info-row"
          label={`Entry Price`}
          value={
            nextPositionValues?.nextEntryPrice ||
            existingPosition?.entryPrice ? (
              <ValueTransition
                from={formatUsd(existingPosition?.entryPrice, {
                  displayDecimals: toToken?.priceDecimals,
                })}
                to={formatUsd(nextPositionValues?.nextEntryPrice, {
                  displayDecimals: toToken?.priceDecimals,
                })}
              />
            ) : (
              formatUsd(markPrice, {
                displayDecimals: toToken?.priceDecimals,
              })
            )
          }
        />

        <ExchangeInfoRow
          className="SwapBox-info-row"
          label={`Liq. Price`}
          value={
            <ValueTransition
              from={
                existingPosition
                  ? formatLiquidationPrice(existingPosition?.liquidationPrice, {
                      displayDecimals:
                        existingPosition?.indexToken?.priceDecimals,
                    })
                  : undefined
              }
              to={
                increaseAmounts?.sizeDeltaUsd.gt(0)
                  ? formatLiquidationPrice(nextPositionValues?.nextLiqPrice, {
                      displayDecimals: toToken?.priceDecimals,
                    })
                  : existingPosition
                  ? undefined
                  : "-"
              }
            />
          }
        />
      </>
    );
  }

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

  function renderTriggerOrderInfo() {
    return (
      <>
        <ExchangeInfoRow
          className="my-[24px]"
          label={`Trigger Price`}
          value={`${decreaseAmounts?.triggerThresholdType || ""} ${
            formatUsd(decreaseAmounts?.triggerPrice, {
              displayDecimals: toToken?.priceDecimals,
            }) || "-"
          }`}
        />

        <ExchangeInfoRow
          className="my-[24px]"
          label={`Execution Price`}
          value={
            executionPriceUsd
              ? formatUsd(executionPriceUsd, {
                  displayDecimals: toToken?.priceDecimals,
                })
              : "-"
          }
        />

        {existingPosition && (
          <ExchangeInfoRow
            className="my-[24px]"
            label={`Liq. Price`}
            value={
              <ValueTransition
                from={
                  existingPosition
                    ? formatLiquidationPrice(
                        existingPosition?.liquidationPrice,
                        {
                          displayDecimals:
                            existingPosition?.indexToken?.priceDecimals,
                        }
                      )
                    : undefined
                }
                to={
                  decreaseAmounts?.isFullClose
                    ? "-"
                    : decreaseAmounts?.sizeDeltaUsd.gt(0)
                    ? formatLiquidationPrice(nextPositionValues?.nextLiqPrice, {
                        displayDecimals: toToken?.priceDecimals,
                      })
                    : undefined
                }
              />
            }
          />
        )}

        {existingPosition?.sizeInUsd.gt(0) && (
          <ExchangeInfoRow
            className="SwapBox-info-row"
            label={`Size`}
            value={
              <ValueTransition
                from={formatUsd(existingPosition.sizeInUsd)!}
                to={formatUsd(nextPositionValues?.nextSizeUsd)}
              />
            }
          />
        )}

        {existingPosition && (
          <ExchangeInfoRow
            className="SwapBox-info-row"
            label={`Collateral (${existingPosition?.collateralToken?.symbol})`}
            value={
              <ValueTransition
                from={formatUsd(existingPosition.collateralUsd)}
                to={formatUsd(nextPositionValues?.nextCollateralUsd)}
              />
            }
          />
        )}

        {existingPosition && (
          <ExchangeInfoRow
            className="SwapBox-info-row"
            label={`Leverage`}
            value={
              existingPosition.sizeInUsd.eq(
                decreaseAmounts?.sizeDeltaUsd || 0
              ) ? (
                "-"
              ) : (
                <ValueTransition
                  from={formatLeverage(existingPosition.leverage)}
                  to={formatLeverage(nextPositionValues?.nextLeverage)}
                />
              )
            }
          />
        )}

        {existingPosition && (
          <ExchangeInfoRow
            label={`PnL`}
            value={
              <ValueTransition
                from={
                  <>
                    {formatDeltaUsd(decreaseAmounts?.estimatedPnl)} (
                    {formatPercentage(decreaseAmounts?.estimatedPnlPercentage, {
                      signed: true,
                    })}
                    )
                  </>
                }
                to={
                  decreaseAmounts?.sizeDeltaUsd.gt(0) ? (
                    <>
                      {formatDeltaUsd(nextPositionValues?.nextPnl)} (
                      {formatPercentage(nextPositionValues?.nextPnlPercentage, {
                        signed: true,
                      })}
                      )
                    </>
                  ) : undefined
                }
              />
            }
          />
        )}
      </>
    );
  }

  const buttonContent = (
    <Button
      variant="primary-action"
      className={`${
        isSubmitButtonDisabled && !shouldDisableValidation ? "opacity-50" : ""
      } w-full bg-main rounded-xl py-3 text-white font-semibold`}
      onClick={onSubmit}
      disabled={isSubmitButtonDisabled && !shouldDisableValidation}
    >
      {buttonErrorText || submitButtonText}
    </Button>
  );
  const button = tooltipContent ? (
    <Tooltip
      className="w-full"
      renderContent={() => tooltipContent}
      handle={buttonContent}
      handleClassName="w-full"
      position="center-bottom"
    />
  ) : (
    buttonContent
  );

  return (
    <div className="px-[32px] pt-[24px]">
      <Tab
        icons={tradeTypeIcons}
        options={Object.values(TradeType)}
        optionLabels={tradeTypeLabels}
        option={tradeType}
        onChange={onSelectTradeType}
        className="h-[40px] p-[4px] w-full rounded-full grid grid-cols-3 bg-white items-center text-center shadow-input text-sm mb-4 font-semibold "
      />
      <Tab
        options={availableTradeModes}
        optionLabels={tradeModeLabels}
        type="inline"
        option={tradeMode}
        className="w-2/3 rounded-full grid grid-cols-3 bg-white items-center text-center text-sm mb-4 font-semibold"
        onChange={onSelectTradeMode}
        isSpan={true}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {(isSwap || isIncrease) && renderTokenInputs()}{" "}
        {isTrigger && renderDecreaseSizeInput()}
        {isSwap && isLimit && renderTriggerRatioInput()}{" "}
        {isPosition && (isLimit || isTrigger) && renderTriggerPriceInput()}{" "}
        <div className="SwapBox-info-section">
          {isPosition && <>{renderPositionControls()}</>}{" "}
          <div
            className={`${
              isSwap ? "" : "border-b-1 border-gray-200"
            } my-[30px]`}
          />
          {isIncrease && renderIncreaseOrderInfo()}
          {isTrigger && renderTriggerOrderInfo()}{" "}
          {feesType && (
            <TradeFeesRow
              {...fees}
              executionFee={executionFee}
              feesType={feesType}
            />
          )}{" "}
          {isTrigger && existingPosition && decreaseAmounts?.receiveUsd && (
            <ExchangeInfoRow
              className="SwapBox-info-row"
              label={`Receive`}
              value={formatTokenAmountWithUsd(
                decreaseAmounts.receiveTokenAmount,
                decreaseAmounts.receiveUsd,
                collateralToken?.symbol,
                collateralToken?.decimals
              )}
            />
          )}
          {priceImpactWarningState.shouldShowWarning && (
            <>
              <div className="App-card-divider" />
              <HighPriceImpactWarning
                priceImpactWarinigState={priceImpactWarningState}
                className="PositionEditor-allow-higher-slippage"
              />
            </>
          )}
        </div>
        <div className="Exchange-swap-button-container mt-[24px]">{button}</div>
        <div className="border-b-1 border-gray-200 my-[30px]" />
      </form>

      {isSwap && (
        <SwapCard
          maxLiquidityUsd={swapOutLiquidity}
          fromToken={fromToken}
          toToken={toToken}
        />
      )}
      <div className="Exchange-swap-info-group">
        {isPosition && (
          <MarketCard
            isLong={isLong}
            marketInfo={marketInfo}
            allowedSlippage={allowedSlippage}
          />
        )}
      </div>
      <ConfirmationBox
        isVisible={stage === "confirmation"}
        tradeFlags={tradeFlags}
        isWrapOrUnwrap={isWrapOrUnwrap}
        fromToken={fromToken}
        toToken={toToken}
        markPrice={markPrice}
        markRatio={markRatio}
        triggerPrice={triggerPrice}
        fixedTriggerThresholdType={fixedTriggerThresholdType}
        fixedTriggerOrderType={fixedTriggerOrderType}
        selectedTriggerAcceptablePriceImpactBps={
          selectedTriggerAcceptablePriceImpactBps
        }
        setSelectedTriggerAcceptablePriceImapctBps={
          setSelectedAcceptablePriceImapctBps
        }
        defaultTriggerAcceptablePriceImpactBps={
          defaultTriggerAcceptablePriceImpactBps
        }
        triggerRatio={triggerRatio}
        marketInfo={marketInfo}
        collateralToken={collateralToken}
        marketsOptions={marketsOptions}
        swapAmounts={swapAmounts}
        increaseAmounts={increaseAmounts}
        decreaseAmounts={decreaseAmounts}
        nextPositionValues={nextPositionValues}
        swapLiquidityUsd={swapOutLiquidity}
        longLiquidityUsd={longLiquidity}
        shortLiquidityUsd={shortLiquidity}
        keepLeverage={keepLeverage}
        fees={fees}
        executionFee={executionFee}
        error={buttonErrorText}
        existingPosition={existingPosition}
        shouldDisableValidation={shouldDisableValidation!}
        isHigherSlippageAllowed={isHigherSlippageAllowed}
        ordersData={ordersInfo}
        tokensData={tokensData}
        setIsHigherSlippageAllowed={setIsHigherSlippageAllowed}
        setKeepLeverage={setKeepLeverage}
        onClose={onConfirmationClose}
        onSubmitted={onConfirmed}
        setPendingTxns={setPendingTxns}
      />
    </div>
  );
}
