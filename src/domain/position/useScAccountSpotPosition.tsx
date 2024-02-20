import React, { useEffect, useState } from "react";
import useTokensWithBalance from "../../hooks/useTokensWithBalance";
import { PositionInfo } from "@/domain/position/types";
import { TokenInfo } from "../tokens/types";

export default function useScAccountSpotPosition() {
  const { tokensWithBalance } = useTokensWithBalance();
  const [spotPosition, setSpotPosition] = useState<PositionInfo | null>();
  const [spotBalance, setSpotBalance] = useState<number>();
  const [totalCash, setTotalCash] = useState<number>();

  const cashTokensSymbols = ["USDC", "USDC.e", "DAI", "USDT"];
  useEffect(() => {
    if (tokensWithBalance.length !== 0) {
      const balanceInTotal = tokensWithBalance.reduce((acc, prev) => {
        return (
          acc +
          Number(
            (Number(prev.balance) / 10 ** Number(prev.decimals)) *
              Number(prev.priceUSD)
          )
        );
      }, 0);

      const cashTokens = tokensWithBalance.filter((token: TokenInfo) => {
        return cashTokensSymbols.includes(token.symbol);
      });

      if (cashTokens.length !== 0) {
        const cashInTotal = cashTokens.reduce((acc, prev) => {
          return (
            acc +
            Number(
              (Number(prev.balance) / 10 ** Number(prev.decimals)) *
                Number(prev.priceUSD)
            )
          );
        }, 0);
        setTotalCash(cashInTotal);
      } else {
        setTotalCash(0);
      }

      setSpotBalance(balanceInTotal);

      setSpotPosition({
        type: "Spot",
        numberPositions: tokensWithBalance.length,
        totalValue: balanceInTotal,
        unPnL: "Coming Soon",
      });
    }
  }, [tokensWithBalance]);

  return { spotBalance, spotPosition, totalCash };
}
