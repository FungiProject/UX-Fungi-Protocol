import cx from "classnames";
import {
  MarketInfo,
  MarketsInfoData,
  getMarketIndexName,
} from "../../../../utils/gmx/domain/synthetics/markets";
import {
  TokensData,
  convertToUsd,
} from "../../../../utils/gmx/domain/synthetics/tokens";
import { BigNumber } from "ethers";
import { importImage } from "../../../../utils/gmx/lib/legacy";
import {
  formatTokenAmount,
  formatUsd,
} from "../../../../utils/gmx/lib/numbers";
import { getByKey } from "../../../../utils/gmx/lib/objects";
import { ReactNode, useMemo, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import Modal from "../../common/Modal/Modal";
import TooltipWithPortal from "../../common/Tooltip/TooltipWithPortal";
import SearchBar from "@/components/Filters/SearchBar";
import { Dialog } from "@headlessui/react";

type Props = {
  label?: string;
  className?: string;
  selectedIndexName?: string;
  markets: MarketInfo[];
  marketsInfoData?: MarketsInfoData;
  marketTokensData?: TokensData;
  disabled?: boolean;
  showBalances?: boolean;
  selectedMarketLabel?: ReactNode | string;
  isSideMenu?: boolean;
  getMarketState?: (market: MarketInfo) => MarketState | undefined;
  onSelectMarket: (indexName: string, market: MarketInfo) => void;
};

type MarketState = {
  disabled?: boolean;
  message?: string;
};

type MarketOption = {
  indexName: string;
  marketInfo: MarketInfo;
  balance: BigNumber;
  balanceUsd: BigNumber;
  state?: MarketState;
};

export function MarketSelector({
  selectedIndexName,
  className,
  selectedMarketLabel,
  label,
  markets,
  isSideMenu,
  marketTokensData,
  showBalances,
  onSelectMarket,
  getMarketState,
}: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const marketsOptions: MarketOption[] = useMemo(() => {
    const optionsByIndexName: { [indexName: string]: MarketOption } = {};

    markets
      .filter((market) => !market.isDisabled)
      .forEach((marketInfo) => {
        const indexName = getMarketIndexName(marketInfo);
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

        const option = optionsByIndexName[indexName];

        if (option) {
          option.balance = option.balance.add(gmBalance || BigNumber.from(0));
          option.balanceUsd = option.balanceUsd.add(
            gmBalanceUsd || BigNumber.from(0)
          );
        }

        optionsByIndexName[indexName] = optionsByIndexName[indexName] || {
          indexName,
          marketInfo,
          balance: gmBalance || BigNumber.from(0),
          balanceUsd: gmBalanceUsd || BigNumber.from(0),
          state,
        };
      });

    return Object.values(optionsByIndexName);
  }, [getMarketState, marketTokensData, markets]);

  const marketInfo = marketsOptions.find(
    (option) => option.indexName === selectedIndexName
  )?.marketInfo;

  const filteredOptions = marketsOptions.filter((option) => {
    return (
      option.indexName.toLowerCase().indexOf(searchKeyword.toLowerCase()) >
        -1 ||
      (!option.marketInfo.isSpotOnly &&
        option.marketInfo.indexToken.name
          .toLowerCase()
          .indexOf(searchKeyword.toLowerCase()) > -1)
    );
  });

  function onSelectOption(option: MarketOption) {
    onSelectMarket(option.indexName, option.marketInfo);
    setIsModalVisible(false);
  }

  const _handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredOptions.length > 0) {
      onSelectOption(filteredOptions[0]);
    }
  };

  const getInfo = (query: string) => {
    setSearchKeyword(query);
  };

  return (
    <div
      className={cx(
        "TokenSelector",
        "MarketSelector",
        { "side-menu": isSideMenu },
        className
      )}
    >
      <Modal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        headerContent={() => (
          <>
            <div className="text-start sm:mt-0 sm:text-left w-full">
              <Dialog.Title as="h3" className="text-2xl">
                Select Market
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
              state = {},
            } = option;
            const assetImage = importImage(
              `ic_${
                marketInfo.isSpotOnly
                  ? "swap"
                  : marketInfo.indexToken.symbol.toLowerCase()
              }_40.svg`
            );

            const marketToken = getByKey(
              marketTokensData,
              marketInfo.marketTokenAddress
            );

            return (
              <div
                key={indexName}
                className={`hover:bg-gray-200 flex py-4 px-[20px] rounded-xl items-center justify-between ${
                  state.disabled && "opacity-50"
                }`}
                onClick={() => !state.disabled && onSelectOption(option)}
              >
                {state.disabled && state.message && (
                  <TooltipWithPortal
                    className="TokenSelector-tooltip"
                    handle={<div className="TokenSelector-tooltip-backing" />}
                    position={
                      marketIndex < filteredOptions.length / 2
                        ? "center-bottom"
                        : "center-top"
                    }
                    disableHandleStyle
                    closeOnDoubleClick
                    fitHandleWidth
                    renderContent={() => state.message}
                  />
                )}
                <div className=" flex">
                  <img src={assetImage} alt={indexName} className="mr-3" />
                  <div className="Token-symbol">
                    <div className="Token-text">{indexName}</div>
                  </div>
                </div>
                <div className="Token-balance">
                  {showBalances && balance && (
                    <div className="Token-text">
                      {balance.gt(0) &&
                        formatTokenAmount(balance, marketToken?.decimals, "", {
                          useCommas: true,
                        })}
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
            );
          })}
        </div>
      </Modal>
      {selectedMarketLabel ? (
        <div
          className="flex items-center border-1 px-4 rounded-full py-1 justify-between"
          onClick={() => setIsModalVisible(true)}
        >
          <span>{selectedMarketLabel}</span>
          <BiChevronDown className="TokenSelector-caret" />
        </div>
      ) : (
        <div
          className="flex items-center border-1 px-4 rounded-full py-1 justify-between"
          onClick={() => setIsModalVisible(true)}
        >
          {marketInfo ? getMarketIndexName(marketInfo) : "..."}
          <BiChevronDown className="ml-2" />
        </div>
      )}
    </div>
  );
}
