import { BigNumber } from "ethers";

export function getPlusOrMinusSymbol(
  value?: BigNumber,
  opts: { showPlusForZero?: boolean } = {}
): string {
  if (!value) {
    return "";
  }

  const { showPlusForZero = false } = opts;
  return value.isZero()
    ? showPlusForZero
      ? "+"
      : ""
    : value.isNegative()
    ? "-"
    : "+";
}
