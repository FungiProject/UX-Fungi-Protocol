import axios from "axios";
import { CoinGeckoTokenMarketData } from "./types";

export async function getTokensMarketData(
  coingeckoIds: string[]
): Promise<CoinGeckoTokenMarketData[]> {
  try {
    const idsParam = coingeckoIds.join(",");
    const encodedIdsParam = encodeURIComponent(idsParam);

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodedIdsParam}&order=market_cap_desc&per_page=${idsParam.length}&page=1&sparkline=false&locale=en`
    );

    return response.data;
  } catch (error) {
    return [];
  }
}
