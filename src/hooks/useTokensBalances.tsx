import { useGlobalContext } from "@/context/FungiContextProvider";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import useSWR from "swr";
import { getTokenBalances } from "@/domain/tokens/useBalances";

// My balance, fetch each 10 sec
export function useTokenBalances() {
  const { chainId, scAccount } = useWallet();
  const { alchemyClient } = useGlobalContext();
  const { data: tokensBalances } = useSWR(
    ["tokenBalancesInfo", chainId, scAccount],
    () => getTokenBalances(alchemyClient, chainId, scAccount || ""),
    {
      refreshInterval: 10000,
    }
  );

  return { tokensBalances };
}
