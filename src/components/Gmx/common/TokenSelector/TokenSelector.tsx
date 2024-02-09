import React, { useState, useEffect, ReactNode, useMemo } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Dialog } from "@headlessui/react";
import {
  bigNumberify,
  expandDecimals,
  formatAmount,
} from "../../../../utils/gmx/lib/numbers";
import { getToken } from "../../../../utils/gmx/config/tokens";
import {
  InfoTokens,
  Token,
  TokenInfo,
} from "../../../../utils/gmx/domain/tokens";
import { BigNumber } from "ethers";
import { convertToUsd } from "../../../../utils/gmx/domain/tokens";
import TokenIcon from "../TokenIcon/TokenIcon";
import Modal from "../Modal/Modal";
import SearchBar from "@/components/Filters/SearchBar";

type TokenState = {
  disabled?: boolean;
  message?: string;
};

type Props = {
  chainId: number;
  label?: string;
  className?: string;
  tokenAddress: string;
  tokens: Token[];
  infoTokens?: InfoTokens;
  showMintingCap?: boolean;
  mintingCap?: BigNumber;
  disabled?: boolean;
  selectedTokenLabel?: ReactNode | string;
  showBalances?: boolean;
  showTokenImgInDropdown?: boolean;
  showSymbolImage?: boolean;
  showNewCaret?: boolean;
  getTokenState?: (info: TokenInfo) => TokenState | undefined;
  disableBodyScrollLock?: boolean;
  onSelectToken: (token: Token) => void;
  extendedSortSequence?: string[] | undefined;
  height?: string;
};

export default function TokenSelector(props: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  let tokenInfo: TokenInfo | undefined;

  try {
    tokenInfo = getToken(props.chainId, props.tokenAddress);
  } catch (e) {
    // ...ignore unsupported tokens
  }

  const {
    tokens,
    mintingCap,
    infoTokens,
    showMintingCap,
    disabled,
    selectedTokenLabel,
    showBalances = true,
    showTokenImgInDropdown = false,
    showSymbolImage = false,
    showNewCaret = false,
    getTokenState = () => ({ disabled: false, message: null }),
    extendedSortSequence,
    className,
    height,
  } = props;

  const visibleTokens = tokens.filter((t) => t && !t.isTempHidden);

  const onSelectToken = (token) => {
    setIsModalVisible(false);
    props.onSelectToken(token);
  };

  useEffect(() => {
    if (isModalVisible) {
      setSearchKeyword("");
    }
  }, [isModalVisible]);

  const getInfo = (query: string) => {
    setSearchKeyword(query);
  };

  const filteredTokens = visibleTokens.filter((item) => {
    return (
      item.name.toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1 ||
      item.symbol.toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1
    );
  });

  const sortedFilteredTokens = useMemo(() => {
    const tokensWithBalance: Token[] = [];
    const tokensWithoutBalance: Token[] = showBalances ? [] : filteredTokens;

    for (const token of filteredTokens) {
      const info = infoTokens?.[token.address];
      if (showBalances) {
        if (info?.balance?.gt(0)) {
          tokensWithBalance.push(token);
        } else {
          tokensWithoutBalance.push(token);
        }
      }
    }

    const sortedTokensWithBalance = tokensWithBalance.sort((a, b) => {
      const aInfo = infoTokens?.[a.address];
      const bInfo = infoTokens?.[b.address];

      if (!aInfo || !bInfo) return 0;

      if (
        aInfo?.balance &&
        bInfo?.balance &&
        aInfo?.maxPrice &&
        bInfo?.maxPrice
      ) {
        const aBalanceUsd = convertToUsd(
          aInfo.balance,
          a.decimals,
          aInfo.minPrice
        );
        const bBalanceUsd = convertToUsd(
          bInfo.balance,
          b.decimals,
          bInfo.minPrice
        );

        return bBalanceUsd?.sub(aBalanceUsd || 0).gt(0) ? 1 : -1;
      }
      return 0;
    });

    const sortedTokensWithoutBalance = tokensWithoutBalance.sort((a, b) => {
      const aInfo = infoTokens?.[a.address];
      const bInfo = infoTokens?.[b.address];

      if (!aInfo || !bInfo) return 0;

      if (extendedSortSequence) {
        // making sure to use the wrapped address if it exists in the extended sort sequence
        const aAddress =
          aInfo.wrappedAddress &&
          extendedSortSequence.includes(aInfo.wrappedAddress)
            ? aInfo.wrappedAddress
            : aInfo.address;

        const bAddress =
          bInfo.wrappedAddress &&
          extendedSortSequence.includes(bInfo.wrappedAddress)
            ? bInfo.wrappedAddress
            : bInfo.address;

        return (
          extendedSortSequence.indexOf(aAddress) -
          extendedSortSequence.indexOf(bAddress)
        );
      }

      return 0;
    });

    return [...sortedTokensWithBalance, ...sortedTokensWithoutBalance];
  }, [filteredTokens, infoTokens, extendedSortSequence, showBalances]);

  const _handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredTokens.length > 0) {
      onSelectToken(filteredTokens[0]);
    }
  };

  if (!tokenInfo) {
    return null;
  }

  return (
    <div onClick={(event) => event.stopPropagation()} className={className}>
      <Modal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        height={height ? height : "h-fit"}
        headerContent={() => (
          <>
            <div className="text-start sm:mt-0 sm:text-left w-full">
              <Dialog.Title as="h3" className="text-2xl">
                Select Token
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
        <div>
          {sortedFilteredTokens.map((token, tokenIndex) => {
            let info = infoTokens?.[token.address] || ({} as TokenInfo);

            let mintAmount;
            let balance = info.balance;
            if (showMintingCap && mintingCap && info.usdgAmount) {
              mintAmount = mintingCap.sub(info.usdgAmount);
            }
            if (mintAmount && mintAmount.lt(0)) {
              mintAmount = bigNumberify(0);
            }
            let balanceUsd;
            if (balance && info.maxPrice) {
              balanceUsd = balance
                .mul(info.maxPrice)
                .div(expandDecimals(1, token.decimals));
            }

            const tokenState = getTokenState(info) || {};

            return (
              <div
                key={token.address}
                className={"flex items-center justify-between "}
                onClick={() => !tokenState.disabled && onSelectToken(token)}
              >
                {tokenState.disabled && tokenState.message && (
                  <>
                    Disabled?
                    {/*<TooltipWithPortal  TODO fungi
                                        className="TokenSelector-tooltip"
                                        handle={<div className="TokenSelector-tooltip-backing" />}
                                        position={tokenIndex < filteredTokens.length / 2 ? "center-bottom" : "center-top"}
                                        disableHandleStyle
                                        closeOnDoubleClick
                                        fitHandleWidth
                                        renderContent={() => tokenState.message}
                                    />*/}
                  </>
                )}
                <div className="hover:bg-gray-200 flex py-4 w-full rounded-xl flex justify-between items-center px-[20px]">
                  <div className="flex">
                    {showTokenImgInDropdown && (
                      <TokenIcon
                        symbol={token.symbol}
                        className="mr-4"
                        displaySize={40}
                        importSize={40}
                      />
                    )}
                    <div className="Token-symbol">
                      <div className="Token-text">{token.symbol}</div>
                      <span className="text-accent">{token.name}</span>
                    </div>
                  </div>
                  <div className="Token-balance">
                    {showBalances && balance && (
                      <div className="Token-text">
                        {balance.gt(0) &&
                          formatAmount(balance, token.decimals, 4, true)}
                        {balance.eq(0) && "0"}
                      </div>
                    )}
                    <span className="text-accent">
                      {mintAmount && (
                        <div>
                          Mintable:{" "}
                          {formatAmount(mintAmount, token.decimals, 2, true)}{" "}
                          USDG
                        </div>
                      )}
                      {showMintingCap && !mintAmount && <div>-</div>}
                      {!showMintingCap &&
                        showBalances &&
                        balanceUsd &&
                        balanceUsd.gt(0) && (
                          <div>${formatAmount(balanceUsd, 30, 2, true)}</div>
                        )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      {selectedTokenLabel ? (
        <div
          className="TokenSelector-box "
          onClick={() => setIsModalVisible(true)}
        >
          {selectedTokenLabel}
          {!showNewCaret && (
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          )}
        </div>
      ) : (
        <div
          className="flex justify-between "
          onClick={() => setIsModalVisible(true)}
        >
          <span className="flex">
            {showSymbolImage && (
              <TokenIcon
                className="mx-3"
                symbol={tokenInfo.symbol}
                importSize={24}
                displaySize={20}
              />
            )}
            <span className="Token-symbol-text">{tokenInfo.symbol}</span>
          </span>
          {showNewCaret && (
            <img
              src={""}
              alt="Dropdown Icon"
              className="TokenSelector-box-caret"
            />
          )}
          {!showNewCaret && (
            <ChevronDownIcon className="-mr-1 h-5 w-5" aria-hidden="true" />
          )}
        </div>
      )}
    </div>
  );
}
