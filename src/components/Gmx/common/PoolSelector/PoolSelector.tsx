import {
  MarketInfo,
  MarketsInfoData,
  getMarketIndexName,
  getMarketPoolName,
} from "../../../../utils/gmx/domain/synthetics/markets";
import {
  TokensData,
  convertToUsd,
} from "../../../../utils/gmx/domain/synthetics/tokens";
import { BigNumber } from "ethers";
import {
  formatTokenAmount,
  formatUsd,
} from "../../../../utils/gmx/lib/numbers";
import { getByKey } from "../../../../utils/gmx/lib/objects";
import { useMemo, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Modal from "../Modal/Modal";
import { Dialog } from "@headlessui/react";
import TokenIcon from "../TokenIcon/TokenIcon";
import { getNormalizedTokenSymbol } from "../../../../utils/gmx/config/tokens";
import SearchBar from "@/components/Filters/SearchBar";

type Props = {
  label?: string;
  className?: string;
  selectedMarketAddress?: string;
  selectedIndexName?: string;
  markets: MarketInfo[];
  marketsInfoData?: MarketsInfoData;
  marketTokensData?: TokensData;
  disabled?: boolean;
  showBalances?: boolean;
  isSideMenu?: boolean;
  getMarketState?: (market: MarketInfo) => MarketState | undefined;
  onSelectMarket: (market: MarketInfo) => void;
  showAllPools?: boolean;
  showIndexIcon?: boolean;
};

type MarketState = {
  disabled?: boolean;
  message?: string;
};

type MarketOption = {
  indexName: string;
  poolName: string;
  name: string;
  marketInfo: MarketInfo;
  balance: BigNumber;
  balanceUsd: BigNumber;
  state?: MarketState;
};

export function PoolSelector({
  selectedMarketAddress,
  className,
  selectedIndexName,
  label,
  markets,
  isSideMenu,
  marketTokensData,
  showBalances,
  onSelectMarket,
  getMarketState,
  showAllPools = false,
  showIndexIcon = false,
}: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const getInfo = (query: string) => {
    setSearchKeyword(query);
  };

  const marketsOptions: MarketOption[] = useMemo(() => {
    const allMarkets = markets
      .filter(
        (market) =>
          !market.isDisabled &&
          (showAllPools || getMarketIndexName(market) === selectedIndexName)
      )
      .map((marketInfo) => {
        const indexName = getMarketIndexName(marketInfo);
        const poolName = getMarketPoolName(marketInfo);
        const marketToken = getByKey(
          marketTokensData,
          marketInfo.marketTokenAddress
        );
        const gmBalance = marketToken?.balance;
        const gmBalanceUsd = convertToUsd(
          marketToken?.balance,
          marketToken?.decimals,
          marketToken?.prices.minPrice
        );
        const state = getMarketState?.(marketInfo);

        return {
          indexName,
          poolName,
          name: marketInfo.name,
          marketInfo,
          balance: gmBalance || BigNumber.from(0),
          balanceUsd: gmBalanceUsd || BigNumber.from(0),
          state,
        };
      });
    const marketsWithBalance: MarketOption[] = [];
    const marketsWithoutBalance: MarketOption[] = [];

    for (const market of allMarkets) {
      if (market.balance.gt(0)) {
        marketsWithBalance.push(market);
      } else {
        marketsWithoutBalance.push(market);
      }
    }

    const sortedMartketsWithBalance = marketsWithBalance.sort((a, b) => {
      return b.balanceUsd?.gt(a.balanceUsd || 0) ? 1 : -1;
    });

    return [...sortedMartketsWithBalance, ...marketsWithoutBalance];
  }, [
    getMarketState,
    marketTokensData,
    markets,
    selectedIndexName,
    showAllPools,
  ]);

  const marketInfo = marketsOptions.find(
    (option) => option.marketInfo.marketTokenAddress === selectedMarketAddress
  )?.marketInfo;

  const lowercaseSearchKeyword = searchKeyword.toLowerCase();
  const filteredOptions = marketsOptions.filter((option) => {
    const name = option.name.toLowerCase();
    return name.includes(lowercaseSearchKeyword);
  });

  function onSelectOption(option: MarketOption) {
    onSelectMarket(option.marketInfo);
    setIsModalVisible(false);
  }

  const _handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredOptions.length > 0) {
      onSelectOption(filteredOptions[0]);
    }
  };

  function displayPoolLabel(marketInfo: MarketInfo | undefined) {
    if (!marketInfo) return "...";
    const name = showAllPools
      ? `GM: ${getMarketIndexName(marketInfo)}`
      : getMarketPoolName(marketInfo);

    if (filteredOptions?.length > 1) {
      return (
        <div className="flex" onClick={() => setIsModalVisible(true)}>
          {name ? name : "..."}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
      );
    }

    return <div>{name ? name : "..."}</div>;
  }

  return (
    //<div className={cx("TokenSelector", "MarketSelector", { "side-menu": isSideMenu }, className)}>
    <div>
      <Modal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        height="h-[440px]"
        headerContent={() => (
          <>
            <div className="text-start sm:mt-0 sm:text-left w-full">
              <Dialog.Title as="h3" className="text-2xl">
                Select Pool
              </Dialog.Title>
            </div>
            <SearchBar
              getInfo={getInfo}
              query={searchKeyword}
              classMain="rounded-xl text-black px-[22px] items-center w-full  outline-none placeholder:text-black bg-white flex shadow-input mt-[16px] mb-[24px]"
              placeholder={"Search Market"}
            />
          </>
        )}
      >
        <div className="TokenSelector-tokens">
          {filteredOptions.map((option, marketIndex) => {
            const {
              marketInfo,
              balance,
              balanceUsd,
              indexName,
              poolName,
              name,
              state = {},
            } = option;
            const { longToken, shortToken, indexToken } = marketInfo;

            const indexTokenImage = marketInfo.isSpotOnly
              ? getNormalizedTokenSymbol(longToken.symbol) +
                getNormalizedTokenSymbol(shortToken.symbol)
              : getNormalizedTokenSymbol(indexToken.symbol);

            const marketToken = getByKey(
              marketTokensData,
              marketInfo.marketTokenAddress
            );

            return (
              <div
                key={name}
                //className={cx("TokenSelector-token-row", { disabled: state.disabled })} //TODO fungi
                onClick={() => !state.disabled && onSelectOption(option)}
              >
                {/*state.disabled && state.message && (
                  <TooltipWithPortal
                    className="TokenSelector-tooltip"
                    handle={<div className="TokenSelector-tooltip-backing" />}
                    position={marketIndex < filteredOptions.length / 2 ? "center-bottom" : "center-top"}
                    disableHandleStyle
                    closeOnDoubleClick
                    fitHandleWidth
                    renderContent={() => state.message}
                  />
                )*/}
                <div className="hover:bg-gray-200 flex py-4 px-[20px] rounded-xl items-center justify-between">
                  <div className="flex items-center">
                    <div className="collaterals-logo">
                      {showAllPools ? (
                        <TokenIcon
                          symbol={indexTokenImage}
                          displaySize={40}
                          importSize={40}
                          className="mr-4"
                        />
                      ) : (
                        <>
                          <TokenIcon
                            symbol={longToken.symbol}
                            displaySize={40}
                            importSize={40}
                            className="mr-4"
                          />
                          {shortToken && (
                            <TokenIcon
                              symbol={shortToken.symbol}
                              displaySize={40}
                              importSize={40}
                              className="mr-4"
                            />
                          )}
                        </>
                      )}
                    </div>
                    <div className="Token-symbol">
                      <div className="Token-text">
                        {showAllPools ? (
                          <div className="lh-1 items-center">
                            <span>{indexName && indexName}</span>
                            <span className="subtext">
                              {poolName && `[${poolName}]`}
                            </span>
                          </div>
                        ) : (
                          <div className="Token-text">{poolName}</div>
                        )}
                      </div>
                    </div>{" "}
                  </div>
                  <div className="Token-balance">
                    {showBalances && balance && (
                      <div className="Token-text">
                        {balance.gt(0) &&
                          formatTokenAmount(
                            balance,
                            marketToken?.decimals,
                            "GM",
                            {
                              useCommas: true,
                            }
                          )}
                        {balance.eq(0) && "0"}
                      </div>
                    )}
                    <span className="text-accent">
                      {showBalances && balanceUsd && balanceUsd.gt(0) && (
                        <div>{formatUsd(balanceUsd)}</div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      {marketInfo && (
        <div className="flex">
          {showIndexIcon && (
            <TokenIcon
              className="mr-2"
              symbol={
                marketInfo.isSpotOnly
                  ? getNormalizedTokenSymbol(marketInfo.longToken.symbol) +
                    getNormalizedTokenSymbol(marketInfo.shortToken.symbol)
                  : marketInfo?.indexToken.symbol
              }
              importSize={40}
              displaySize={20}
            />
          )}
          {displayPoolLabel(marketInfo)}
        </div>
      )}
    </div>
  );
}
