import { getTotalAccruedFundingUsd } from "../../../../utils/gmx/domain/synthetics/markets";
import { PositionsInfoData } from "../../../../utils/gmx/domain/synthetics/positions";
import { CSSProperties, useMemo } from "react";
import { ClaimableCardUI } from "../Claims/ClaimableCardUI";

type Props = {
  onSettleClick: () => void;
  positionsInfoData: PositionsInfoData | undefined;
  style?: CSSProperties;
};

const tooltipText = `Accrued Positive Funding Fees for Positions not yet claimable. They will become available to claim by using the "Settle" button, or after the Position is increased, decreased or closed.`;
const buttonText = `Settle`;
const title = `Accrued`;

export function SettleAccruedCard({
  onSettleClick,
  style,
  positionsInfoData,
}: Props) {
  const positions = useMemo(
    () => Object.values(positionsInfoData || {}),
    [positionsInfoData]
  );
  const fundingFees = useMemo(
    () => getTotalAccruedFundingUsd(positions),
    [positions]
  );

  return (
    <ClaimableCardUI
      fundingFees={fundingFees}
      buttonText={buttonText}
      title={title}
      tooltipText={tooltipText}
      onButtonClick={onSettleClick}
      style={style}
    />
  );
}
