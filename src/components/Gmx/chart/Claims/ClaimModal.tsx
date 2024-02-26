import Modal from "../../common/Modal/Modal";
import {
  MarketInfo,
  MarketsInfoData,
  getMarketIndexName,
  getMarketPoolName,
  getTotalClaimableFundingUsd,
} from "../../../../utils/gmx/domain/synthetics/markets";
import { convertToUsd } from "../../../../utils/gmx/domain/synthetics/tokens";
import { BigNumber } from "ethers";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import {
  formatDeltaUsd,
  formatTokenAmount,
} from "../../../../utils/gmx/lib/numbers";

import Tooltip from "../../common/Tooltip/Tooltip";
import { claimCollateralTxn } from "../../../../utils/gmx/domain/synthetics/markets/claimCollateralTxn";

import Button from "../../common/Buttons/Button";
import { useState } from "react";
import useWallet from "../../../../utils/gmx/lib/wallets/useWallet";

type Props = {
  isVisible: boolean;
  marketsInfoData?: MarketsInfoData;
  onClose: () => void;
  setPendingTxns: (txns: any) => void;
};

export function ClaimModal(p: Props) {
  const { isVisible, onClose, setPendingTxns, marketsInfoData } = p;
  const { account } = useWallet();
  const { chainId } = useChainId();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const markets = isVisible ? Object.values(marketsInfoData || {}) : [];

  const totalClaimableFundingUsd = getTotalClaimableFundingUsd(markets);

  function renderMarketSection(market: MarketInfo) {
    const indexName = getMarketIndexName(market);
    const poolName = getMarketPoolName(market);
    const longToken = market.longToken;
    const shortToken = market.shortToken;

    const fundingLongAmount = market.claimableFundingAmountLong;
    const fundingShortAmount = market.claimableFundingAmountShort;

    const fundingLongUsd = convertToUsd(
      fundingLongAmount,
      longToken?.decimals,
      longToken?.prices?.minPrice
    );
    const fundingShortUsd = convertToUsd(
      fundingShortAmount,
      shortToken?.decimals,
      shortToken?.prices?.minPrice
    );

    const totalFundingUsd = BigNumber.from(0)
      .add(fundingLongUsd || 0)
      ?.add(fundingShortUsd || 0);

    if (!totalFundingUsd?.gt(0)) return null;

    const claimableAmountsItems: string[] = [];

    if (fundingLongAmount?.gt(0)) {
      claimableAmountsItems.push(
        formatTokenAmount(
          fundingLongAmount,
          longToken.decimals,
          longToken.symbol
        )!
      );
    }

    if (fundingShortAmount?.gt(0)) {
      claimableAmountsItems.push(
        formatTokenAmount(
          fundingShortAmount,
          shortToken.decimals,
          shortToken.symbol
        )!
      );
    }

    return (
      <div
        key={market.marketTokenAddress}
        className="ClaimSettleModal-info-row"
      >
        <div className="flex">
          <div className="Exchange-info-label ClaimSettleModal-checkbox-label">
            <div className="items-top ClaimSettleModal-row-text">
              <span>{indexName}</span>
              {poolName ? <span className="subtext">[{poolName}]</span> : null}
            </div>
          </div>
        </div>
        <div className="ClaimSettleModal-info-label-usd">
          <Tooltip
            className="ClaimSettleModal-tooltip"
            position="right-top"
            handle={formatDeltaUsd(totalFundingUsd)}
            renderContent={() => (
              <>
                {claimableAmountsItems.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </>
            )}
          />
        </div>
      </div>
    );
  }

  function onSubmit() {
    if (!account) return;

    const fundingMarketAddresses: string[] = [];
    const fundingTokenAddresses: string[] = [];

    for (const market of markets) {
      if (market.claimableFundingAmountLong?.gt(0)) {
        fundingMarketAddresses.push(market.marketTokenAddress);
        fundingTokenAddresses.push(market.longTokenAddress);
      }

      if (market.claimableFundingAmountShort?.gt(0)) {
        fundingMarketAddresses.push(market.marketTokenAddress);
        fundingTokenAddresses.push(market.shortTokenAddress);
      }
    }

    setIsSubmitting(true);

    claimCollateralTxn(chainId, {
      account,
      fundingFees: {
        marketAddresses: fundingMarketAddresses,
        tokenAddresses: fundingTokenAddresses,
      },
      setPendingTxns,
    })
      .then(onClose)
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Modal
      className="Confirmation-box ClaimableModal"
      isVisible={p.isVisible}
      setIsVisible={onClose}
      label={`Confirm Claim`}
    >
      <div className="ConfirmationBox-main">
        <div className="text-center">
          Claim <span>{formatDeltaUsd(totalClaimableFundingUsd)}</span>
        </div>
      </div>
      <div className="App-card-divider ClaimModal-divider" />
      <div className="ClaimSettleModal-info-row">
        <div className="flex">
          <div className="Exchange-info-label ClaimSettleModal-checkbox-label">
            <div className="items-top">MARKET</div>
          </div>
        </div>
        <div className="ClaimSettleModal-info-label-usd">
          <Tooltip
            className="ClaimSettleModal-tooltip-text-grey"
            position="right-top"
            handle={`FUNDING FEE`}
            renderContent={() => (
              <span className="text-white">Claimable Funding Fee.</span>
            )}
          />
        </div>
      </div>
      <div className="ClaimModal-content">
        {markets.map(renderMarketSection)}
      </div>
      <Button
        className="w-full"
        variant="primary-action"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? `Claiming...` : `Claim`}
      </Button>
    </Modal>
  );
}
