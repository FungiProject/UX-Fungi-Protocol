//import { t, Trans } from "@lingui/macro";
import cx from "classnames";
import ExchangeInfoRow from "../../chart/ExchangeInfoRow/ExchangeInfoRow";
import StatsTooltipRow from "../../common/Tooltip/StatsTooltipRow";
import Tooltip from "../../common/Tooltip/Tooltip";
import {
  ExecutionFee,
  FeeItem,
} from "../../../../utils/gmx/domain/synthetics/fees";
import {
  formatDeltaUsd,
  formatTokenAmountWithUsd,
} from "../../../../utils/gmx/lib/numbers";

type Props = {
  totalFees?: FeeItem;
  swapFee?: FeeItem;
  swapPriceImpact?: FeeItem;
  uiFee?: FeeItem;
  executionFee?: ExecutionFee;
  isDeposit: boolean;
};

export function GmFees(p: Props) {
  const totalFeesUsd = p.totalFees?.deltaUsd.sub(p.executionFee?.feeUsd || 0);

  return (
    <ExchangeInfoRow
      label={`Fees and Price Impact`}
      value={
        <>
          {!p.totalFees?.deltaUsd && "-"}
          {p.totalFees?.deltaUsd && (
            <Tooltip
              className="GmFees-tooltip"
              handle={
                <span className={cx({ positive: totalFeesUsd?.gt(0) })}>
                  {formatDeltaUsd(totalFeesUsd)}
                </span>
              }
              position="right-top"
              renderContent={() => (
                <div>
                  {p.swapPriceImpact?.deltaUsd.abs().gt(0) && (
                    <StatsTooltipRow
                      label={`Price Impact`}
                      value={
                        formatDeltaUsd(
                          p.swapPriceImpact.deltaUsd,
                          p.swapPriceImpact.bps
                        )!
                      }
                      showDollar={false}
                      className={
                        p.swapPriceImpact.deltaUsd.gte(0)
                          ? "text-green"
                          : "text-red"
                      }
                    />
                  )}

                  {p.swapFee && (
                    <>
                      <StatsTooltipRow
                        label={p.isDeposit ? `Buy Fee` : `Sell Fee`}
                        value={
                          formatDeltaUsd(p.swapFee.deltaUsd, p.swapFee.bps)!
                        }
                        showDollar={false}
                        className={
                          p.swapFee.deltaUsd.gte(0) ? "text-green" : "text-red"
                        }
                      />
                    </>
                  )}

                  {p.uiFee?.deltaUsd.abs()?.gt(0) && (
                    <StatsTooltipRow
                      label={<>UI Fee:</>}
                      value={formatDeltaUsd(p.uiFee.deltaUsd, p.uiFee.bps)!}
                      showDollar={false}
                      className="text-red"
                    />
                  )}
                  {p.executionFee && (
                    <StatsTooltipRow
                      label={`Max Execution Fee`}
                      value={formatTokenAmountWithUsd(
                        p.executionFee.feeTokenAmount.mul(-1),
                        p.executionFee.feeUsd.mul(-1),
                        p.executionFee.feeToken.symbol,
                        p.executionFee.feeToken.decimals
                      )}
                      showDollar={false}
                    />
                  )}
                </div>
              )}
            />
          )}
        </>
      }
    />
  );
}
