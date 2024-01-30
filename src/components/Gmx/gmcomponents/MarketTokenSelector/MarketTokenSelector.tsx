import React, { useMemo, useState, useCallback } from "react";
import { Popover } from "@headlessui/react";
//import cx from "classnames";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
//import SearchInput from "components/SearchInput/SearchInput";
import {
  MarketInfo,
  MarketTokensAPRData,
  MarketsInfoData,
  getMarketIndexName,
  getMarketPoolName,
  getMintableMarketTokens,
  getSellableMarketToken,
} from "../../domain/synthetics/markets";
import { TokensData } from "../../domain/synthetics/tokens";
import useSortedMarketsWithIndexToken from "../../domain/synthetics/trade/useSortedMarketsWithIndexToken";
import { getByKey } from "../../lib/objects";
import { formatTokenAmount, formatUsd } from "../../lib/numbers";
import TokenIcon from "../TokenIcon";
import { useHistory } from "react-router-dom";
import { AprInfo } from "../AprInfo/AprInfo";
import { getNormalizedTokenSymbol } from "../../config/tokens";
import { useRouter } from 'next/router'
import { useSearchParams } from "next/navigation";

type Props = {
  marketsInfoData?: MarketsInfoData;
  marketTokensData?: TokensData;
  marketsTokensAPRData?: MarketTokensAPRData;
  marketsTokensIncentiveAprData?: MarketTokensAPRData;
  currentMarketInfo?: MarketInfo;
};

export default function MarketTokenSelector(props: Props) {
  const { marketsTokensIncentiveAprData, marketsTokensAPRData, marketsInfoData, marketTokensData, currentMarketInfo } =
    props;
  const { markets: sortedMarketsByIndexToken } = useSortedMarketsWithIndexToken(marketsInfoData, marketTokensData);
  const [searchKeyword, setSearchKeyword] = useState("");
  const history = useHistory();
  const indexName = currentMarketInfo && getMarketIndexName(currentMarketInfo);
  const poolName = currentMarketInfo && getMarketPoolName(currentMarketInfo);

  const router = useRouter()
  const searchParams = useSearchParams()

  const filteredTokens = useMemo(() => {
    if (sortedMarketsByIndexToken.length < 1) {
      return [];
    }
    if (searchKeyword.length < 1) {
      return sortedMarketsByIndexToken;
    }

    return sortedMarketsByIndexToken.filter((market) => {
      const marketInfo = getByKey(marketsInfoData, market?.address)!;
      return marketInfo.name.toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1;
    });
  }, [marketsInfoData, searchKeyword, sortedMarketsByIndexToken]);

  const filteredTokensInfo = useMemo(() => {
    return filteredTokens.map((market) => {
      const marketInfo = getByKey(marketsInfoData, market?.address)!;
      const mintableInfo = getMintableMarketTokens(marketInfo, market);
      const sellableInfo = getSellableMarketToken(marketInfo, market);
      const apr = getByKey(marketsTokensAPRData, market?.address);
      const incentiveApr = getByKey(marketsTokensIncentiveAprData, marketInfo?.marketTokenAddress);
      const indexName = getMarketIndexName(marketInfo);
      const poolName = getMarketPoolName(marketInfo);
      return {
        market,
        mintableInfo,
        sellableInfo,
        marketInfo,
        indexName,
        poolName,
        apr,
        incentiveApr,
      };
    });
  }, [filteredTokens, marketsInfoData, marketsTokensAPRData, marketsTokensIncentiveAprData]);


  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  function handleSelectToken(marketTokenAddress: string) {
    console.log(marketTokenAddress)
    /*history.push({
      pathname: "/pools",
      search: `?market=${marketTokenAddress}`,
    });*/
    router.push("/" + '?' + createQueryString('market', marketTokenAddress))
  }

  return (
    <Popover>
      {({ open, close }) => {
        if (!open && searchKeyword.length > 0) setSearchKeyword("");
        if (!currentMarketInfo) return <></>;

        const { indexToken, longToken, shortToken } = currentMarketInfo;
        const iconName = currentMarketInfo?.isSpotOnly
          ? getNormalizedTokenSymbol(longToken.symbol) + getNormalizedTokenSymbol(shortToken.symbol)
          : indexToken.symbol;

        return (
          <div>
            <Popover.Button as="div">
              <button className={''}>
                <div className="inline-flex items-center">
                  <span className="flex items-stretch">
                    {currentMarketInfo && (
                      <>
                        <TokenIcon
                          className=""
                          symbol={iconName}
                          displaySize={30}
                          importSize={40}
                        />
                        <div className="ml-2">
                          <div>
                            <span>GM{indexName && `: ${indexName}`}</span>
                            <span className="text-xs ml-1">{poolName && `[${poolName}]`}</span>
                          </div>
                          <div className="text-left text-xs"><span>GMX Market Tokens</span></div>
                        </div>
                      </>
                    )}
                  </span>
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-black-400" aria-hidden="true" />
                </div>
              </button>
            </Popover.Button>
            <div className="chart-token-menu">
              <Popover.Panel as="div" className="menu-items chart-token-menu-items">
                {/*<SearchInput
                  className="m-md"
                  value={searchKeyword}
                  setValue={({ target }) => setSearchKeyword(target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredTokens.length > 0) {
                      handleSelectToken(filteredTokens[0].address);
                      close();
                    }
                  }}
                  placeholder="Search Market"
                />*/}
                <div className="divider" />
                <div>
                  <table>
                    {sortedMarketsByIndexToken.length > 0 && (
                      <thead className="text-left">
                        <tr>
                          <th>MARKET</th>
                          <th className="pl-3">BUYABLE</th>
                          <th className="pl-3">SELLABLE</th>
                          <th className="pl-6">APR</th>
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {filteredTokensInfo.map(
                        ({
                          market,
                          mintableInfo,
                          sellableInfo,
                          apr,
                          incentiveApr,
                          marketInfo,
                          poolName,
                          indexName,
                        }) => {
                          const { indexToken, longToken, shortToken } = marketInfo;
                          const iconName = marketInfo.isSpotOnly
                            ? getNormalizedTokenSymbol(longToken.symbol) + getNormalizedTokenSymbol(shortToken.symbol)
                            : getNormalizedTokenSymbol(indexToken.symbol);
                          return (
                            <Popover.Button
                              as="tr"
                              key={market.address}
                              onClick={() => handleSelectToken(market.address)}
                            >
                              <td className="py-2">
                                <span className="inline-items-center">
                                  {marketInfo && (
                                    <div className="flex">
                                      <TokenIcon
                                        className="ChartToken-list-icon"
                                        symbol={iconName}
                                        displaySize={16}
                                        importSize={40}
                                      />
                                      <div className="items-center ml-3">
                                        <span>{indexName && indexName}</span>
                                        <span className="ml-1 text-xs">{poolName && `[${poolName}]`}</span>
                                      </div>
                                    </div>
                                  )}
                                </span>
                              </td>
                              <td className="pl-3">
                                {formatUsd(mintableInfo?.mintableUsd, {
                                  displayDecimals: 0,
                                  fallbackToZero: true,
                                })}
                              </td>
                              <td className="pl-3">
                                {formatTokenAmount(sellableInfo?.totalAmount, market?.decimals, market?.symbol, {
                                  displayDecimals: 0,
                                  useCommas: true,
                                })}
                              </td>
                              <td className="pl-6">
                                {<AprInfo apr={apr} incentiveApr={incentiveApr} showTooltip={false} />}
                              </td>
                          
                            </Popover.Button>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </Popover.Panel>
            </div>
          </div>
        );
      }}
    </Popover>
  );
}
