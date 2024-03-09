import { ethers } from "ethers";

export function formatNumber(number: number): string {
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatAmount(amount: string, decimals: number) {
  return ethers.utils.formatUnits(amount, decimals);
}

export function formatAmountToUsd(amount: string, decimals: number, price: number): number {
  const formatedAmound = ethers.utils.formatUnits(amount, decimals);
  return Number((Number(formatedAmound) * price).toFixed(2));
}
