// import { Trans, t } from "@lingui/macro";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Token from "../../../../abis/Token.json";
import { ApproveTokenButton } from "./ApproveTokenButton";
import Button from "./Button";
import BuyInputSection from "./BuyInputSection";
import ExchangeInfoRow from "./ExchangeInfoRow";
import Modal from "./Modal";
import Tab from "./Tab";
import TokenSelector from "./TokenSelector";
import Tooltip from "./Tooltip";
import { ValueTransition } from "./ValueTransition";
import { getContract } from "../../../utils/gmx/config/contracts";
import { getSyntheticsCollateralEditAddressKey } from "../../../utils/gmx/config/localStorage";
import {
  NATIVE_TOKEN_ADDRESS,
  getToken,
} from "../../../utils/gmx/config/tokens";
import { MAX_METAMASK_MOBILE_DECIMALS } from "../../../utils/gmx/config/ui";
import { useSubaccount } from "../../../utils/gmx/context/SubaccountContext/SubaccountContext";
import { useSyntheticsEvents } from "../../../utils/gmx/context/SyntheticsEvents";
import { useHasOutdatedUi } from "../../../utils/gmx/domain/legacy";
import { useUserReferralInfo } from "../../../utils/gmx/domain/referrals/hooks";
import {
  estimateExecuteDecreaseOrderGasLimit,
  estimateExecuteIncreaseOrderGasLimit,
  getExecutionFee,
  getFeeItem,
  getTotalFeeItem,
  useGasLimits,
  useGasPrice,
} from "../../../utils/gmx/domain/synthetics/fees";
import {
  DecreasePositionSwapType,
  OrderType,
  createDecreaseOrderTxn,
  createIncreaseOrderTxn,
} from "../../../utils/gmx/domain/synthetics/orders";
import {
  PositionInfo,
  formatLeverage,
  formatLiquidationPrice,
  getLeverage,
  getLiquidationPrice,
  usePositionsConstants,
} from "../../../utils/gmx/domain/synthetics/positions";
import {
  TokensData,
  adaptToV1InfoTokens,
  convertToTokenAmount,
  convertToUsd,
} from "../../../utils/gmx/domain/synthetics/tokens";
import {
  TradeFees,
  getMarkPrice,
  getMinCollateralUsdForLeverage,
} from "../../../utils/gmx/domain/synthetics/trade";
import {
  getCommonError,
  getEditCollateralError,
} from "../../../utils/gmx/domain/synthetics/trade/utils/validation";
import { BigNumber, ethers } from "ethers";
import { useChainId } from "../../../utils/gmx/lib/chains";
import { contractFetcher } from "../../../utils/gmx/lib/contracts/contractFetcher";
import { DUST_BNB } from "../../../utils/gmx/lib/legacy";
import { useLocalStorageSerializeKey } from "../../../utils/gmx/lib/localStorage";
import {
  formatAmountFree,
  formatTokenAmount,
  formatTokenAmountWithUsd,
  formatUsd,
  limitDecimals,
  parseValue,
} from "../../../utils/gmx/lib/numbers";
import { getByKey } from "../../../utils/gmx/lib/objects";
import { usePrevious } from "../../../utils/gmx/lib/usePrevious";
import useIsMetamaskMobile from "../../../utils/gmx/lib/wallets/useIsMetamaskMobile";
import useWallet from "../../../utils/gmx/lib/wallets/useWallet";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { TradeFeesRow } from "./TradeFeesRow";
import { SubaccountNavigationButton } from "./SubaccountNavigationButton";

export type Props = {
  position?: PositionInfo;
  tokensData?: TokensData;
  showPnlInLeverage: boolean;
  allowedSlippage: number;
  setPendingTxns: (txns: any) => void;
  onClose: () => void;
  shouldDisableValidation: boolean;
};

enum Operation {
  Deposit = "Deposit",
  Withdraw = "Withdraw",
}

export function PositionEditor(p: Props) {
  const {
    position,
    tokensData,
    showPnlInLeverage,
    setPendingTxns,
    onClose,
    allowedSlippage,
  } = p;
  const { chainId } = useChainId();
  const { account, signer, active } = useWallet();
  const { openConnectModal } = useConnectModal();
  const isMetamaskMobile = useIsMetamaskMobile();
  const { setPendingPosition, setPendingOrder } = useSyntheticsEvents();
  const { gasPrice } = useGasPrice(chainId);
  const { gasLimits } = useGasLimits(chainId);
  const { minCollateralUsd } = usePositionsConstants(chainId);
  const routerAddress = getContract(chainId, "SyntheticsRouter");
  const userReferralInfo = useUserReferralInfo(signer, chainId, account);
  const { data: hasOutdatedUi } = useHasOutdatedUi();

  const isVisible = Boolean(position);
  const prevIsVisible = usePrevious(isVisible);

  const infoTokens = useMemo(() => {
    if (!tokensData) {
      return undefined;
    }
    return adaptToV1InfoTokens(tokensData);
  }, [tokensData]);

  const { data: tokenAllowance } = useSWR<BigNumber>(
    position
      ? [
          active,
          chainId,
          position.collateralTokenAddress,
          "allowance",
          account,
          routerAddress,
        ]
      : null,
    {
      fetcher: contractFetcher(signer, Token) as any,
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [operation, setOperation] = useState(Operation.Deposit);
  const isDeposit = operation === Operation.Deposit;

  const indexPriceDecimals = position?.indexToken.priceDecimals || 2;

  const [selectedCollateralAddress, setSelectedCollateralAddress] =
    useLocalStorageSerializeKey(
      getSyntheticsCollateralEditAddressKey(
        chainId,
        position?.collateralTokenAddress
      ),
      position?.collateralTokenAddress
    );

  const collateralToken = getByKey(tokensData, selectedCollateralAddress);

  const availableSwapTokens = useMemo(() => {
    return position?.collateralToken.isWrapped
      ? [
          getToken(chainId, position.collateralTokenAddress),
          getToken(chainId, NATIVE_TOKEN_ADDRESS),
        ]
      : undefined;
  }, [
    chainId,
    position?.collateralToken.isWrapped,
    position?.collateralTokenAddress,
  ]);

  const collateralPrice = collateralToken?.prices.minPrice;

  const markPrice = position
    ? getMarkPrice({
        prices: position.indexToken.prices,
        isLong: position.isLong,
        isIncrease: isDeposit,
      })
    : undefined;

  const [collateralInputValue, setCollateralInputValue] = useState("");
  const collateralDeltaAmount = parseValue(
    collateralInputValue || "0",
    collateralToken?.decimals || 0
  );
  const collateralDeltaUsd = convertToUsd(
    collateralDeltaAmount,
    collateralToken?.decimals,
    collateralPrice
  );

  const needCollateralApproval =
    isDeposit &&
    tokenAllowance &&
    collateralDeltaAmount &&
    selectedCollateralAddress !== ethers.constants.AddressZero &&
    collateralDeltaAmount.gt(tokenAllowance);

  const minCollateralUsdForLeverage = position
    ? getMinCollateralUsdForLeverage(position)
    : BigNumber.from(0);
  let _minCollateralUsd = minCollateralUsdForLeverage;
  if (minCollateralUsd?.gt(_minCollateralUsd)) {
    _minCollateralUsd = minCollateralUsd;
  }
  _minCollateralUsd = _minCollateralUsd
    .add(position?.pendingBorrowingFeesUsd || 0)
    .add(position?.pendingFundingFeesUsd || 0);

  const maxWithdrawUsd = position
    ? position.collateralUsd.sub(_minCollateralUsd)
    : BigNumber.from(0);

  const maxWithdrawAmount = convertToTokenAmount(
    maxWithdrawUsd,
    collateralToken?.decimals,
    collateralPrice
  );

  const { fees, executionFee } = useMemo(() => {
    if (!position || !gasLimits || !tokensData || !gasPrice) {
      return {};
    }

    const collateralBasisUsd = isDeposit
      ? position.collateralUsd.add(collateralDeltaUsd || BigNumber.from(0))
      : position.collateralUsd;

    const fundingFee = getFeeItem(
      position.pendingFundingFeesUsd.mul(-1),
      collateralBasisUsd
    );
    const borrowFee = getFeeItem(
      position.pendingBorrowingFeesUsd.mul(-1),
      collateralBasisUsd
    );
    const totalFees = getTotalFeeItem([fundingFee, borrowFee]);

    const fees: TradeFees = {
      totalFees,
      fundingFee,
      borrowFee,
    };

    const estimatedGas = isDeposit
      ? estimateExecuteIncreaseOrderGasLimit(gasLimits, {})
      : estimateExecuteDecreaseOrderGasLimit(gasLimits, {});
    const executionFee = getExecutionFee(
      chainId,
      gasLimits,
      tokensData,
      estimatedGas,
      gasPrice
    );

    return {
      fees,
      executionFee,
    };
  }, [
    chainId,
    collateralDeltaUsd,
    gasLimits,
    gasPrice,
    isDeposit,
    position,
    tokensData,
  ]);

  const {
    nextCollateralUsd,
    nextLeverage,
    nextLiqPrice,
    receiveUsd,
    receiveAmount,
  } = useMemo(() => {
    if (
      !position ||
      !collateralDeltaUsd?.gt(0) ||
      !minCollateralUsd ||
      !fees?.totalFees
    ) {
      return {};
    }

    const totalFeesUsd = fees.totalFees.deltaUsd.abs();

    const nextCollateralUsd = isDeposit
      ? position.collateralUsd.sub(totalFeesUsd).add(collateralDeltaUsd)
      : position.collateralUsd.sub(totalFeesUsd).sub(collateralDeltaUsd);

    const nextCollateralAmount = convertToTokenAmount(
      nextCollateralUsd,
      collateralToken?.decimals,
      collateralPrice
    )!;

    const receiveUsd = isDeposit ? BigNumber.from(0) : collateralDeltaUsd;
    const receiveAmount = convertToTokenAmount(
      receiveUsd,
      collateralToken?.decimals,
      collateralPrice
    )!;

    const nextLeverage = getLeverage({
      sizeInUsd: position.sizeInUsd,
      collateralUsd: nextCollateralUsd,
      pendingBorrowingFeesUsd: BigNumber.from(0),
      pendingFundingFeesUsd: BigNumber.from(0),
      pnl: showPnlInLeverage ? position.pnl : BigNumber.from(0),
    });

    const nextLiqPrice = getLiquidationPrice({
      sizeInUsd: position.sizeInUsd,
      sizeInTokens: position.sizeInTokens,
      collateralUsd: nextCollateralUsd,
      collateralAmount: nextCollateralAmount,
      collateralToken: position.collateralToken,
      marketInfo: position.marketInfo,
      userReferralInfo,
      pendingFundingFeesUsd: BigNumber.from(0),
      pendingBorrowingFeesUsd: BigNumber.from(0),
      isLong: position.isLong,
      minCollateralUsd,
    });

    return {
      nextCollateralUsd,
      nextLeverage,
      nextLiqPrice,
      receiveUsd,
      receiveAmount,
    };
  }, [
    collateralDeltaUsd,
    collateralPrice,
    collateralToken,
    fees,
    isDeposit,
    minCollateralUsd,
    position,
    showPnlInLeverage,
    userReferralInfo,
  ]);

  const error = useMemo(() => {
    const commonError = getCommonError({
      chainId,
      isConnected: Boolean(account),
      hasOutdatedUi,
    });

    const editCollateralError = getEditCollateralError({
      collateralDeltaAmount,
      collateralDeltaUsd,
      nextCollateralUsd,
      nextLeverage,
      nextLiqPrice,
      minCollateralUsd,
      isDeposit,
      position,
      depositToken: collateralToken,
      depositAmount: collateralDeltaAmount,
    });

    const error = commonError[0] || editCollateralError[0];

    if (error) {
      return error;
    }

    if (needCollateralApproval) {
      return `Pending ${
        collateralToken?.assetSymbol ?? collateralToken?.symbol
      } approval`;
    }

    if (isSubmitting) {
      return `Creating Order...`;
    }
  }, [
    account,
    chainId,
    collateralDeltaAmount,
    collateralDeltaUsd,
    collateralToken,
    hasOutdatedUi,
    isDeposit,
    isSubmitting,
    minCollateralUsd,
    needCollateralApproval,
    nextCollateralUsd,
    nextLeverage,
    nextLiqPrice,
    position,
  ]);

  const subaccount = useSubaccount(executionFee?.feeTokenAmount ?? null);

  function onSubmit() {
    if (!account) {
      openConnectModal?.();
      return;
    }

    if (
      !executionFee?.feeTokenAmount ||
      !tokensData ||
      !markPrice ||
      !position?.indexToken ||
      !collateralDeltaAmount ||
      !selectedCollateralAddress ||
      !signer
    ) {
      return;
    }

    if (isDeposit) {
      setIsSubmitting(true);

      createIncreaseOrderTxn(chainId, signer, subaccount, {
        account,
        marketAddress: position.marketAddress,
        initialCollateralAddress: selectedCollateralAddress,
        initialCollateralAmount: collateralDeltaAmount,
        targetCollateralAddress: position.collateralTokenAddress,
        collateralDeltaAmount,
        swapPath: [],
        sizeDeltaUsd: BigNumber.from(0),
        sizeDeltaInTokens: BigNumber.from(0),
        acceptablePrice: markPrice,
        triggerPrice: undefined,
        orderType: OrderType.MarketIncrease,
        isLong: position.isLong,
        executionFee: executionFee.feeTokenAmount,
        allowedSlippage,
        referralCode: userReferralInfo?.referralCodeForTxn,
        indexToken: position.indexToken,
        tokensData,
        skipSimulation: p.shouldDisableValidation,
        setPendingTxns,
        setPendingOrder,
        setPendingPosition,
      })
        .then(onClose)
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      if (!receiveUsd) {
        return;
      }

      setIsSubmitting(true);

      createDecreaseOrderTxn(
        chainId,
        signer,
        subaccount,
        {
          account,
          marketAddress: position.marketAddress,
          initialCollateralAddress: position.collateralTokenAddress,
          initialCollateralDeltaAmount: collateralDeltaAmount,
          receiveTokenAddress: selectedCollateralAddress,
          swapPath: [],
          sizeDeltaUsd: BigNumber.from(0),
          sizeDeltaInTokens: BigNumber.from(0),
          acceptablePrice: markPrice,
          triggerPrice: undefined,
          decreasePositionSwapType: DecreasePositionSwapType.NoSwap,
          orderType: OrderType.MarketDecrease,
          isLong: position.isLong,
          minOutputUsd: receiveUsd,
          executionFee: executionFee.feeTokenAmount,
          allowedSlippage,
          referralCode: userReferralInfo?.referralCodeForTxn,
          indexToken: position.indexToken,
          tokensData,
          skipSimulation: p.shouldDisableValidation,
        },
        {
          setPendingTxns,
          setPendingOrder,
          setPendingPosition,
        }
      )
        .then(onClose)
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  }

  useEffect(
    function initCollateral() {
      if (!position) {
        return;
      }

      if (
        !selectedCollateralAddress ||
        !availableSwapTokens?.find(
          (token) => token.address === selectedCollateralAddress
        )
      ) {
        setSelectedCollateralAddress(position.collateralTokenAddress);
      }
    },
    [
      availableSwapTokens,
      position,
      selectedCollateralAddress,
      setSelectedCollateralAddress,
    ]
  );

  useEffect(
    function resetForm() {
      if (isVisible !== prevIsVisible) {
        setCollateralInputValue("");
      }
    },
    [isVisible, prevIsVisible]
  );

  const operationLabels = {
    [Operation.Deposit]: `Deposit`,
    [Operation.Withdraw]: `Withdraw`,
  };

  return (
    <div className="PositionEditor">
      <Modal
        className="PositionEditor-modal"
        isVisible={position}
        setIsVisible={onClose}
        label={
          <span>
            Edit {position?.isLong ? `Long` : `Short`}{" "}
            {position?.indexToken?.symbol}
          </span>
        }
        allowContentTouchMove
      >
        {position && (
          <>
            <Tab
              onChange={setOperation}
              option={operation}
              options={Object.values(Operation)}
              optionLabels={operationLabels}
              className="PositionEditor-tabs SwapBox-option-tabs"
            />
            <SubaccountNavigationButton
              executionFee={executionFee?.feeTokenAmount}
              closeConfirmationBox={onClose}
              tradeFlags={undefined}
            />

            <BuyInputSection
              topLeftLabel={operationLabels[operation]}
              topLeftValue={formatUsd(collateralDeltaUsd)}
              topRightLabel={`Max`}
              topRightValue={
                isDeposit
                  ? formatTokenAmount(
                      collateralToken?.balance,
                      collateralToken?.decimals,
                      "",
                      {
                        useCommas: true,
                      }
                    )
                  : formatTokenAmount(
                      maxWithdrawAmount,
                      position?.collateralToken?.decimals,
                      "",
                      {
                        useCommas: true,
                      }
                    )
              }
              inputValue={collateralInputValue}
              onInputValueChange={(e) =>
                setCollateralInputValue(e.target.value)
              }
              showMaxButton={
                isDeposit
                  ? collateralToken?.balance &&
                    !collateralDeltaAmount?.eq(collateralToken?.balance)
                  : maxWithdrawAmount &&
                    !collateralDeltaAmount?.eq(maxWithdrawAmount)
              }
              showPercentSelector={!isDeposit}
              onPercentChange={(percent) => {
                if (!isDeposit) {
                  setCollateralInputValue(
                    formatAmountFree(
                      maxWithdrawAmount!.mul(percent).div(100),
                      position?.collateralToken?.decimals || 0
                    )
                  );
                }
              }}
              onClickMax={() => {
                const maxDepositAmount = collateralToken!.isNative
                  ? collateralToken!.balance!.sub(
                      BigNumber.from(DUST_BNB).mul(2)
                    )
                  : collateralToken!.balance!;
                const formattedMaxDepositAmount = formatAmountFree(
                  maxDepositAmount!,
                  collateralToken!.decimals
                );
                const finalDepositAmount = isMetamaskMobile
                  ? limitDecimals(
                      formattedMaxDepositAmount,
                      MAX_METAMASK_MOBILE_DECIMALS
                    )
                  : formattedMaxDepositAmount;

                if (isDeposit) {
                  setCollateralInputValue(finalDepositAmount);
                } else {
                  setCollateralInputValue(
                    formatAmountFree(
                      maxWithdrawAmount!,
                      position?.collateralToken?.decimals || 0
                    )
                  );
                }
              }}
            >
              {availableSwapTokens ? (
                <TokenSelector
                  label={operationLabels[operation]}
                  chainId={chainId}
                  tokenAddress={selectedCollateralAddress!}
                  onSelectToken={(token) =>
                    setSelectedCollateralAddress(token.address)
                  }
                  tokens={availableSwapTokens}
                  infoTokens={infoTokens}
                  className="Edit-collateral-token-selector"
                  showSymbolImage={true}
                  showTokenImgInDropdown={true}
                  showBalances={false}
                />
              ) : (
                collateralToken?.symbol
              )}
            </BuyInputSection>

            <div className="PositionEditor-info-box">
              <ExchangeInfoRow
                label={`Leverage`}
                value={
                  <ValueTransition
                    from={formatLeverage(position?.leverage)}
                    to={formatLeverage(nextLeverage)}
                  />
                }
              />

              <ExchangeInfoRow
                isTop
                label={`Entry Price`}
                value={formatUsd(position.entryPrice, {
                  displayDecimals: indexPriceDecimals,
                })}
              />
              <ExchangeInfoRow
                label={`Mark Price`}
                value={formatUsd(position.markPrice, {
                  displayDecimals: indexPriceDecimals,
                })}
              />

              <ExchangeInfoRow
                label={`Liq. Price`}
                value={
                  <ValueTransition
                    from={formatLiquidationPrice(position.liquidationPrice, {
                      displayDecimals: indexPriceDecimals,
                    })}
                    to={
                      collateralDeltaAmount?.gt(0)
                        ? formatLiquidationPrice(nextLiqPrice, {
                            displayDecimals: indexPriceDecimals,
                          })
                        : undefined
                    }
                  />
                }
              />

              <ExchangeInfoRow
                isTop
                label={`Size`}
                value={formatUsd(position.sizeInUsd)}
              />

              <div className="Exchange-info-row">
                <div>
                  <Tooltip
                    handle={
                      <span className="Exchange-info-label">
                        Collateral ({position?.collateralToken?.symbol})
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
                    to={
                      collateralDeltaUsd?.gt(0)
                        ? formatUsd(nextCollateralUsd)
                        : undefined
                    }
                  />
                </div>
              </div>

              <TradeFeesRow
                {...fees}
                executionFee={executionFee}
                feesType="edit"
                shouldShowRebate={false}
              />

              {!isDeposit && (
                <ExchangeInfoRow
                  label={`Receive`}
                  value={formatTokenAmountWithUsd(
                    receiveAmount,
                    receiveUsd,
                    collateralToken?.symbol,
                    collateralToken?.decimals,
                    { fallbackToZero: true }
                  )}
                />
              )}
            </div>

            {needCollateralApproval && collateralToken && (
              <>
                <div className="App-card-divider" />

                <ApproveTokenButton
                  tokenAddress={collateralToken.address}
                  tokenSymbol={
                    collateralToken.assetSymbol ?? collateralToken.symbol
                  }
                  spenderAddress={routerAddress}
                />
              </>
            )}

            <div className="Exchange-swap-button-container Confirmation-box-row">
              <Button
                className="w-full"
                variant="primary-action"
                onClick={onSubmit}
                disabled={Boolean(error) && !p.shouldDisableValidation}
              >
                {error || operationLabels[operation]}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
