// import { Trans, plural, t } from "@lingui/macro";
import ExternalLink from "./ExternalLink";
import StatsTooltipRow from "./StatsTooltipRow";
import Tooltip from "./Tooltip";
import { getExplorerUrl } from "../../../utils/gmx/config/chains";
import { getToken } from "../../../utils/gmx/config/tokens";
import {
  ClaimAction,
  ClaimCollateralAction,
  ClaimFundingFeeAction,
  ClaimType,
} from "../../../utils/gmx/domain/synthetics/claimHistory";
import {
  getMarketIndexName,
  getMarketPoolName,
} from "../../../utils/gmx/domain/synthetics/markets";
import { BigNumber } from "ethers";
import { useChainId } from "../../../utils/gmx/lib/chains";
import { formatDateTime } from "../../../utils/gmx/lib/dates";
import { formatTokenAmount } from "../../../utils/gmx/lib/numbers";
import { Fragment, useMemo } from "react";

type ClaimHistoryRowProps = {
  claimAction: ClaimAction;
};
type ClaimCollateralHistoryRowProps = {
  claimAction: ClaimCollateralAction;
};

type ClaimFundingFeesHistoryRowProps = {
  claimAction: ClaimFundingFeeAction;
};

const claimCollateralEventTitles: Record<
  ClaimCollateralAction["eventName"],
  string
> = {
  [ClaimType.ClaimFunding]: `Claim Funding Fees`,
  [ClaimType.ClaimPriceImpact]: `Claim Price Impact`,
};

export function ClaimHistoryRow({ claimAction }: ClaimHistoryRowProps) {
  return claimAction.type === "collateral" ? (
    <ClaimCollateralHistoryRow claimAction={claimAction} />
  ) : (
    <ClaimFundingFeesHistoryRow claimAction={claimAction} />
  );
}

function ClaimCollateralHistoryRow(p: ClaimCollateralHistoryRowProps) {
  const { chainId } = useChainId();
  const { claimAction } = p;

  const marketsCount = claimAction.claimItems.length;

  const eventTitle = claimCollateralEventTitles[claimAction.eventName];

  const tokensMsg = useMemo(() => {
    const amountByToken = claimAction.claimItems.reduce(
      (acc, { marketInfo, longTokenAmount, shortTokenAmount }) => {
        if (longTokenAmount.gt(0)) {
          acc[marketInfo.longTokenAddress] =
            acc[marketInfo.longTokenAddress] || BigNumber.from(0);
          acc[marketInfo.longTokenAddress] =
            acc[marketInfo.longTokenAddress].add(longTokenAmount);
        }
        if (shortTokenAmount.gt(0)) {
          acc[marketInfo.shortTokenAddress] =
            acc[marketInfo.shortTokenAddress] || BigNumber.from(0);
          acc[marketInfo.shortTokenAddress] =
            acc[marketInfo.shortTokenAddress].add(shortTokenAmount);
        }

        return acc;
      },
      {} as { [tokenAddress: string]: BigNumber }
    );

    const tokensMsg = Object.entries(amountByToken)
      .map(([tokenAddress, amount]) => {
        const token = getToken(chainId, tokenAddress);

        return formatTokenAmount(amount, token.decimals, token.symbol);
      })
      .join(", ");

    return tokensMsg;
  }, [chainId, claimAction.claimItems]);

  return (
    <div className="TradeHistoryRow App-box App-box-border">
      <div className="muted TradeHistoryRow-time">
        {formatDateTime(claimAction.timestamp)}
      </div>
      <ExternalLink
        className="plain"
        href={`${getExplorerUrl(chainId)}tx/${claimAction.transactionHash}`}
      >
        {eventTitle}: {tokensMsg} from&nbsp;
        <Tooltip
          handle={"# Market"}
          renderContent={() => (
            <>
              {claimAction.claimItems.map(
                (
                  { marketInfo: market, longTokenAmount, shortTokenAmount },
                  index
                ) => {
                  const indexName = getMarketIndexName(market);
                  const poolName = getMarketPoolName(market);
                  return (
                    <Fragment key={market.indexTokenAddress}>
                      <StatsTooltipRow
                        className="ClaimHistoryRow-tooltip-row"
                        key={market.marketTokenAddress}
                        label={
                          <div className="items-top">
                            <span>{indexName}</span>
                            <span className="subtext lh-1">[{poolName}]</span>
                          </div>
                        }
                        showDollar={false}
                        value={
                          <>
                            {longTokenAmount.gt(0) && (
                              <div>
                                {formatTokenAmount(
                                  longTokenAmount,
                                  market.longToken.decimals,
                                  market.longToken.symbol
                                )}
                              </div>
                            )}

                            {shortTokenAmount.gt(0) && (
                              <div>
                                {formatTokenAmount(
                                  shortTokenAmount,
                                  market.shortToken.decimals,
                                  market.shortToken.symbol
                                )}
                              </div>
                            )}
                          </>
                        }
                      />
                      {index < marketsCount - 1 && <br />}
                    </Fragment>
                  );
                }
              )}
            </>
          )}
        />
      </ExternalLink>
    </div>
  );
}

const claimFundingFeeEventTitles: Record<
  ClaimFundingFeeAction["eventName"],
  string
> = {
  [ClaimType.SettleFundingFeeCancelled]: `Failed Settlement of Funding Fees`,
  [ClaimType.SettleFundingFeeCreated]: `Request Settlement of Funding Fees`,
  [ClaimType.SettleFundingFeeExecuted]: `Settled Funding Fees`,
};

function ClaimFundingFeesHistoryRow(p: ClaimFundingFeesHistoryRowProps) {
  const { chainId } = useChainId();
  const { claimAction } = p;

  const eventTitle = claimFundingFeeEventTitles[claimAction.eventName];

  const content = useMemo(() => {
    if (claimAction.eventName === ClaimType.SettleFundingFeeCreated) {
      return (
        <ExternalLink
          href={`${getExplorerUrl(chainId)}tx/${claimAction.transactionHash}`}
          className="plain"
          key={claimAction.transactionHash}
        >
          <div>
            <span>{eventTitle} from</span>{" "}
            <Tooltip
              handle={"# Position"}
              renderContent={() => {
                return claimAction.markets.map((market, index) => {
                  const indexName = getMarketIndexName(market);
                  const poolName = getMarketPoolName(market);
                  const isLong = claimAction.isLongOrders[index];
                  return (
                    <div
                      className="ClaimHistoryRow-tooltip-row text-white items-top"
                      key={`${market.name}/${isLong}`}
                    >
                      {isLong ? `Long` : `Short`} {indexName}{" "}
                      <span className="subtext lh-1">[{poolName}]</span>
                    </div>
                  );
                });
              }}
            />
          </div>
        </ExternalLink>
      );
    }

    if (claimAction.eventName === ClaimType.SettleFundingFeeCancelled) {
      const indexName = getMarketIndexName(claimAction.markets[0]);
      const poolName = getMarketPoolName(claimAction.markets[0]);
      return (
        <ExternalLink
          href={`${getExplorerUrl(chainId)}tx/${claimAction.transactionHash}`}
          className="plain"
          key={claimAction.transactionHash}
        >
          <div>
            <span className="text-red">{eventTitle}</span> from{" "}
            <span className="items-top">
              {claimAction.isLongOrders[0] ? "Long" : "Short"} {indexName}{" "}
              <span className="subtext">[{poolName}]</span>&nbsp;Position
            </span>
          </div>
        </ExternalLink>
      );
    }

    if (claimAction.eventName === ClaimType.SettleFundingFeeExecuted) {
      const indexName = getMarketIndexName(claimAction.markets[0]);
      const poolName = getMarketPoolName(claimAction.markets[0]);
      const amounts = claimAction.markets.map((market, index) => {
        const token = claimAction.tokens[index];
        const amount = claimAction.amounts[index];

        return (
          <Fragment key={`${token.address}/${market.marketTokenAddress}`}>
            {formatTokenAmount(amount, token.decimals, token.symbol)}
            {index === claimAction.markets.length - 1 ? "" : ", "}
          </Fragment>
        );
      });
      const positionName = (
        <span className="items-top">
          {claimAction.isLongOrders[0] ? `Long` : `Short`} {indexName}
        </span>
      );
      const isLong = claimAction.isLongOrders[0];

      return (
        <ExternalLink
          key={claimAction.id}
          className="plain ClaimHistoryRow__token-amount"
          href={`${getExplorerUrl(chainId)}tx/${claimAction.transactionHash}`}
        >
          {eventTitle}: {amounts} <span>from</span>{" "}
          <Tooltip
            handle={positionName}
            renderContent={() => (
              <div className="items-center">
                <span>{isLong ? `Long` : `Short`}</span>&nbsp;
                <span>{indexName && indexName}</span>
                <span className="subtext lh-1">
                  {poolName && `[${poolName}]`}
                </span>
              </div>
            )}
          />{" "}
          <span>Position</span>
        </ExternalLink>
      );
    }

    return null;
  }, [
    chainId,
    claimAction.amounts,
    claimAction.eventName,
    claimAction.id,
    claimAction.isLongOrders,
    claimAction.markets,
    claimAction.tokens,
    claimAction.transactionHash,
    eventTitle,
  ]);

  return (
    <div className="TradeHistoryRow App-box App-box-border">
      <div className="muted TradeHistoryRow-time">
        {formatDateTime(claimAction.timestamp)}
      </div>
      {content}
    </div>
  );
}
