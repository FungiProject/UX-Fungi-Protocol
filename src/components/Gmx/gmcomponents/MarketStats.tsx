import {
  TokenData,
  TokensData,
  convertToUsd,
  convertToTokenAmount,
} from "../domain/synthetics/tokens";
import {
  MarketsInfoData,
  MarketInfo,
  MarketTokensAPRData,
  getMintableMarketTokens,
  getSellableMarketToken,
  getPoolUsdWithoutPnl,
} from "../domain/synthetics/markets";
import MarketTokenSelector from "./MarketTokenSelector/MarketTokenSelector";
import { CardRow } from "./CardRow";
import {
  getMarketIndexName,
  getMarketPoolName,
} from "../domain/synthetics/markets";
import {
  formatUsd,
  formatTokenAmountWithUsd,
  formatTokenAmount,
} from "../lib/numbers";
import { BigNumber } from "ethers";
import { getByKey } from "../lib/objects";
import { AprInfo } from "./AprInfo/AprInfo";
import Tooltip from "./Tooltip/Tooltip";
import { getBridgingOptionsForToken } from "../config/bridging";
import { useChainId } from "../lib/chains";
import StatsTooltipRow from "./StatsTooltipRow";
import BridgingInfo from "./BridgingInfo";

type Props = {
  marketsInfoData?: MarketsInfoData;
  marketTokensData?: TokensData;
  marketInfo?: MarketInfo;
  marketToken?: TokenData;
  marketsTokensAPRData: MarketTokensAPRData | undefined;
  marketsTokensIncentiveAprData: MarketTokensAPRData | undefined;
};

export function MarketStats(p: Props) {
  const {
    marketInfo,
    marketToken,
    marketsTokensAPRData,
    marketsInfoData,
    marketTokensData,
    marketsTokensIncentiveAprData,
  } = p;

  const { chainId } = useChainId();
  const marketPrice = marketToken?.prices?.maxPrice;
  const marketBalance = marketToken?.balance;
  const marketBalanceUsd = convertToUsd(
    marketBalance,
    marketToken?.decimals,
    marketPrice
  );
  const indexName = marketInfo && getMarketIndexName(marketInfo);
  const poolName = marketInfo && getMarketPoolName(marketInfo);
  const apr = getByKey(marketsTokensAPRData, marketInfo?.marketTokenAddress);
  const incentiveApr = getByKey(
    marketsTokensIncentiveAprData,
    marketInfo?.marketTokenAddress
  );
  const marketTotalSupply = marketToken?.totalSupply;
  const marketTotalSupplyUsd = convertToUsd(
    marketTotalSupply,
    marketToken?.decimals,
    marketPrice
  );
  const mintableInfo =
    marketInfo && marketToken
      ? getMintableMarketTokens(marketInfo, marketToken)
      : undefined;
  const sellableInfo =
    marketInfo && marketToken
      ? getSellableMarketToken(marketInfo, marketToken)
      : undefined;
  const { longToken, shortToken, longPoolAmount, shortPoolAmount } =
    marketInfo || {};
  const maxLongSellableTokenAmount = convertToTokenAmount(
    sellableInfo?.maxLongSellableUsd,
    longToken?.decimals,
    longToken?.prices.minPrice
  );
  const maxShortSellableTokenAmount = convertToTokenAmount(
    sellableInfo?.maxShortSellableUsd,
    shortToken?.decimals,
    shortToken?.prices.minPrice
  );
  const longPoolAmountUsd = marketInfo
    ? getPoolUsdWithoutPnl(marketInfo, true, "midPrice")
    : undefined;
  const shortPoolAmountUsd = marketInfo
    ? getPoolUsdWithoutPnl(marketInfo, false, "midPrice")
    : undefined;
  const bridgingOprionsForToken = getBridgingOptionsForToken(longToken?.symbol);
  const shouldShowMoreInfo = Boolean(bridgingOprionsForToken);

  return (
    <>
      <div className="my-[20px] ml-[70px]">
        <MarketTokenSelector
          marketTokensData={marketTokensData}
          marketsInfoData={marketsInfoData}
          marketsTokensAPRData={marketsTokensAPRData}
          marketsTokensIncentiveAprData={marketsTokensIncentiveAprData}
          currentMarketInfo={marketInfo}
        />
      </div>
      <div className=" border-t-1">
        <div className="pl-[70px] pt-[5px]">
          <CardRow
            label={`Market`}
            value={
              indexName && poolName ? (
                <div className="items-top">
                  <span>{indexName}</span>
                  <span className="subtext gm-market-name">[{poolName}]</span>
                </div>
              ) : (
                "..."
              )
            }
          />
          {/* TODO fungi Falta el tooltip <CardRow
                    label={t`Price`}
                    value={
                        {<Tooltip
                            handle={
                                formatUsd(marketPrice, {
                                    displayDecimals: 3,
                                }) || "..."
                            }
                            position="right-bottom"
                            renderContent={() => {
                                return (
                                    <div>
                                        <Trans>GM Token pricing includes positions' Pending PnL, Impact Pool Amount and Borrow Fees.</Trans>
                                    </div>
                                );
                            }}
                        />}
                    }
                />*/}
          <CardRow
            label={`Price`}
            value={
              formatUsd(marketPrice, {
                displayDecimals: 3,
              }) || "..."
            }
          />

          <CardRow
            label={`Wallet`}
            value={formatTokenAmountWithUsd(
              marketBalance || BigNumber.from(0),
              marketBalanceUsd || BigNumber.from(0),
              "GM",
              marketToken?.decimals ?? 18
            )}
          />

          <CardRow
            label={`APR`}
            value={<AprInfo apr={apr} incentiveApr={incentiveApr} />}
          />

          <CardRow
            label={`Total Supply`}
            value={
              marketTotalSupply && marketTotalSupplyUsd
                ? formatTokenAmountWithUsd(
                    marketTotalSupply,
                    marketTotalSupplyUsd,
                    "GM",
                    marketToken?.decimals,
                    {
                      displayDecimals: 0,
                    }
                  )
                : "..."
            }
          />

          <CardRow
            label={`Buyable`}
            value={
              mintableInfo && marketTotalSupplyUsd && marketToken ? (
                <Tooltip
                  handle={formatTokenAmountWithUsd(
                    mintableInfo.mintableAmount,
                    mintableInfo.mintableUsd,
                    "GM",
                    marketToken?.decimals,
                    {
                      displayDecimals: 0,
                    }
                  )}
                  position="right-bottom"
                  renderContent={() => {
                    return (
                      <div>
                        {marketInfo?.isSameCollaterals ? (
                          <span>
                            {marketInfo?.longToken.symbol} can be used to buy GM
                            for this market up to the specified buying caps.
                          </span>
                        ) : (
                          <span>
                            {marketInfo?.longToken.symbol} and{" "}
                            {marketInfo?.shortToken.symbol} can be used to buy
                            GM for this market up to the specified buying caps.
                          </span>
                        )}

                        <br />
                        <br />

                        <StatsTooltipRow
                          label={`Max ${marketInfo?.longToken.symbol}`}
                          value={[
                            formatTokenAmount(
                              mintableInfo?.longDepositCapacityAmount,
                              marketInfo?.longToken.decimals,
                              marketInfo?.longToken.symbol,
                              {
                                useCommas: true,
                              }
                            ),
                            `(${formatTokenAmount(
                              marketInfo?.longPoolAmount,
                              marketInfo?.longToken.decimals,
                              undefined,
                              {
                                displayDecimals: 0,
                                useCommas: true,
                              }
                            )} / ${formatTokenAmount(
                              marketInfo?.maxLongPoolAmount,
                              marketInfo?.longToken.decimals,
                              marketInfo?.longToken.symbol,
                              { displayDecimals: 0, useCommas: true }
                            )})`,
                          ]}
                          showDollar={false}
                        />

                        <br />

                        {!marketInfo?.isSameCollaterals && (
                          <StatsTooltipRow
                            label={`Max ${marketInfo?.shortToken.symbol}`}
                            value={[
                              formatTokenAmount(
                                mintableInfo?.shortDepositCapacityAmount,
                                marketInfo?.shortToken.decimals,
                                marketInfo?.shortToken.symbol,
                                {
                                  useCommas: true,
                                }
                              ),
                              `(${formatTokenAmount(
                                marketInfo?.shortPoolAmount,
                                marketInfo?.shortToken.decimals,
                                undefined,
                                { displayDecimals: 0, useCommas: true }
                              )} / ${formatTokenAmount(
                                marketInfo?.maxShortPoolAmount,
                                marketInfo?.shortToken.decimals,
                                marketInfo?.shortToken.symbol,
                                { displayDecimals: 0, useCommas: true }
                              )})`,
                            ]}
                            showDollar={false}
                          />
                        )}
                      </div>
                    );
                  }}
                />
              ) : (
                "..."
              )
            }
          />
        </div>
        <div className="border-b-1 pl-[70px] pb-[5px]">
          {" "}
          <CardRow
            label={`Sellable`}
            value={
              <Tooltip
                handle={formatTokenAmountWithUsd(
                  sellableInfo?.totalAmount,
                  sellableInfo?.totalUsd,
                  "GM",
                  marketToken?.decimals,
                  {
                    displayDecimals: 0,
                  }
                )}
                position="right-bottom"
                renderContent={() => (
                  <div>
                    <span>
                      GM can be sold for {longToken?.symbol} and{" "}
                      {shortToken?.symbol} for this market up to the specified
                      selling caps. The remaining tokens in the pool are
                      reserved for currently open Positions.
                    </span>
                    <br />
                    <br />
                    <StatsTooltipRow
                      label={`Max ${marketInfo?.longToken.symbol}`}
                      value={formatTokenAmountWithUsd(
                        maxLongSellableTokenAmount,
                        sellableInfo?.maxLongSellableUsd,
                        longToken?.symbol,
                        longToken?.decimals
                      )}
                      showDollar={false}
                    />
                    <StatsTooltipRow
                      label={`Max ${marketInfo?.shortToken.symbol}`}
                      value={formatTokenAmountWithUsd(
                        maxShortSellableTokenAmount,
                        sellableInfo?.maxShortSellableUsd,
                        shortToken?.symbol,
                        shortToken?.decimals
                      )}
                      showDollar={false}
                    />
                  </div>
                )}
              />
            }
          />
        </div>
        <div className="border-b-1 pl-[70px] py-[5px]">
          <CardRow
            label={`Long Collateral`}
            value={longToken?.symbol || "..."}
          />
          <CardRow
            label={`Pool Amount`}
            value={formatTokenAmountWithUsd(
              longPoolAmount,
              longPoolAmountUsd,
              longToken?.symbol,
              longToken?.decimals
            )}
          />
          {shouldShowMoreInfo && (
            <CardRow
              label={`More Info`}
              value={
                <BridgingInfo
                  chainId={chainId}
                  tokenSymbol={longToken?.symbol}
                />
              }
            />
          )}
        </div>
        <div className="pl-[70px] pt-[5px]">
          <CardRow
            label={`Short Collateral`}
            value={shortToken?.symbol || "..."}
          />
          <CardRow
            label={`Pool Amount`}
            value={formatTokenAmountWithUsd(
              shortPoolAmount,
              shortPoolAmountUsd,
              shortToken?.symbol,
              shortToken?.decimals
            )}
          />
        </div>
      </div>
    </>
  );
}
