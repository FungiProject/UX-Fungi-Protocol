import { BigNumber } from "ethers";
import { formatAmount } from "../../../lib/numbers";
import { useCallback, useState } from "react";

function numberToString(
  value: BigNumber | null,
  decimals: number,
  displayDecimals: number
) {
  if (value === null) return "";
  return formatAmount(value, decimals, displayDecimals);
}

function stringToNumber(value: string, decimals: number) {
  value = value.replace(/,/g, "").trim();

  if (value.trim() === "") {
    return null;
  }

  if (value === "." || value.trim() === "0") {
    value = "0";
  }

  if (value.endsWith(".")) {
    value = value.slice(0, -1);
  }

  const split = value.split(".");
  const [int] = split;
  let [, fraction] = split;

  fraction = (fraction ?? "").slice(0, decimals);

  const fractionLength = fraction.length;
  const multiplier = BigNumber.from(10).pow(fractionLength);
  try {
    return BigNumber.from(int || 0)
      .mul(multiplier)
      .add(BigNumber.from(fraction || 0))
      .mul(BigNumber.from(10).pow(decimals - fractionLength));
  } catch (e) {
    return null;
  }
}

export function useBigNumberInput(
  initialValue: BigNumber | null,
  decimals: number,
  displayDecimals: number
) {
  const [value, setRawValue] = useState(initialValue);
  const [displayValue, setRawDisplayValue] = useState(() =>
    numberToString(initialValue, decimals, displayDecimals)
  );

  const setValue = useCallback(
    (newValue: BigNumber | null) => {
      setRawValue(newValue);
      setRawDisplayValue(numberToString(newValue, decimals, displayDecimals));
    },
    [decimals, displayDecimals]
  );

  const setDisplayValue = useCallback(
    (newValue: string) => {
      const number = stringToNumber(newValue, decimals);

      setRawDisplayValue(newValue);
      setRawValue(number);
    },
    [decimals]
  );

  return {
    value,
    setValue,
    displayValue,
    setDisplayValue,
    isEmpty: !displayValue.trim(),
  };
}
