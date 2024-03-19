import { TradeMode, TradeType } from "./types";
import { useMemo } from "react";

export type TradeFlags = {
  isLong: boolean;
  isShort: boolean;
  isPosition: boolean;
  isIncrease: boolean;
  isTrigger: boolean;
  isMarket: boolean;
  isLimit: boolean;
};

export function useTradeFlags(
  tradeType: TradeType,
  tradeMode: TradeMode
): TradeFlags {
  return useMemo(() => {
    const isLong = tradeType === TradeType.Long;
    const isShort = tradeType === TradeType.Short;

    const isPosition = isLong || isShort;

    const isMarket = tradeMode === TradeMode.Market;
    const isLimit = tradeMode === TradeMode.Limit;
    const isTrigger = tradeMode === TradeMode.Trigger;

    const isIncrease = isPosition && (isMarket || isLimit);

    return {
      isLong,
      isShort,
      isPosition,
      isIncrease,
      isMarket,
      isLimit,
      isTrigger,
    };
  }, [tradeMode, tradeType]);
}
