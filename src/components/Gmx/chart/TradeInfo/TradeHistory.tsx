import { useTradeHistory } from "../../../../utils/gmx/domain/synthetics/tradeHistory";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import { TradeHistoryRow } from "./TradeHistoryRow";
import usePagination from "../../../../hooks/usePagination";
import Pagination from "../Pagination/Pagination";
import { useEffect } from "react";
import { usePositionsConstants } from "../../../../utils/gmx/domain/synthetics/positions/usePositionsConstants";
import { MarketsInfoData } from "../../../../utils/gmx/domain/synthetics/markets";
import { TokensData } from "../../../../utils/gmx/domain/synthetics/tokens";
import { TRADE_HISTORY_PER_PAGE } from "../../../../utils/gmx/config/ui";

const PAGE_SIZE = 100;
const ENTITIES_PER_PAGE = 25;

type Props = {
  shouldShowPaginationButtons: boolean;
  marketsInfoData?: MarketsInfoData;
  tokensData?: TokensData;
  account: string | null | undefined;
  forAllAccounts?: boolean;
};

export function TradeHistory(p: Props) {
  const {
    shouldShowPaginationButtons,
    marketsInfoData,
    tokensData,
    forAllAccounts,
    account,
  } = p;
  const { chainId } = useChainId();

  const { minCollateralUsd } = usePositionsConstants(chainId);
  const {
    tradeActions,
    isLoading: isHistoryLoading,
    pageIndex: tradeActionsPageIndex,
    setPageIndex: setTradeActionsPageIndex,
  } = useTradeHistory(chainId, {
    account,
    forAllAccounts,
    marketsInfoData,
    tokensData,
    pageSize: PAGE_SIZE,
  });

  const isLoading = !!account && (!minCollateralUsd || isHistoryLoading);

  const isEmpty = !isLoading && !tradeActions?.length;
  const { currentPage, setCurrentPage, getCurrentData, pageCount } =
    usePagination(
      [account, forAllAccounts].toString(),
      tradeActions,
      ENTITIES_PER_PAGE
    );
  const currentPageData = getCurrentData();

  useEffect(() => {
    if (!pageCount || !currentPage) return;
    const totalPossiblePages =
      (PAGE_SIZE * tradeActionsPageIndex) / TRADE_HISTORY_PER_PAGE;
    const doesMoreDataExist = pageCount >= totalPossiblePages;
    const isCloseToEnd = pageCount && pageCount < currentPage + 2;

    if (doesMoreDataExist && isCloseToEnd) {
      setTradeActionsPageIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentPage, pageCount, tradeActionsPageIndex, setTradeActionsPageIndex]);

  return (
    <div className="TradeHistory">
      {isLoading && <div className="TradeHistoryRow App-box">Loading...</div>}
      {isEmpty && <div className="TradeHistoryRow App-box">No trades yet</div>}
      {!isLoading &&
        currentPageData?.map((tradeAction) => (
          <TradeHistoryRow
            shouldDisplayAccount={forAllAccounts}
            key={tradeAction.id}
            tradeAction={tradeAction}
            minCollateralUsd={minCollateralUsd!}
          />
        ))}
      {shouldShowPaginationButtons && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
