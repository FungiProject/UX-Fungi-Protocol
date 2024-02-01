// import { t, Trans } from "@lingui/macro";
import Modal from "../../common/Modal/Modal";
import { formatDeltaUsd, formatUsd } from "../../../../utils/gmx/lib/numbers";
import Button from "../../common/Buttons/Button";
import { getTotalAccruedFundingUsd } from "../../../../utils/gmx/domain/synthetics/markets";
import { PositionsInfoData } from "../../../../utils/gmx/domain/synthetics/positions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SettleAccruedFundingFeeRow } from "./SettleAccruedFundingFeeRow";

import Tooltip from "../Tooltip";
import { useSyntheticsEvents } from "../../../../utils/gmx/context/SyntheticsEvents";
import { useUserReferralInfo } from "../../../../utils/gmx/domain/referrals";
import {
  estimateExecuteDecreaseOrderGasLimit,
  getExecutionFee,
  useGasLimits,
  useGasPrice,
} from "../../../../utils/gmx/domain/synthetics/fees";
import {
  createDecreaseOrderTxn,
  DecreasePositionSwapType,
  OrderType,
} from "../../../../utils/gmx/domain/synthetics/orders";
import { TokensData } from "../../../../utils/gmx/domain/synthetics/tokens";
import { BigNumber } from "ethers";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import useWallet from "../../../../utils/gmx/lib/wallets/useWallet";
import { useSubaccount } from "../../../../utils/gmx/context/SubaccountContext/SubaccountContext";
import { SubaccountNavigationButton } from "../Navigation/SubaccountNavigationButton";

type Props = {
  allowedSlippage: number;
  isVisible: boolean;
  onClose: () => void;
  positionKeys: string[];
  positionsInfoData: PositionsInfoData | undefined;
  setPositionKeys: (keys: string[]) => void;
  tokensData?: TokensData;
  setPendingTxns: (txns: any) => void;
};

export function SettleAccruedFundingFeeModal({
  allowedSlippage,
  tokensData,
  isVisible,
  onClose,
  positionKeys,
  setPositionKeys,
  positionsInfoData,
  setPendingTxns,
}: Props) {
  const { account, signer } = useWallet();
  const { chainId } = useChainId();
  const userReferralInfo = useUserReferralInfo(signer, chainId, account);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { gasLimits } = useGasLimits(chainId);
  const { gasPrice } = useGasPrice(chainId);

  const positiveFeePositions = useMemo(
    () =>
      Object.values(positionsInfoData || {}).filter((position) =>
        position.pendingClaimableFundingFeesUsd.gt(0)
      ),
    [positionsInfoData]
  );
  const selectedPositions = useMemo(
    () =>
      positiveFeePositions.filter((position) =>
        positionKeys.includes(position.key)
      ),
    [positionKeys, positiveFeePositions]
  );
  const total = useMemo(
    () => getTotalAccruedFundingUsd(selectedPositions),
    [selectedPositions]
  );
  const totalStr = formatDeltaUsd(total);

  useEffect(() => {
    if (!isVisible) setIsSubmitting(false);
  }, [isVisible]);

  const { executionFee, feeUsd } = useMemo(() => {
    if (!gasLimits || !tokensData || !gasPrice) return {};
    const estimatedGas = estimateExecuteDecreaseOrderGasLimit(gasLimits, {});
    const fees = getExecutionFee(
      chainId,
      gasLimits,
      tokensData,
      estimatedGas,
      gasPrice
    );
    return {
      executionFee: fees?.feeTokenAmount,
      feeUsd: fees?.feeUsd,
    };
  }, [chainId, gasLimits, gasPrice, tokensData]);

  const [buttonText, buttonDisabled] = useMemo(() => {
    if (isSubmitting) return [`Settling...`, true];
    if (positionKeys.length === 0) return [`Select Positions`, true];
    return [`Settle`, false];
  }, [isSubmitting, positionKeys.length]);

  const handleRowCheckboxChange = useCallback(
    (value: boolean, positionKey: string) => {
      if (value) {
        setPositionKeys(
          [...positionKeys, positionKey].filter(
            (key, index, array) => array.indexOf(key) === index
          )
        );
      } else {
        setPositionKeys(positionKeys.filter((key) => key !== positionKey));
      }
    },
    [positionKeys, setPositionKeys]
  );

  const { setPendingFundingFeeSettlement } = useSyntheticsEvents();
  const subaccount = useSubaccount(executionFee ?? null);

  const onSubmit = useCallback(() => {
    if (!account || !signer || !chainId || !executionFee || !tokensData) return;

    setIsSubmitting(true);

    createDecreaseOrderTxn(
      chainId,
      signer,
      subaccount,
      selectedPositions.map((position) => {
        return {
          account,
          marketAddress: position.marketAddress,
          initialCollateralAddress: position.collateralTokenAddress,
          initialCollateralDeltaAmount: BigNumber.from(1), // FIXME ?
          receiveTokenAddress: position.collateralToken.address,
          swapPath: [],
          sizeDeltaUsd: BigNumber.from(0),
          sizeDeltaInTokens: BigNumber.from(0),
          acceptablePrice: position.isLong
            ? BigNumber.from(2).pow(256).sub(1)
            : BigNumber.from(0),
          triggerPrice: undefined,
          decreasePositionSwapType: DecreasePositionSwapType.NoSwap,
          orderType: OrderType.MarketDecrease,
          isLong: position.isLong,
          minOutputUsd: BigNumber.from(0),
          executionFee,
          allowedSlippage,
          referralCode: userReferralInfo?.referralCodeForTxn,
          indexToken: position.indexToken,
          tokensData,
          skipSimulation: true,
        };
      }),
      {
        setPendingTxns,
        setPendingFundingFeeSettlement,
      }
    )
      .then(onClose)
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [
    account,
    allowedSlippage,
    chainId,
    executionFee,
    onClose,
    selectedPositions,
    setPendingFundingFeeSettlement,
    setPendingTxns,
    signer,
    subaccount,
    tokensData,
    userReferralInfo?.referralCodeForTxn,
  ]);

  const renderTooltipContent = useCallback(
    () => <span className="text-white">Accrued Funding Fee.</span>,
    []
  );

  return (
    <Modal
      className="Confirmation-box ClaimableModal"
      isVisible={isVisible}
      setIsVisible={onClose}
      label={`Confirm Settle`}
    >
      <div className="ConfirmationBox-main">
        <div className="text-center">Settle {totalStr}</div>
      </div>
      <div className="App-card-divider ClaimModal-divider FeeModal-divider ClaimSettleModal-divider" />
      <SubaccountNavigationButton
        executionFee={executionFee}
        closeConfirmationBox={onClose}
        tradeFlags={undefined}
      />
      <div className="ClaimModal-content ClaimSettleModal-modal-content">
        <div className="App-card-content">
          <div className="ClaimSettleModal-alert">
            Consider selecting only Positions where the accrued Funding Fees
            exceed the gas spent to Settle, which is around {formatUsd(feeUsd)}{" "}
            per each selected Position.
          </div>

          <div className="App-card-divider" />
          <div className="ClaimSettleModal-header">
            <div className="ClaimSettleModal-header-left">POSITION</div>
            <div className="ClaimSettleModal-header-right">
              <Tooltip
                className="ClaimSettleModal-tooltip"
                position="right-top"
                handle={<span>FUNDING FEE</span>}
                renderContent={renderTooltipContent}
              />
            </div>
          </div>
          {positiveFeePositions.map((position) => (
            <SettleAccruedFundingFeeRow
              key={position.key}
              position={position}
              isSelected={positionKeys.includes(position.key)}
              onCheckboxChange={handleRowCheckboxChange}
            />
          ))}
        </div>
      </div>
      <Button
        className="w-full"
        variant="primary-action"
        disabled={buttonDisabled}
        onClick={onSubmit}
      >
        {buttonText}
      </Button>
    </Modal>
  );
}
