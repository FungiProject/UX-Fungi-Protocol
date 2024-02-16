import React, { useMemo, useState, useCallback } from "react";
import { Popover } from "@headlessui/react";
import {
  MarketInfo,
  MarketTokensAPRData,
  MarketsInfoData,
  getMarketIndexName,
  getMarketPoolName,
  getMintableMarketTokens,
  getSellableMarketToken,
} from "../../../../utils/gmx/domain/synthetics/markets";
import { TokensData } from "../../../../utils/gmx/domain/synthetics/tokens";
import useSortedMarketsWithIndexToken from "../../../../utils/gmx/domain/synthetics/trade/useSortedMarketsWithIndexToken";
import { getByKey } from "../../../../utils/gmx/lib/objects";
import {
  formatTokenAmount,
  formatUsd,
} from "../../../../utils/gmx/lib/numbers";
import TokenIcon from "../../common/TokenIcon/TokenIcon";
import { useHistory } from "react-router-dom";
import { AprInfo } from "../AprInfo/AprInfo";
import { getNormalizedTokenSymbol } from "../../../../utils/gmx/config/tokens";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import SearchBar from "@/components/Filters/SearchBar";

type Props = {
  marketsInfoData?: MarketsInfoData;
  marketTokensData?: TokensData;
  marketsTokensAPRData?: MarketTokensAPRData;
  marketsTokensIncentiveAprData?: MarketTokensAPRData;
  currentMarketInfo?: MarketInfo;
};

export default function MarketTokenSelector(props: Props) {
  const {
    marketsTokensIncentiveAprData,
    marketsTokensAPRData,
    marketsInfoData,
    marketTokensData,
    currentMarketInfo,
  } = props;

  const { markets: sortedMarketsByIndexToken } = useSortedMarketsWithIndexToken(
    marketsInfoData,
    marketTokensData
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const history = useHistory();
  const indexName = currentMarketInfo && getMarketIndexName(currentMarketInfo);
  const poolName = currentMarketInfo && getMarketPoolName(currentMarketInfo);

  const router = useRouter();
  const searchParams = useSearchParams();

  const getInfo = (query: string) => {
    setSearchKeyword(query);
  };

  const filteredTokens = useMemo(() => {
    if (sortedMarketsByIndexToken.length < 1) {
      return [];
    }
    if (searchKeyword.length < 1) {
      return sortedMarketsByIndexToken;
    }

    return sortedMarketsByIndexToken.filter((market) => {
      const marketInfo = getByKey(marketsInfoData, market?.address)!;
      return (
        marketInfo.name.toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1
      );
    });
  }, [marketsInfoData, searchKeyword, sortedMarketsByIndexToken]);

  const filteredTokensInfo = useMemo(() => {
    return filteredTokens.map((market) => {
      const marketInfo = getByKey(marketsInfoData, market?.address)!;
      const mintableInfo = getMintableMarketTokens(marketInfo, market);
      const sellableInfo = getSellableMarketToken(marketInfo, market);
      const apr = getByKey(marketsTokensAPRData, market?.address);
      const incentiveApr = getByKey(
        marketsTokensIncentiveAprData,
        marketInfo?.marketTokenAddress
      );
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
  }, [
    filteredTokens,
    marketsInfoData,
    marketsTokensAPRData,
    marketsTokensIncentiveAprData,
  ]);

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  function handleSelectToken(marketTokenAddress: string) {
    console.log(marketTokenAddress);
    /*history.push({
      pathname: "/pools",
      search: `?market=${marketTokenAddress}`,
    });*/
    router.push("/" + "?" + createQueryString("market", marketTokenAddress));
  }

  return (
    <Popover>
      {({ open, close }) => {
        if (!open && searchKeyword.length > 0) setSearchKeyword("");
        if (!currentMarketInfo) return <></>;

        const { indexToken, longToken, shortToken } = currentMarketInfo;
        const iconName = currentMarketInfo?.isSpotOnly
          ? getNormalizedTokenSymbol(longToken.symbol) +
            getNormalizedTokenSymbol(shortToken.symbol)
          : indexToken.symbol;

        return (
          <div>
            <Popover.Button as="div">
              <button className={""}>
                <div className="inline-flex items-center">
                  <span className="flex items-stretch">
                    {currentMarketInfo && (
                      <>
                        <TokenIcon
                          className=""
                          symbol={iconName}
                          displaySize={32}
                          importSize={24}
                        />
                        <div className="ml-2">
                          <div>
                            <span>GM{indexName && `: ${indexName}`}</span>
                            <span className="text-xs ml-1">
                              {poolName && `[${poolName}]`}
                            </span>
                          </div>
                          <div className="text-left text-xs">
                            <span>GMX Market Tokens</span>
                          </div>
                        </div>
                      </>
                    )}
                  </span>
                  <FaChevronDown fontSize={14} className="ml-2" />
                </div>
              </button>
            </Popover.Button>
            <div className="absolute rounded-xl shadow-input bg-white mt-7">
              <Popover.Panel
                as="div"
                className="z-50 h-[500px] w-[700px] overflow-auto py-[24px]"
              >
                <div className="border-b-1 px-[42px]">
                  <h1 className="text-2xl">Select Market</h1>
                  <SearchBar
                    getInfo={getInfo}
                    query={searchKeyword}
                    classMain="rounded-xl text-black px-[22px] items-center w-full  outline-none placeholder:text-black bg-white flex shadow-input mt-[16px] mb-[24px]"
                    placeholder={"Search Market"}
                  />
                </div>

                <div className="px-[22px] pt-[12px] ">
                  <table className="w-[650px]">
                    {sortedMarketsByIndexToken.length > 0 && (
                      <thead className="text-left ">
                        <tr>
                          <th className="font-normal px-[20px]">MARKET</th>
                          <th className="pl-6 font-normal">Buyable</th>
                          <th className="pl-8 font-normal">Sellable</th>
                          <th className="pl-8 font-normal">APR</th>
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
                          const { indexToken, longToken, shortToken } =
                            marketInfo;
                          const iconName = marketInfo.isSpotOnly
                            ? getNormalizedTokenSymbol(longToken.symbol) +
                              getNormalizedTokenSymbol(shortToken.symbol)
                            : getNormalizedTokenSymbol(indexToken.symbol);
                          return (
                            <Popover.Button
                              as="tr"
                              key={market.address}
                              onClick={() => handleSelectToken(market.address)}
                              className="hover:bg-gray-200 cursor-pointer"
                            >
                              <td className="py-4 px-[20px] rounded-l-xl">
                                <span className="inline-items-center">
                                  {marketInfo && (
                                    <div className="flex items-center">
                                      <TokenIcon
                                        className=""
                                        symbol={iconName}
                                        displaySize={32}
                                        importSize={40}
                                      />
                                      <div className="items-center ml-3">
                                        <span>{indexName && indexName}</span>
                                        <span className="ml-1 text-xs">
                                          {poolName && `[${poolName}]`}
                                        </span>
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
                                {formatTokenAmount(
                                  sellableInfo?.totalAmount,
                                  market?.decimals,
                                  market?.symbol,
                                  {
                                    displayDecimals: 0,
                                    useCommas: true,
                                  }
                                )}
                              </td>
                              <td className="pl-6 rounded-r-xl">
                                {
                                  <AprInfo
                                    apr={apr}
                                    incentiveApr={incentiveApr}
                                    showTooltip={false}
                                  />
                                }
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
