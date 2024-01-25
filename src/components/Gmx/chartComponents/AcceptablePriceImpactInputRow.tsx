// import { Trans, t } from "@lingui/macro";
import ExchangeInfoRow from "./ExchangeInfoRow";
import PercentageInput from "./PercentageInput";
import { HIGH_POSITION_IMPACT_BPS } from "../config/factors";
import { TradeFees } from "../domain/synthetics/trade";
import { BigNumber } from "ethers";
import { formatPercentage } from "../lib/numbers";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  defaultAcceptablePriceImpactBps: BigNumber | undefined;
  fees: TradeFees | undefined;
  setSelectedAcceptablePriceImpactBps: (value: BigNumber) => void;
  notAvailable?: boolean;
};

const EMPTY_SUGGESTIONS: number[] = [];

function AcceptablePriceImpactInputRowImpl({
  defaultAcceptablePriceImpactBps,
  fees,
  setSelectedAcceptablePriceImpactBps,
  notAvailable = false,
}: Props) {
  const setValue = useCallback(
    (value) => {
      setSelectedAcceptablePriceImpactBps(BigNumber.from(value));
    },
    [setSelectedAcceptablePriceImpactBps]
  );

  const defaultValue = defaultAcceptablePriceImpactBps?.toNumber();

  // calculated Acceptable Price value is not refreshing to the new percentage
  // when size field is changed.
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue, setValue]);

  const [key, setKey] = useState(0);

  // if current price impact is 0.01%, the message will be shown
  // only if acceptable price impact is set to more than 0.51%
  const highValue = useMemo(() => {
    if (!fees) {
      return undefined;
    }

    if (fees.positionPriceImpact?.bps.lte(0)) {
      return (
        HIGH_POSITION_IMPACT_BPS +
        fees.positionPriceImpact?.bps.abs().toNumber()
      );
    } else {
      return HIGH_POSITION_IMPACT_BPS;
    }
  }, [fees]);

  const handleRecommendedValueClick = useCallback(() => {
    setKey((key) => key + 1);
    setValue(defaultValue);
  }, [defaultValue, setValue]);

  if (!defaultAcceptablePriceImpactBps || !fees || defaultValue === undefined) {
    return null;
  }

  const recommendedHandle = (
    <span
      className="AcceptablePriceImpactInputRow-handle"
      onClick={handleRecommendedValueClick}
    >
      Set Recommended Impact:{" "}
      {formatPercentage(BigNumber.from(defaultValue).mul(-1), {
        signed: true,
      })}
      .
    </span>
  );

  const lowValueWarningText = fees.positionPriceImpact?.bps.gte(0) ? (
    <p>
      The current Price Impact is{" "}
      {formatPercentage(fees.positionPriceImpact?.bps, { signed: true })}.
      Consider using -0.30% Acceptable Price Impact so the order is more likely
      to be processed.
      <br />
      <br />
      {recommendedHandle}
    </p>
  ) : (
    <p>
      The Current Price Impact is{" "}
      {formatPercentage(fees.positionPriceImpact?.bps, { signed: true })}.
      Consider adding a buffer of 0.30% to it so the order is more likely to be
      processed.
      <br />
      <br />
      {recommendedHandle}
    </p>
  );

  const highValueWarningText = (
    <p>
      You have set a high Acceptable Price Impact. The current Price Impact is{" "}
      {formatPercentage(fees.positionPriceImpact?.bps, { signed: true })}.
      <br />
      <br />
      {recommendedHandle}
    </p>
  );

  const content = notAvailable ? (
    `NA`
  ) : (
    <PercentageInput
      key={key}
      onChange={setValue}
      defaultValue={defaultValue}
      highValue={highValue}
      highValueCheckStrategy="gt"
      lowValue={defaultValue}
      suggestions={EMPTY_SUGGESTIONS}
      highValueWarningText={highValueWarningText}
      lowValueWarningText={lowValueWarningText}
      negativeSign
    />
  );

  return (
    <ExchangeInfoRow label={`Acceptable Price Impact`}>
      {content}
    </ExchangeInfoRow>
  );
}

export const AcceptablePriceImpactInputRow = memo(
  AcceptablePriceImpactInputRowImpl
) as typeof AcceptablePriceImpactInputRowImpl;
