import { useGlobalContext } from "@/context/FungiGlobalContext";
import { TokenInfo } from "@/domain/tokens/types";
import { getAllTokensWithBalances } from "@/domain/tokens/useInfoTokens";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import React, { useEffect, useState } from "react";

export default function useTokensWithBalance() {
  const { chainId, scAccount } = useWallet();
  const { alchemyClient } = useGlobalContext();
  const [tokensWithBalance, setTokensWithBalance] = useState<TokenInfo[]>([]);
  
  useEffect(() => {
    const fetchTokens = async () => {
      if (alchemyClient && chainId && scAccount) {
        const tokensInfo = await getAllTokensWithBalances(
          alchemyClient,
          chainId,
          scAccount
        );
        if (!tokensInfo) {
          return;
        }
        const tokensWithBalance = tokensInfo.filter((tokenData: any) => {
          return Number(tokenData.balance) !== 0;
        });
        setTokensWithBalance(tokensWithBalance);
      }
    };

    fetchTokens();
  }, [alchemyClient, chainId, scAccount]);

  return { tokensWithBalance };
}
