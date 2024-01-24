import { getNormalizedTokenSymbol } from "../config/tokens";
import { chainlinkClient } from "../lib/subgraph/clients";
import { gql } from "@apollo/client";
import { CHART_PERIODS } from "../lib/legacy";

const FEED_ID_MAP = {
  BTC_USD: "0xae74faa92cb67a95ebcab07358bc222e33a34da7",
  ETH_USD: "0x37bc7498f4ff12c19678ee8fe19d713b87f6a9e6",
  BNB_USD: "0xc45ebd0f901ba6b2b8c7e70b717778f055ef5e6d",
  LINK_USD: "0xdfd03bfc3465107ce570a0397b247f546a42d0fa",
  UNI_USD: "0x68577f915131087199fe48913d8b416b3984fd38",
  SUSHI_USD: "0x7213536a36094cd8a768a5e45203ec286cba2d74",
  AVAX_USD: "0x0fc3657899693648bba4dbd2d8b33b82e875105d",
  AAVE_USD: "0xe3f0dede4b499c07e12475087ab1a084b5f93bc0",
  YFI_USD: "0x8a4d74003870064d41d4f84940550911fbfccf04",
  SPELL_USD: "0x8640b23468815902e011948f3ab173e1e83f9879",
};

export const timezoneOffset = -new Date().getTimezoneOffset() * 60;

export function getChainlinkChartPricesFromGraph(tokenSymbol, period) {
  tokenSymbol = getNormalizedTokenSymbol(tokenSymbol);
  const marketName = tokenSymbol + "_USD";
  const feedId = FEED_ID_MAP[marketName];
  if (!feedId) {
    throw new Error(`undefined marketName ${marketName}`);
  }

  const PER_CHUNK = 1000;
  const CHUNKS_TOTAL = 6;
  const requests: any[] = [];
  for (let i = 0; i < CHUNKS_TOTAL; i++) {
    const query = gql(`{
      rounds(
        first: ${PER_CHUNK},
        skip: ${i * PER_CHUNK},
        orderBy: unixTimestamp,
        orderDirection: desc,
        where: {feed: "${feedId}"}
      ) {
        unixTimestamp,
        value
      }
    }`);
    requests.push(chainlinkClient.query({ query }));
  }

  return Promise.all(requests)
    .then((chunks) => {
      let prices: any[] = [];
      const uniqTs = new Set();
      chunks.forEach((chunk) => {
        chunk.data.rounds.forEach((item) => {
          if (uniqTs.has(item.unixTimestamp)) {
            return;
          }

          uniqTs.add(item.unixTimestamp);
          prices.push([item.unixTimestamp, Number(item.value) / 1e8]);
        });
      });

      prices.sort(([timeA], [timeB]) => timeA - timeB);
      prices = getCandlesFromPrices(prices, period);
      return prices;
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
}

function getCandlesFromPrices(prices, period) {
  const periodTime = CHART_PERIODS[period];

  if (prices.length < 2) {
    return [];
  }

  const candles: any[] = [];
  const first = prices[0];
  let prevTsGroup = Math.floor(first[0] / periodTime) * periodTime;
  let prevPrice = first[1];
  let o = prevPrice;
  let h = prevPrice;
  let l = prevPrice;
  let c = prevPrice;
  for (let i = 1; i < prices.length; i++) {
    const [ts, price] = prices[i];
    const tsGroup = Math.floor(ts / periodTime) * periodTime;
    if (prevTsGroup !== tsGroup) {
      candles.push({ t: prevTsGroup + timezoneOffset, o, h, l, c });
      o = c;
      h = Math.max(o, c);
      l = Math.min(o, c);
    }
    c = price;
    h = Math.max(h, price);
    l = Math.min(l, price);
    prevTsGroup = tsGroup;
  }

  return candles.map(({ t: time, o: open, c: close, h: high, l: low }) => ({
    time,
    open,
    close,
    high,
    low,
  }));
}
