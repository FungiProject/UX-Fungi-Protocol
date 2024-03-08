import cx from "classnames";
import Button from "../../common/Buttons/Button";
import BuyInputSection from "../../common/BuyInputSection/BuyInputSection";
import ExchangeInfoRow from "../ExchangeInfoRow/ExchangeInfoRow";
import Modal from "../../common/Modal/Modal";
import PercentageInput from "../Inputs/PercentageInput";
import Tab from "../../common/Tab/Tab";
import TokenSelector from "../../common/TokenSelector/TokenSelector";
import Tooltip from "../../common/Tooltip/Tooltip";
import TooltipWithPortal from "../../common/Tooltip/TooltipWithPortal";
import { ValueTransition } from "../ValueTransition/ValueTransition";
import {
  DEFAULT_SLIPPAGE_AMOUNT,
  EXCESSIVE_SLIPPAGE_AMOUNT,
} from "../../../../utils/gmx/config/factors";
import { getKeepLeverageKey } from "../../../../utils/gmx/config/localStorage";
import { convertTokenAddress } from "../../../../utils/gmx/config/tokens";
import { useSettings } from "../../../../utils/gmx/context/SettingsContext/SettingsContextProvider";
import { useSubaccount } from "../../../../utils/gmx/context/SubaccountContext/SubaccountContext";
import { useSyntheticsEvents } from "../../../../utils/gmx/context/SyntheticsEvents";
import { useHasOutdatedUi } from "../../../../utils/gmx/domain/legacy";
import { useUserReferralInfo } from "../../../../utils/gmx/domain/referrals/hooks";
import {
  estimateExecuteDecreaseOrderGasLimit,
  getExecutionFee,
  useGasLimits,
  useGasPrice,
} from "../../../../utils/gmx/domain/synthetics/fees";
import useUiFeeFactor from "../../../../utils/gmx/domain/synthetics/fees/utils/useUiFeeFactor";
import { MarketsInfoData } from "../../../../utils/gmx/domain/synthetics/markets";
import {
  DecreasePositionSwapType,
  OrderType,
} from "../../../../utils/gmx/domain/synthetics/orders";
import {
  PositionInfo,
  formatAcceptablePrice,
  formatLeverage,
  formatLiquidationPrice,
  getTriggerNameByOrderType,
  usePositionsConstants,
} from "../../../../utils/gmx/domain/synthetics/positions";
import { TokensData } from "../../../../utils/gmx/domain/synthetics/tokens";
import {
  AvailableTokenOptions,
  applySlippageToPrice,
  getDecreasePositionAmounts,
  getMarkPrice,
  getNextPositionValuesForDecreaseTrade,
  getSwapAmountsByFromValue,
  getTradeFees,
  useSwapRoutes,
} from "../../../../utils/gmx/domain/synthetics/trade";
import { useDebugExecutionPrice } from "../../../../utils/gmx/domain/synthetics/trade/useExecutionPrice";
import { usePriceImpactWarningState } from "../../../../utils/gmx/domain/synthetics/trade/usePriceImpactWarningState";
import { TradeFlags } from "../../../../utils/gmx/domain/synthetics/trade/useTradeFlags";
import {
  getCommonError,
  getDecreaseError,
} from "../../../../utils/gmx/domain/synthetics/trade/utils/validation";
import { getIsEquivalentTokens } from "../../../../utils/gmx/domain/tokens";
import { BigNumber } from "ethers";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import { USD_DECIMALS } from "../../../../utils/gmx/lib/legacy";
import { useLocalStorageSerializeKey } from "../../../../utils/gmx/lib/localstorage";
import {
  bigNumberify,
  formatAmount,
  formatAmountFree,
  formatDeltaUsd,
  formatPercentage,
  formatTokenAmountWithUsd,
  formatUsd,
  parseValue,
} from "../../../../utils/gmx/lib/numbers";
import { getByKey } from "../../../../utils/gmx/lib/objects";
import { museNeverExist } from "../../../../utils/gmx/lib/types";
import { usePrevious } from "../../../../utils/gmx/lib/usePrevious";
import { useEffect, useMemo, useState } from "react";
import { useLatest } from "react-use";
import { AcceptablePriceImpactInputRow } from "../AcceptablePriceImpactInputRow/AcceptablePriceImpactInputRow";
import { TradeFeesRow } from "../TradeInfo/TradeFeesRow";
import { createDecreaseOrderUserOp } from "@/utils/gmx/domain/synthetics/orders/createDecreaseOrderUserOp";
import useWallet from "@/hooks/useWallet";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useNotification } from "@/context/NotificationContextProvider";

export type Props = {
  position?: PositionInfo;
  marketsInfoData?: MarketsInfoData;
  tokensData?: TokensData;
  showPnlInLeverage: boolean;
  availableTokensOptions?: AvailableTokenOptions;
  onClose: () => void;
  setPendingTxns: (txns: any) => void;
  isHigherSlippageAllowed: boolean;
  setIsHigherSlippageAllowed: (isAllowed: boolean) => void;
  shouldDisableValidation: boolean;
  tradeFlags: TradeFlags;
};

enum OrderOption {
  Market = "Market",
  Trigger = "Trigger",
}

export function PositionSeller(p: Props) {
  const {
    position,
    marketsInfoData,
    tokensData,
    showPnlInLeverage,
    onClose,
    setPendingTxns,
    availableTokensOptions,
    tradeFlags,
  } = p;

  const { chainId } = useChainId();
  const { savedAllowedSlippage } = useSettings();
  const { login: openConnectModal, scAccount } = useWallet();
  const { sendUserOperations } = useUserOperations();
  const { gasPrice } = useGasPrice(chainId);
  const { gasLimits } = useGasLimits(chainId);
  const { minCollateralUsd, minPositionSizeUsd } =
    usePositionsConstants(chainId);
  const userReferralInfo = useUserReferralInfo(chainId, scAccount);
  const { data: hasOutdatedUi } = useHasOutdatedUi();
  const uiFeeFactor = useUiFeeFactor(chainId);
  const { savedAcceptablePriceImpactBuffer } = useSettings();
  const [showInputs, setShowInputs] = useState<boolean>(false);
  const isVisible = Boolean(position);
  const prevIsVisible = usePrevious(isVisible);

  const ORDER_OPTION_LABELS = {
    [OrderOption.Market]: `Market`,
    [OrderOption.Trigger]: `TP/SL`,
  };

  const [orderOption, setOrderOption] = useState<OrderOption>(
    OrderOption.Market
  );
  const [triggerPriceInputValue, setTriggerPriceInputValue] = useState("");
  const triggerPrice = parseValue(triggerPriceInputValue, USD_DECIMALS);

  const isTrigger = orderOption === OrderOption.Trigger;

  const { setPendingPosition, setPendingOrder } = useSyntheticsEvents();
  const [keepLeverage, setKeepLeverage] = useLocalStorageSerializeKey(
    getKeepLeverageKey(chainId),
    true
  );

  const [
    defaultTriggerAcceptablePriceImpactBps,
    setDefaultTriggerAcceptablePriceImpactBps,
  ] = useState<BigNumber>();
  const [
    selectedTriggerAcceptablePriceImpactBps,
    setSelectedAcceptablePriceImapctBps,
  ] = useState<BigNumber>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();
  const [closeUsdInputValue, setCloseUsdInputValue] = useState("");
  const closeSizeUsd = parseValue(closeUsdInputValue || "0", USD_DECIMALS)!;
  const maxCloseSize = position?.sizeInUsd || BigNumber.from(0);

  const [receiveTokenAddress, setReceiveTokenAddress] = useState<string>();
  const [allowedSlippage, setAllowedSlippage] = useState(savedAllowedSlippage);
  const receiveToken = isTrigger
    ? position?.collateralToken
    : getByKey(tokensData, receiveTokenAddress);

  useEffect(() => {
    setAllowedSlippage(savedAllowedSlippage);
  }, [savedAllowedSlippage, isVisible]);

  const markPrice = position
    ? getMarkPrice({
        prices: position.indexToken.prices,
        isLong: position.isLong,
        isIncrease: false,
      })
    : undefined;

  const { findSwapPath, maxSwapLiquidity } = useSwapRoutes({
    marketsInfoData,
    fromTokenAddress: position?.collateralTokenAddress,
    toTokenAddress: receiveTokenAddress,
  });

  const decreaseAmounts = useMemo(() => {
    if (!position || !minCollateralUsd || !minPositionSizeUsd) {
      return undefined;
    }

    return getDecreasePositionAmounts({
      marketInfo: position.marketInfo,
      collateralToken: position.collateralToken,
      isLong: position.isLong,
      position,
      closeSizeUsd: closeSizeUsd,
      keepLeverage: keepLeverage!,
      triggerPrice: isTrigger ? triggerPrice : undefined,
      acceptablePriceImpactBuffer: savedAcceptablePriceImpactBuffer,
      fixedAcceptablePriceImpactBps: isTrigger
        ? selectedTriggerAcceptablePriceImpactBps
        : undefined,
      userReferralInfo,
      minCollateralUsd,
      minPositionSizeUsd,
      uiFeeFactor,
    });
  }, [
    closeSizeUsd,
    isTrigger,
    keepLeverage,
    minCollateralUsd,
    minPositionSizeUsd,
    position,
    savedAcceptablePriceImpactBuffer,
    selectedTriggerAcceptablePriceImpactBps,
    triggerPrice,
    userReferralInfo,
    uiFeeFactor,
  ]);

  const acceptablePrice = useMemo(() => {
    if (!position || !decreaseAmounts?.acceptablePrice) {
      return undefined;
    }

    if (orderOption === OrderOption.Market) {
      return applySlippageToPrice(
        allowedSlippage,
        decreaseAmounts.acceptablePrice,
        false,
        position.isLong
      );
    } else if (orderOption === OrderOption.Trigger) {
      return decreaseAmounts.acceptablePrice;
    } else {
      museNeverExist(orderOption);
    }
  }, [
    allowedSlippage,
    decreaseAmounts?.acceptablePrice,
    orderOption,
    position,
  ]);

  useDebugExecutionPrice(chainId, {
    skip: true,
    marketInfo: position?.marketInfo,
    sizeInUsd: position?.sizeInUsd,
    sizeInTokens: position?.sizeInTokens,
    sizeDeltaUsd: decreaseAmounts?.sizeDeltaUsd.mul(-1),
    isLong: position?.isLong,
  });

  const shouldSwap =
    position &&
    receiveToken &&
    !getIsEquivalentTokens(position.collateralToken, receiveToken);

  const getClikedBuyInputSection = (status: boolean) => {
    setShowInputs(status);
  };

  const swapAmounts = useMemo(() => {
    if (
      !shouldSwap ||
      !receiveToken ||
      !decreaseAmounts?.receiveTokenAmount ||
      !position
    ) {
      return undefined;
    }

    return getSwapAmountsByFromValue({
      tokenIn: position.collateralToken,
      tokenOut: receiveToken,
      amountIn: decreaseAmounts.receiveTokenAmount,
      isLimit: false,
      findSwapPath,
      uiFeeFactor,
    });
  }, [
    decreaseAmounts,
    findSwapPath,
    position,
    receiveToken,
    shouldSwap,
    uiFeeFactor,
  ]);

  const receiveUsd = swapAmounts?.usdOut || decreaseAmounts?.receiveUsd;
  const receiveTokenAmount =
    swapAmounts?.amountOut || decreaseAmounts?.receiveTokenAmount;

  const nextPositionValues = useMemo(() => {
    if (
      !position ||
      !decreaseAmounts?.sizeDeltaUsd.gt(0) ||
      !minCollateralUsd
    ) {
      return undefined;
    }

    return getNextPositionValuesForDecreaseTrade({
      existingPosition: position,
      marketInfo: position.marketInfo,
      collateralToken: position.collateralToken,
      sizeDeltaUsd: decreaseAmounts.sizeDeltaUsd,
      sizeDeltaInTokens: decreaseAmounts.sizeDeltaInTokens,
      collateralDeltaUsd: decreaseAmounts.collateralDeltaUsd,
      collateralDeltaAmount: decreaseAmounts.collateralDeltaAmount,
      payedRemainingCollateralUsd: decreaseAmounts.payedRemainingCollateralUsd,
      payedRemainingCollateralAmount:
        decreaseAmounts.payedRemainingCollateralAmount,
      realizedPnl: decreaseAmounts.realizedPnl,
      estimatedPnl: decreaseAmounts.estimatedPnl,
      showPnlInLeverage,
      isLong: position.isLong,
      minCollateralUsd,
      userReferralInfo,
    });
  }, [
    decreaseAmounts,
    minCollateralUsd,
    position,
    showPnlInLeverage,
    userReferralInfo,
  ]);

  const { fees, executionFee } = useMemo(() => {
    if (
      !position ||
      !decreaseAmounts ||
      !gasLimits ||
      !tokensData ||
      !gasPrice
    ) {
      return {};
    }

    const swapsCount =
      (decreaseAmounts.decreaseSwapType === DecreasePositionSwapType.NoSwap
        ? 0
        : 1) + (swapAmounts?.swapPathStats?.swapPath?.length || 0);

    const estimatedGas = estimateExecuteDecreaseOrderGasLimit(gasLimits, {
      swapsCount,
    });

    return {
      fees: getTradeFees({
        isIncrease: false,
        initialCollateralUsd: position.collateralUsd,
        sizeDeltaUsd: decreaseAmounts.sizeDeltaUsd,
        swapSteps: swapAmounts?.swapPathStats?.swapSteps || [],
        positionFeeUsd: decreaseAmounts.positionFeeUsd,
        swapPriceImpactDeltaUsd:
          swapAmounts?.swapPathStats?.totalSwapPriceImpactDeltaUsd ||
          BigNumber.from(0),
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
    };
  }, [
    chainId,
    decreaseAmounts,
    gasLimits,
    gasPrice,
    position,
    swapAmounts?.swapPathStats?.swapPath,
    swapAmounts?.swapPathStats?.swapSteps,
    swapAmounts?.swapPathStats?.totalSwapPriceImpactDeltaUsd,
    tokensData,
    uiFeeFactor,
  ]);

  const priceImpactWarningState = usePriceImpactWarningState({
    positionPriceImpact: fees?.positionPriceImpact,
    swapPriceImpact: fees?.swapPriceImpact,
    tradeFlags,
    place: "positionSeller",
  });

  const isNotEnoughReceiveTokenLiquidity = shouldSwap
    ? maxSwapLiquidity?.lt(receiveUsd || 0)
    : false;

  const setIsHighPositionImpactAcceptedLatestRef = useLatest(
    priceImpactWarningState.setIsHighPositionImpactAccepted
  );
  const setIsHighSwapImpactAcceptedLatestRef = useLatest(
    priceImpactWarningState.setIsHighSwapImpactAccepted
  );

  useEffect(() => {
    if (isVisible) {
      setIsHighPositionImpactAcceptedLatestRef.current(true);
      setIsHighSwapImpactAcceptedLatestRef.current(true);
    }
  }, [
    setIsHighPositionImpactAcceptedLatestRef,
    setIsHighSwapImpactAcceptedLatestRef,
    isVisible,
    orderOption,
  ]);

  const error = useMemo(() => {
    if (!position) {
      return undefined;
    }

    const commonError = getCommonError({
      chainId,
      isConnected: Boolean(scAccount),
      hasOutdatedUi,
    });

    const decreaseError = getDecreaseError({
      marketInfo: position.marketInfo,
      inputSizeUsd: closeSizeUsd,
      sizeDeltaUsd: decreaseAmounts?.sizeDeltaUsd,
      receiveToken,
      isTrigger,
      triggerPrice,
      fixedTriggerThresholdType: undefined,
      existingPosition: position,
      markPrice,
      nextPositionValues,
      isLong: position.isLong,
      isContractAccount: false,
      minCollateralUsd,
      priceImpactWarning: priceImpactWarningState,
      isNotEnoughReceiveTokenLiquidity,
    });

    if (commonError[0] || decreaseError[0]) {
      return commonError[0] || decreaseError[0];
    }

    if (isSubmitting) {
      return `Creating Order...`;
    }
  }, [
    scAccount,
    chainId,
    closeSizeUsd,
    decreaseAmounts?.sizeDeltaUsd,
    hasOutdatedUi,
    isNotEnoughReceiveTokenLiquidity,
    isSubmitting,
    isTrigger,
    markPrice,
    minCollateralUsd,
    nextPositionValues,
    position,
    priceImpactWarningState,
    receiveToken,
    triggerPrice,
  ]);

  const subaccount = useSubaccount(executionFee?.feeTokenAmount ?? null);

  async function onSubmit() {
    if (!scAccount) {
      openConnectModal?.();
      return;
    }

    const orderType = isTrigger
      ? decreaseAmounts?.triggerOrderType
      : OrderType.MarketDecrease;

    if (
      !tokensData ||
      !position ||
      !executionFee?.feeTokenAmount ||
      !receiveToken?.address ||
      !receiveUsd ||
      !decreaseAmounts?.acceptablePrice ||
      !orderType
    ) {
      showNotification({
        message: "Error submitting order",
        type: "error",
      });

      return Promise.resolve();
    }

    // const userOps = tokensToApprove.map((address: string) =>
    //   createApproveTokensUserOp({
    //     tokenAddress: address,
    //     spender: routerAddress,
    //   })
    // );
    setIsSubmitting(true);
    const createSwapOrderOp = await createDecreaseOrderUserOp(
      chainId,
      subaccount,
      {
        account: scAccount,
        marketAddress: position.marketAddress,
        initialCollateralAddress: position.collateralTokenAddress,
        initialCollateralDeltaAmount:
          decreaseAmounts.collateralDeltaAmount || BigNumber.from(0),
        receiveTokenAddress: receiveToken.address,
        swapPath: swapAmounts?.swapPathStats?.swapPath || [],
        sizeDeltaUsd: decreaseAmounts.sizeDeltaUsd,
        sizeDeltaInTokens: decreaseAmounts.sizeDeltaInTokens,
        isLong: position.isLong,
        acceptablePrice: decreaseAmounts.acceptablePrice,
        triggerPrice: isTrigger ? triggerPrice : undefined,
        minOutputUsd: BigNumber.from(0),
        decreasePositionSwapType: decreaseAmounts.decreaseSwapType,
        orderType,
        referralCode: userReferralInfo?.referralCodeForTxn,
        executionFee: executionFee.feeTokenAmount,
        allowedSlippage,
        indexToken: position.indexToken,
        tokensData,
        skipSimulation: p.shouldDisableValidation,
      },
      {
        setPendingOrder,
        setPendingTxns,
        setPendingPosition,
      }
    );

    // userOps.push(createSwapOrderOp);

    return sendUserOperations([createSwapOrderOp])
      .then(onClose)
      .finally(() => setIsSubmitting(false));
  }
  useEffect(
    function resetForm() {
      if (!isVisible !== prevIsVisible) {
        setCloseUsdInputValue("");
        setIsHighPositionImpactAcceptedLatestRef.current(true);
        setIsHighSwapImpactAcceptedLatestRef.current(true);
        setTriggerPriceInputValue("");
        setReceiveTokenAddress(undefined);
        setOrderOption(OrderOption.Market);
      }
    },
    [
      isVisible,
      prevIsVisible,
      setIsHighPositionImpactAcceptedLatestRef,
      setIsHighSwapImpactAcceptedLatestRef,
    ]
  );

  useEffect(
    function initReceiveToken() {
      if (!receiveTokenAddress && position?.collateralToken?.address) {
        const convertedAddress = convertTokenAddress(
          chainId,
          position?.collateralToken.address,
          "native"
        );
        setReceiveTokenAddress(convertedAddress);
      }
    },
    [chainId, position?.collateralToken, receiveTokenAddress]
  );

  useEffect(() => {
    if (isTrigger && decreaseAmounts) {
      if (
        !defaultTriggerAcceptablePriceImpactBps ||
        !defaultTriggerAcceptablePriceImpactBps.eq(
          decreaseAmounts.recommendedAcceptablePriceDeltaBps.abs()
        )
      ) {
        setDefaultTriggerAcceptablePriceImpactBps(
          decreaseAmounts.recommendedAcceptablePriceDeltaBps.abs()
        );
      }
    }
  }, [decreaseAmounts, defaultTriggerAcceptablePriceImpactBps, isTrigger]);

  const indexPriceDecimals = position?.indexToken?.priceDecimals;
  const toToken = position?.indexToken;

  const triggerPriceRow = (
    <ExchangeInfoRow
      className="SwapBox-info-row"
      label={`Trigger Price`}
      isTop
      value={`${decreaseAmounts?.triggerThresholdType || ""} ${
        formatUsd(decreaseAmounts?.triggerPrice, {
          displayDecimals: toToken?.priceDecimals,
        }) || "-"
      }`}
    />
  );

  const allowedSlippageRow = (
    <div>
      <ExchangeInfoRow
        label={
          <TooltipWithPortal
            handle={`Allowed Slippage`}
            position="left-top"
            renderContent={() => {
              return (
                <div className="text-white">
                  <div>
                    You can edit the default Allowed Slippage in the settings
                    menu on the top right of the page.
                    <br />
                    <br />
                    Note that a low allowed slippage, e.g. less than{" "}
                    {formatPercentage(bigNumberify(DEFAULT_SLIPPAGE_AMOUNT), {
                      signed: false,
                    })}
                    , may result in failed orders if prices are volatile.
                  </div>
                </div>
              );
            }}
          />
        }
      >
        <PercentageInput
          onChange={setAllowedSlippage}
          defaultValue={allowedSlippage}
          highValue={EXCESSIVE_SLIPPAGE_AMOUNT}
          highValueWarningText={`Slippage is too high`}
        />
      </ExchangeInfoRow>
    </div>
  );

  const markPriceRow = (
    <ExchangeInfoRow
      label={`Mark Price`}
      isTop
      value={
        formatUsd(markPrice, {
          displayDecimals: indexPriceDecimals,
        }) || "-"
      }
    />
  );

  const entryPriceRow = (
    <ExchangeInfoRow
      label={`Entry Price`}
      value={
        formatUsd(position?.entryPrice, {
          displayDecimals: indexPriceDecimals,
        }) || "-"
      }
    />
  );

  const acceptablePriceImpactInputRow = (() => {
    if (!decreaseAmounts) {
      return;
    }

    return (
      <AcceptablePriceImpactInputRow
        notAvailable={
          !triggerPriceInputValue ||
          decreaseAmounts.triggerOrderType === OrderType.StopLossDecrease
        }
        defaultAcceptablePriceImpactBps={defaultTriggerAcceptablePriceImpactBps}
        fees={fees}
        setSelectedAcceptablePriceImpactBps={
          setSelectedAcceptablePriceImapctBps
        }
      />
    );
  })();

  const acceptablePriceRow = (
    <ExchangeInfoRow
      label={`Acceptable Price`}
      value={
        decreaseAmounts?.sizeDeltaUsd.gt(0)
          ? formatAcceptablePrice(acceptablePrice, {
              displayDecimals: indexPriceDecimals,
            })
          : "-"
      }
    />
  );

  const liqPriceRow = position && (
    <ExchangeInfoRow
      className="SwapBox-info-row"
      label={`Liq. Price`}
      value={
        <ValueTransition
          from={
            formatLiquidationPrice(position.liquidationPrice, {
              displayDecimals: indexPriceDecimals,
            })!
          }
          to={
            decreaseAmounts?.isFullClose
              ? "-"
              : decreaseAmounts?.sizeDeltaUsd.gt(0)
              ? formatLiquidationPrice(nextPositionValues?.nextLiqPrice, {
                  displayDecimals: indexPriceDecimals,
                })
              : undefined
          }
        />
      }
    />
  );

  const sizeRow = (
    <ExchangeInfoRow
      isTop={!isTrigger}
      label={`Size`}
      value={
        <ValueTransition
          from={formatUsd(position?.sizeInUsd)!}
          to={formatUsd(nextPositionValues?.nextSizeUsd)}
        />
      }
    />
  );

  const pnlRow =
    position &&
    (isTrigger ? (
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
    ) : (
      <ExchangeInfoRow
        label={`PnL`}
        value={
          <ValueTransition
            from={formatDeltaUsd(position.pnl, position.pnlPercentage)}
            to={formatDeltaUsd(
              nextPositionValues?.nextPnl,
              nextPositionValues?.nextPnlPercentage
            )}
          />
        }
      />
    ));

  const receiveTokenRow = isTrigger ? (
    <ExchangeInfoRow
      className="SwapBox-info-row"
      label={`Receive`}
      value={formatTokenAmountWithUsd(
        decreaseAmounts?.receiveTokenAmount,
        decreaseAmounts?.receiveUsd,
        position?.collateralToken?.symbol,
        position?.collateralToken?.decimals
      )}
    />
  ) : (
    <ExchangeInfoRow
      isTop
      label={`Receive`}
      className="Exchange-info-row PositionSeller-receive-row "
      value={
        receiveToken && (
          <TokenSelector
            label={`Receive`}
            className={cx("PositionSeller-token-selector", {
              warning: isNotEnoughReceiveTokenLiquidity,
            })}
            chainId={chainId}
            height={"h-[700px]"}
            showBalances={false}
            disableBodyScrollLock={true}
            infoTokens={availableTokensOptions?.infoTokens}
            tokenAddress={receiveToken.address}
            onSelectToken={(token) => setReceiveTokenAddress(token.address)}
            tokens={availableTokensOptions?.swapTokens || []}
            showTokenImgInDropdown={true}
            selectedTokenLabel={
              <span>
                {formatTokenAmountWithUsd(
                  receiveTokenAmount,
                  receiveUsd,
                  receiveToken?.symbol,
                  receiveToken?.decimals,
                  {
                    fallbackToZero: true,
                  }
                )}
              </span>
            }
            extendedSortSequence={
              availableTokensOptions?.sortedLongAndShortTokens
            }
          />
        )
      }
    />
  );

  const isStopLoss =
    decreaseAmounts?.triggerOrderType === OrderType.StopLossDecrease;

  return (
    <div className="PositionEditor PositionSeller">
      <Modal
        className="PositionSeller-modal"
        isVisible={isVisible}
        setIsVisible={p.onClose}
        label={
          <span>
            Close {p.position?.isLong ? `Long` : `Short`}{" "}
            {p.position?.indexToken?.symbol}
          </span>
        }
        allowContentTouchMove
      >
        <Tab
          options={Object.values(OrderOption)}
          option={orderOption}
          optionLabels={ORDER_OPTION_LABELS}
          onChange={setOrderOption}
          className="mt-4 h-[40px] p-[4px] w-full rounded-full grid grid-cols-2 bg-white items-center text-center shadow-input text-sm mb-4 font-semibold"
        />

        {position && (
          <>
            <div
              className={`flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium ${
                showInputs ? "h-[130px]" : "h-[90px]"
              }`}
            >
              <BuyInputSection
                topLeftLabel={`Set %`}
                topRightLabel={`Max`}
                getCliked={getClikedBuyInputSection}
                topRightValue={formatUsd(maxCloseSize)}
                inputValue={closeUsdInputValue}
                onInputValueChange={(e) =>
                  setCloseUsdInputValue(e.target.value)
                }
                showMaxButton={
                  maxCloseSize?.gt(0) && !closeSizeUsd?.eq(maxCloseSize)
                }
                onClickMax={() =>
                  setCloseUsdInputValue(
                    formatAmountFree(maxCloseSize, USD_DECIMALS)
                  )
                }
                showPercentSelector={true}
                onPercentChange={(percentage) => {
                  const formattedAmount = formatAmountFree(
                    maxCloseSize.mul(percentage).div(100),
                    USD_DECIMALS,
                    2
                  );
                  setCloseUsdInputValue(formattedAmount);
                }}
                preventFocusOnLabelClick="right"
              >
                USD
              </BuyInputSection>
            </div>
            {isTrigger && (
              <div className="mt-4 flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[90px]">
                <BuyInputSection
                  topLeftLabel={`Price`}
                  topRightLabel={`Mark`}
                  topRightValue={formatUsd(markPrice, {
                    displayDecimals: toToken?.priceDecimals,
                  })}
                  onClickTopRightLabel={() => {
                    setTriggerPriceInputValue(
                      formatAmount(
                        markPrice,
                        USD_DECIMALS,
                        toToken?.priceDecimals || 2
                      )
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
            )}

            <div>
              {/* <div>
                <ToggleSwitch
                  isChecked={keepLeverage ?? false}
                  setIsChecked={setKeepLeverage}
                >
                  <span className="text-gray font-sm">
                    <span>
                      Keep leverage at{" "}
                      {position?.leverage
                        ? formatLeverage(position.leverage)
                        : "..."}
                    </span>
                  </span>
                </ToggleSwitch>
              </div> */}

              {isTrigger ? (
                <>
                  {triggerPriceRow}
                  {!isStopLoss && acceptablePriceImpactInputRow}
                  {!isStopLoss && acceptablePriceRow}
                  {liqPriceRow}
                  {sizeRow}
                </>
              ) : (
                <>
                  {allowedSlippageRow}
                  {markPriceRow}
                  {entryPriceRow}
                  {acceptablePriceRow}
                  {liqPriceRow}
                  {sizeRow}
                </>
              )}

              <div className="flex text-center border-y-1 items-center py-4 justify-center">
                <div>
                  <Tooltip
                    handle={
                      <span className="Exchange-info-label">
                        Collateral ({position.collateralToken?.symbol})
                      </span>
                    }
                    position="left-top"
                    renderContent={() => {
                      return (
                        <span>
                          Initial Collateral (Collateral excluding Borrow and
                          Funding Fee).
                        </span>
                      );
                    }}
                  />
                </div>
                <div className="align-right">
                  <ValueTransition
                    from={formatUsd(position?.collateralUsd)!}
                    to={formatUsd(nextPositionValues?.nextCollateralUsd)}
                  />
                </div>
              </div>
              {!keepLeverage && (
                <ExchangeInfoRow
                  label={`Leverage`}
                  value={
                    decreaseAmounts?.sizeDeltaUsd.eq(position.sizeInUsd) ? (
                      "-"
                    ) : (
                      <ValueTransition
                        from={formatLeverage(position.leverage)}
                        to={formatLeverage(nextPositionValues?.nextLeverage)}
                      />
                    )
                  }
                />
              )}
              {pnlRow}

              <TradeFeesRow
                {...fees}
                executionFee={executionFee}
                feesType="decrease"
              />

              {receiveTokenRow}
            </div>

            <div className="Exchange-swap-button-container">
              <Button
                className={`mt-4 ${
                  Boolean(error) && !p.shouldDisableValidation
                    ? "opacity-50"
                    : ""
                } w-full bg-main rounded-xl py-3 text-white font-semibold`}
                variant="primary-action"
                disabled={Boolean(error) && !p.shouldDisableValidation}
                onClick={onSubmit}
              >
                {error ||
                  (isTrigger
                    ? `Create ${getTriggerNameByOrderType(
                        decreaseAmounts?.triggerOrderType
                      )} Order`
                    : `Close`)}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
