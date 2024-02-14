import {
  MarketsInfoData,
  getTotalClaimableFundingUsd,
} from "../../../../utils/gmx/domain/synthetics/markets";
import { ClaimableCardUI } from "./ClaimableCardUI";
import { CSSProperties } from "react";

type Props = {
  onClaimClick: () => void;
  marketsInfoData: MarketsInfoData | undefined;
  style?: CSSProperties;
};

const tooltipText = `Positive Funding Fees for a Position become claimable after the Position is increased, decreased or closed; or settled its fees with the option under "Accrued".`;
const buttonText = `Claim`;
const title = `Claimable`;

export function ClaimableCard({ marketsInfoData, onClaimClick, style }: Props) {
  const markets = Object.values(marketsInfoData ?? {});
  const totalClaimableFundingUsd = getTotalClaimableFundingUsd(markets);

  return (
    <ClaimableCardUI
      fundingFees={totalClaimableFundingUsd}
      buttonText={buttonText}
      title={title}
      tooltipText={tooltipText}
      onButtonClick={onClaimClick}
      style={style}
    />
  );
}
