import { Alchemy } from "alchemy-sdk";
import { TokenInfo } from "./types";
import { getTokenBalancesAlchemy } from "@/lib/alchemy/alchemyCalls";
import { fillCoinGeckoTokenId } from "./useMarketData";
import { TokenBalance } from "alchemy-sdk";
import { BigNumber, ethers } from "ethers";
import { getLifiTokens } from "@/lib/lifi/getLifiTokens";

/**
 * Retrieves information for all LifI tokens with balances for the specified address on the given chain.
 *
 * This function fetches token balances from Alchemy API for the specified `address` on the specified `chainId`.
 * It then generates an array of TokenInfo objects representing LifI tokens, filling in the balance for tokens owned by the provided address.
 *
 * @param {Alchemy} alchemyClient - The AlchemyClient instance used to make API requests.
 * @param {number} chainId - The identifier of the blockchain chain.
 * @param {string} address - The address for which to retrieve token balances.
 * @returns {Promise<TokenInfo[] | undefined>} A Promise that resolves to an array of TokenInfo objects representing LifI tokens with balances for the specified address, or undefined if the balance data is unavailable.
 */
export async function getAllTokensWithBalances(
  alchemyClient: Alchemy,
  chainId: number,
  address: string
) {
  const balances = await getTokenBalancesAlchemy(
    alchemyClient,
    address
  );
  if (!balances) return;
  const tokens = await getLifiTokensWithBalance(chainId, balances);
  fillCoinGeckoTokenId(chainId, tokens);
  return tokens;
}

export const getLifiTokensWithBalance = async (
  chainId: number,
  tokensBalance: TokenBalance[]
): Promise<TokenInfo[]> => {
  const tokensWithBalance: TokenInfo[] = [];
  const tokensWithoutBalance: TokenInfo[] = [];

  // Extraer tokens con balance y asignar sus balances
  for (const token of await getLifiTokens(chainId)) {
    const matchingBalance = tokensBalance.find(
      (tb) => tb.contractAddress.toLowerCase() === token.address.toLowerCase()
    );
    token.balance = matchingBalance
      ? BigNumber.from(matchingBalance.tokenBalance)
      : BigNumber.from(0);

    if (matchingBalance) {
      tokensWithBalance.push(token);
    } else {
      tokensWithoutBalance.push(token);
    }
  }

  // Ordenar los tokens con balance
  tokensWithBalance.sort((a, b) => {
    const aBalance = a.balance
      ? parseInt(ethers.utils.formatUnits(a.balance, a.decimals))
      : 0;
    const bBalance = b.balance
      ? parseInt(ethers.utils.formatUnits(b.balance, b.decimals))
      : 0;
    return bBalance - aBalance;
  });

  return [...tokensWithBalance, ...tokensWithoutBalance];
};
