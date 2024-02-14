import React, { useMemo, useState } from "react";
import { Popover } from "@headlessui/react";
import cx from "classnames";
import groupBy from "lodash/groupBy";
import { FaChevronDown } from "react-icons/fa";
import { Token } from "../../../../utils/gmx/domain/tokens";
import SearchInput from "../SearchInput";
import TokenIcon from "../../common/TokenIcon/TokenIcon";
// import { t } from "@lingui/macro";
import { TradeFlags } from "../../../../utils/gmx/domain/synthetics/trade/useTradeFlags";
import {
  AvailableTokenOptions,
  TradeType,
} from "../../../../utils/gmx/domain/synthetics/trade";
import { getAvailableUsdLiquidityForPosition } from "../../../../utils/gmx/domain/synthetics/markets";
import { BigNumber } from "ethers";
import { formatUsd } from "../../../../utils/gmx/lib/numbers";
import { PositionsInfoData } from "../../../../utils/gmx/domain/synthetics/positions";
import { convertTokenAddress } from "../../../../utils/gmx/config/tokens";
import SearchBar from "@/components/Filters/SearchBar";

type TokenOption = Token & {
  maxLongLiquidity: BigNumber;
  maxShortLiquidity: BigNumber;
  marketTokenAddress: string;
  indexTokenAddress: string;
};

type Props = {
  chainId: number;
  selectedToken: Token | undefined;
  onSelectToken: (
    address: string,
    marketAddress?: string,
    tradeType?: TradeType
  ) => void;
  tradeFlags?: TradeFlags;
  options: Token[] | undefined;
  className?: string;
  avaialbleTokenOptions: AvailableTokenOptions;
  positionsInfo?: PositionsInfoData;
};

export default function ChartTokenSelector(props: Props) {
  const {
    chainId,
    options,
    selectedToken,
    onSelectToken,
    tradeFlags,
    avaialbleTokenOptions,
    positionsInfo,
  } = props;
  const { sortedAllMarkets } = avaialbleTokenOptions;
  const { isSwap, isLong, isShort } = tradeFlags || {};
  const [searchKeyword, setSearchKeyword] = useState("");

  const onSelect = (token: {
    indexTokenAddress: string;
    marketTokenAddress?: string;
    tradeType?: TradeType;
  }) => {
    onSelectToken(
      token.indexTokenAddress,
      token.marketTokenAddress,
      token.tradeType
    );
    setSearchKeyword("");
  };

  const filteredTokens: Token[] | undefined = options?.filter((item) => {
    return (
      item.name.toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1 ||
      item.symbol.toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1
    );
  });

  const groupedIndexMarkets = useMemo(() => {
    const marketsWithMaxReservedUsd = sortedAllMarkets.map((marketInfo) => {
      const maxLongLiquidity = getAvailableUsdLiquidityForPosition(
        marketInfo,
        true
      );
      const maxShortLiquidity = getAvailableUsdLiquidityForPosition(
        marketInfo,
        false
      );

      return {
        maxLongLiquidity: maxLongLiquidity.gt(0)
          ? maxLongLiquidity
          : BigNumber.from(0),
        maxShortLiquidity: maxShortLiquidity.gt(0)
          ? maxShortLiquidity
          : BigNumber.from(0),
        marketTokenAddress: marketInfo.marketTokenAddress,
        indexTokenAddress: marketInfo.indexTokenAddress,
      };
    });
    const groupedMarketsWithIndex: { [marketAddress: string]: TokenOption[] } =
      groupBy(
        marketsWithMaxReservedUsd as any,
        (market) => market.indexTokenAddress
      );

    return groupedMarketsWithIndex;
  }, [sortedAllMarkets]);

  function handleMarketSelect(
    token: Token,
    maxLongLiquidityPool: TokenOption,
    maxShortLiquidityPool: TokenOption
  ) {
    const tokenAddress = convertTokenAddress(chainId, token.address, "wrapped");

    if (tokenAddress === selectedToken?.address) return;

    if (tradeFlags?.isSwap) {
      onSelect({
        indexTokenAddress: token.address,
      });
      return;
    }

    const currentExistingPositions = Object.values(positionsInfo || {}).filter(
      (position) => {
        if (position.isLong === isLong) {
          return (
            convertTokenAddress(
              chainId,
              position.marketInfo.indexTokenAddress,
              "wrapped"
            ) === tokenAddress
          );
        }
        return false;
      }
    );

    let marketTokenAddress;
    const largestExistingPosition =
      Array.isArray(currentExistingPositions) && currentExistingPositions.length
        ? currentExistingPositions.reduce((max, current) =>
            max.sizeInUsd.gt(current.sizeInUsd) ? max : current
          )
        : undefined;

    if (largestExistingPosition) {
      marketTokenAddress =
        largestExistingPosition?.marketInfo.marketTokenAddress;
    } else {
      if (isLong) {
        marketTokenAddress = maxLongLiquidityPool?.marketTokenAddress;
      }

      if (isShort) {
        marketTokenAddress = maxShortLiquidityPool?.marketTokenAddress;
      }
    }

    onSelect({
      indexTokenAddress: token.address,
      marketTokenAddress,
    });
  }

  function getMaxLongShortLiquidityPool(token: Token) {
    const indexTokenAddress = token.isNative
      ? token.wrappedAddress
      : token.address;
    const currentMarkets = groupedIndexMarkets[indexTokenAddress!];
    const maxLongLiquidityPool = currentMarkets?.reduce((prev, current) => {
      if (!prev.maxLongLiquidity || !current.maxLongLiquidity) return current;
      return prev.maxLongLiquidity.gt(current.maxLongLiquidity)
        ? prev
        : current;
    });

    const maxShortLiquidityPool = currentMarkets?.reduce((prev, current) => {
      if (!prev.maxShortLiquidity || !current.maxShortLiquidity) return current;
      return prev.maxShortLiquidity.gt(current.maxShortLiquidity)
        ? prev
        : current;
    });
    return {
      maxLongLiquidityPool,
      maxShortLiquidityPool,
    };
  }

  const getInfo = (query: string) => {
    setSearchKeyword(query);
  };

  return (
    <Popover className="flex items-center relative">
      {({ open, close }) => {
        if (!open && searchKeyword.length > 0) setSearchKeyword("");
        return (
          <>
            <Popover.Button as="div">
              <button
                className={cx("flex items-center ", {
                  "chart-token-label--active": open,
                })}
              >
                {selectedToken && (
                  <span className="flex items-center">
                    <TokenIcon
                      className="chart-token-current-icon mx-2"
                      symbol={selectedToken.symbol}
                      displaySize={32}
                      importSize={24}
                    />
                    {selectedToken.symbol} {"/ USD"}
                  </span>
                )}
                <FaChevronDown fontSize={14} className="ml-2" />
              </button>
            </Popover.Button>

            <div className="absolute rounded-xl shadow-input bg-white top-[68px]">
              <Popover.Panel
                as="div"
                className="h-[370px] w-[540px] overflow-auto py-[24px]"
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

                <div className="px-[22px] pt-[12px]">
                  <table className="w-[500px]">
                    {filteredTokens && filteredTokens.length > 0 && (
                      <thead className="text-left">
                        <tr>
                          <th className="font-normal px-[20px]">Market</th>
                          <th className="font-normal px-[20px]">
                            {!isSwap && `LONG LIQ.`}
                          </th>
                          <th className="font-normal pl-[36px]">
                            {!isSwap && `SHORT LIQ.`}
                          </th>
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {filteredTokens?.map((token) => {
                        const { maxLongLiquidityPool, maxShortLiquidityPool } =
                          getMaxLongShortLiquidityPool(token);
                        return (
                          <Popover.Button
                            as="tr"
                            key={token.symbol}
                            className="hover:bg-gray-200 cursor-pointer"
                          >
                            <td
                              className="py-4 px-[20px] rounded-l-xl"
                              onClick={() =>
                                handleMarketSelect(
                                  token,
                                  maxLongLiquidityPool,
                                  maxShortLiquidityPool
                                )
                              }
                            >
                              <span className="flex items-center">
                                <TokenIcon
                                  className="ChartToken-list-icon mx-2"
                                  symbol={token.symbol}
                                  displaySize={32}
                                  importSize={40}
                                />
                                <span className="ml-3">
                                  {" "}
                                  {token.symbol} {!isSwap && "/ USD"}
                                </span>
                              </span>
                            </td>

                            <td
                              onClick={() => {
                                onSelect({
                                  indexTokenAddress: token.address,
                                  marketTokenAddress:
                                    maxLongLiquidityPool?.marketTokenAddress,
                                  tradeType: TradeType.Long,
                                });
                              }}
                            >
                              {!isSwap && maxLongLiquidityPool
                                ? formatUsd(
                                    maxLongLiquidityPool?.maxLongLiquidity
                                  )
                                : ""}
                            </td>
                            <td
                              onClick={() => {
                                onSelect({
                                  indexTokenAddress: token.address,
                                  marketTokenAddress:
                                    maxShortLiquidityPool?.marketTokenAddress,
                                  tradeType: TradeType.Short,
                                });
                              }}
                              className="pl-6 rounded-r-xl"
                            >
                              {!isSwap && maxShortLiquidityPool
                                ? formatUsd(
                                    maxShortLiquidityPool?.maxShortLiquidity
                                  )
                                : ""}
                            </td>
                          </Popover.Button>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Popover.Panel>
            </div>
          </>
        );
      }}
    </Popover>
  );
}
