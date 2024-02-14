import cx from "classnames";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import { useCallback, useState } from "react";
import { useClaimCollateralHistory } from "../../../../utils/gmx/domain/synthetics/claimHistory";
import { ClaimHistoryRow } from "./ClaimHistoryRow";
import { MarketsInfoData } from "../../../../utils/gmx/domain/synthetics/markets";
import { TokensData } from "../../../../utils/gmx/domain/synthetics/tokens";
import useWallet from "../../../../utils/gmx/lib/wallets/useWallet";
import { ClaimableCard } from "./ClaimableCard";

import { useMedia } from "react-use";
import { SettleAccruedCard } from "../SettleAccrued/SettleAccruedCard";
import { PositionsInfoData } from "../../../../utils/gmx/domain/synthetics/positions";

const PAGE_SIZE = 100;

type Props = {
  shouldShowPaginationButtons: boolean;
  marketsInfoData: MarketsInfoData | undefined;
  tokensData: TokensData | undefined;
  setIsClaiming: (isClaiming: boolean) => void;
  setIsSettling: (isSettling: boolean) => void;
  positionsInfoData: PositionsInfoData | undefined;
};

export function Claims({
  shouldShowPaginationButtons,
  marketsInfoData,
  tokensData,
  setIsClaiming,
  setIsSettling,
  positionsInfoData,
}: Props) {
  const { chainId } = useChainId();
  const { account } = useWallet();
  const [pageIndex, setPageIndex] = useState(0);

  const { claimActions, isLoading } = useClaimCollateralHistory(chainId, {
    marketsInfoData,
    tokensData,
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const isEmpty = !account || claimActions?.length === 0;

  const handleClaimClick = useCallback(() => {
    setIsClaiming(true);
  }, [setIsClaiming]);

  const handleSettleClick = useCallback(() => {
    setIsSettling(true);
  }, [setIsSettling]);

  const isMobile = useMedia("(max-width: 1100px)");

  return (
    <div className="TradeHistory">
      {account && isLoading && (
        <div className="TradeHistoryRow App-box">Loading...</div>
      )}
      <div
        className={cx("flex", "w-full", {
          "flex-column": isMobile,
        })}
      >
        {account && !isLoading && (
          <SettleAccruedCard
            positionsInfoData={positionsInfoData}
            onSettleClick={handleSettleClick}
            style={isMobile ? undefined : { marginRight: 4 }}
          />
        )}
        {account && !isLoading && (
          <ClaimableCard
            marketsInfoData={marketsInfoData}
            onClaimClick={handleClaimClick}
            style={isMobile ? undefined : { marginLeft: 4 }}
          />
        )}
      </div>
      {isEmpty && <div className="TradeHistoryRow App-box">No claims yet</div>}
      {claimActions?.map((claimAction) => (
        <ClaimHistoryRow key={claimAction.id} claimAction={claimAction} />
      ))}
      {shouldShowPaginationButtons && (
        <div>
          {pageIndex > 0 && (
            <button
              className="App-button-option App-card-option"
              onClick={() => setPageIndex((old) => old - 1)}
            >
              Prev
            </button>
          )}
          {claimActions && claimActions.length >= PAGE_SIZE && (
            <button
              className="App-button-option App-card-option"
              onClick={() => setPageIndex((old) => old + 1)}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}
