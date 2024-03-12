import { usePositionsInfo } from "@/utils/gmx/domain/synthetics/positions";
import { useChainId } from "@/utils/gmx/lib/chains";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import React, { useEffect, useState } from "react";
import { PositionInfo } from "./types";
import { useMarketsInfo } from "@/utils/gmx/domain/synthetics/markets";
import { formatDeltaUsd } from "@/utils/gmx/lib/numbers";
import { USD_DECIMALS } from "@/utils/gmx/lib/legacy";

export default function useScAccountPerpsPosition() {
  const { chainId } = useChainId();
  const { scAccount } = useWallet();
  const { marketsInfoData, tokensData, pricesUpdatedAt } =
    useMarketsInfo(chainId);

  const { positionsInfoData, isLoading: isPositionsLoading } = usePositionsInfo(
    chainId,
    {
      marketsInfoData,
      tokensData,
      pricesUpdatedAt,
      showPnlInLeverage: true,
      account: scAccount,
    }
  );

  const [perpsPosition, setPerpsPosition] = useState<PositionInfo | null>();
  const [perpsBalance, setPerpsBalance] = useState<number>();

  useEffect(() => {
    if (
      !isPositionsLoading &&
      Object.values(positionsInfoData as any).length !== 0
    ) {
      const positionsArray: any = Object.values(positionsInfoData as any);

      const pnlInTotal = positionsArray.reduce((acc, prev) => {
        return acc + Number(Number(prev.pnl) / 10 ** 30);
      }, 0);

      const balanceInTotal = positionsArray.reduce((acc, prev) => {
        return acc + Number(prev.netValue) / 10 ** 30;
      }, 0);

      setPerpsBalance(balanceInTotal);

      setPerpsPosition({
        type: "Perps",
        numberPositions: positionsArray.length,
        totalValue: balanceInTotal,
        unPnL: pnlInTotal,
      });
    }
  }, [positionsInfoData, isPositionsLoading]);

  return { perpsBalance, perpsPosition };
}
