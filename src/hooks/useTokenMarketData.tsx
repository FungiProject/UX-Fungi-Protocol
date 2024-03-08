import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/FungiContextProvider";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { TokenInfo, TokenData } from "@/domain/tokens/types";
import { getTokenMarketData } from "@/domain/tokens/useMarketData";

export function useTokenMarketData(tokensInfo: TokenInfo[]) {
  const { chainId, scAccount } = useWallet();
  const [tokenMarketsData, setTokensMarketData] = useState<TokenData[] | []>(
    []
  );
  const { alchemyClient } = useGlobalContext();

  useEffect(() => {
    fetchData(tokensInfo);
  }, [alchemyClient, chainId, scAccount]);

  const fetchData = async (tokensInfo: TokenInfo[]) => {
    if (
      alchemyClient &&
      chainId &&
      scAccount &&
      tokensInfo &&
      tokensInfo.length > 0
    ) {
      const tokensData = await getTokenMarketData(chainId, tokensInfo);
      if (!tokensData) {
        return;
      }
      setTokensMarketData(tokensData);
    }
  };

  return { tokenMarketsData, fetchData };
}
