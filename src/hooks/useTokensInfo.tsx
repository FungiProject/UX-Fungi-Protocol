import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/FungiGlobalContext";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { TokenInfo } from "@/domain/tokens/types";
import { getAllTokensWithBalances } from "@/domain/tokens/useInfoTokens";

/**
 * Custom React hook that retrieves information for all tokens supported by LifI and fills in the balance for tokens owned by the provided `scAccount`.
 *
 * This hook fetches token information including balance for the specified `scAccount` on the specified `chainId` using the provided `alchemyClient`.
 *
 * @returns {TokenInfo[]} tokens - An array of TokenInfo objects representing the supported tokens and their balances for the `scAccount`.
 */
export function useTokensInfo() {
  const { chainId, scAccount } = useWallet();
  const { alchemyClient } = useGlobalContext();
  const [tokens, setTokens] = useState<TokenInfo[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (alchemyClient && chainId && scAccount) {
        const tokensInfo = await getAllTokensWithBalances(
          alchemyClient,
          chainId,
          scAccount
        );
        if (!tokensInfo) {
          return;
        }
        setTokens(tokensInfo);
      }
    };
    fetchData();
  }, [alchemyClient, chainId, scAccount]);

  return { tokens };
}
