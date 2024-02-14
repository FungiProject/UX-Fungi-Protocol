// import { Trans } from "@lingui/macro";
import Checkbox from "../Checkbox/Checkbox";
import { PriceImpactWarningState } from "../../../../utils/gmx/domain/synthetics/trade/usePriceImpactWarningState";

export type Props = {
  priceImpactWarinigState: PriceImpactWarningState;
  className?: string;
};

export function HighPriceImpactWarning({
  priceImpactWarinigState,
  className,
}: Props) {
  if (!priceImpactWarinigState.shouldShowWarning) {
    return null;
  }

  const shouldShowSwapImpact = priceImpactWarinigState.shouldShowWarningForSwap;
  const shouldShowPriceImpact =
    priceImpactWarinigState.shouldShowWarningForPosition;

  return (
    <div className={className}>
      {shouldShowPriceImpact && (
        <Checkbox
          asRow
          isChecked={priceImpactWarinigState.isHighPositionImpactAccepted}
          setIsChecked={priceImpactWarinigState.setIsHighPositionImpactAccepted}
        >
          <span className="text-warning font-sm">
            Acknowledge high Price Impact
          </span>
        </Checkbox>
      )}

      {shouldShowSwapImpact && (
        <Checkbox
          asRow
          isChecked={priceImpactWarinigState.isHighSwapImpactAccepted}
          setIsChecked={priceImpactWarinigState.setIsHighSwapImpactAccepted}
        >
          <span className="text-warning font-sm">
            Acknowledge high Swap Price Impact
          </span>
        </Checkbox>
      )}
    </div>
  );
}
