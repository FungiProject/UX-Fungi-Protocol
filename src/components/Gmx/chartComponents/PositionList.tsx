// import { Trans, t } from "@lingui/macro";
import PositionShare from "./PositionShare";
import { PositionItem } from "./PositionItem";
import {
  OrdersInfoData,
  PositionOrderInfo,
  isOrderForPosition,
} from "../domain/synthetics/orders";
import { PositionsInfoData } from "../domain/synthetics/positions";
import { TradeMode, TradeType } from "../domain/synthetics/trade";
import { useChainId } from "../lib/chains";
import { getByKey } from "../lib/objects";
import useWallet from "../lib/wallets/useWallet";
import { useState } from "react";

type Props = {
  onSelectPositionClick: (key: string, tradeMode?: TradeMode) => void;
  onClosePositionClick: (key: string) => void;
  onEditCollateralClick: (key: string) => void;
  onSettlePositionFeesClick: (key: string) => void;
  positionsData?: PositionsInfoData;
  ordersData?: OrdersInfoData;
  savedIsPnlInLeverage: boolean;
  isLoading: boolean;
  onOrdersClick: () => void;
  showPnlAfterFees: boolean;
  savedShowPnlAfterFees: boolean;
  currentMarketAddress?: string;
  currentCollateralAddress?: string;
  currentTradeType?: TradeType;
  openSettings: () => void;
  hideActions?: boolean;
};

export function PositionList(p: Props) {
  const { chainId } = useChainId();
  const { account } = useWallet();
  const [isPositionShareModalOpen, setIsPositionShareModalOpen] =
    useState(false);
  const [positionToShareKey, setPositionToShareKey] = useState<string>();
  const positionToShare = getByKey(p.positionsData, positionToShareKey);
  const positions = Object.values(p.positionsData || {});
  const orders = Object.values(p.ordersData || {});
  const handleSharePositionClick = (positionKey: string) => {
    setPositionToShareKey(positionKey);
    setIsPositionShareModalOpen(true);
  };

  return (
    <div>
      {positions.length === 0 && (
        <div className="Exchange-empty-positions-list-note App-card small">
          {p.isLoading ? `Loading...` : `No open positions`}
        </div>
      )}
      <div className="Exchange-list small">
        {!p.isLoading &&
          positions.map((position) => (
            <PositionItem
              key={position.key}
              positionOrders={
                orders.filter((order) =>
                  isOrderForPosition(order, position.key)
                ) as PositionOrderInfo[]
              }
              position={position}
              onEditCollateralClick={() =>
                p.onEditCollateralClick(position.key)
              }
              onClosePositionClick={() => p.onClosePositionClick(position.key)}
              onGetPendingFeesClick={() =>
                p.onSettlePositionFeesClick(position.key)
              }
              onOrdersClick={p.onOrdersClick}
              onSelectPositionClick={(tradeMode?: TradeMode) =>
                p.onSelectPositionClick(position.key, tradeMode)
              }
              showPnlAfterFees={p.showPnlAfterFees}
              savedShowPnlAfterFees={p.savedShowPnlAfterFees}
              isLarge={false}
              onShareClick={() => handleSharePositionClick(position.key)}
              currentMarketAddress={p.currentMarketAddress}
              currentCollateralAddress={p.currentCollateralAddress}
              currentTradeType={p.currentTradeType}
              openSettings={p.openSettings}
              hideActions={p.hideActions}
            />
          ))}
      </div>

      <table className="Exchange-list large App-box">
        <tbody>
          <tr className="Exchange-list-header">
            <th>
              <span>Position</span>
            </th>
            <th>
              <span>Net Value</span>
            </th>
            <th>
              <span>Size</span>
            </th>
            <th>
              <span>Collateral</span>
            </th>
            <th>
              <span>Entry Price</span>
            </th>
            <th>
              <span>Mark Price</span>
            </th>
            <th>
              <span>Liq. Price</span>
            </th>
          </tr>
          {positions.length === 0 && (
            <tr>
              <td colSpan={15}>
                <div className="Exchange-empty-positions-list-note">
                  {p.isLoading ? `Loading...` : `No open positions`}
                </div>
              </td>
            </tr>
          )}
          {!p.isLoading &&
            positions.map((position) => (
              <PositionItem
                key={position.key}
                positionOrders={
                  orders.filter((order) =>
                    isOrderForPosition(order, position.key)
                  ) as PositionOrderInfo[]
                }
                position={position}
                onEditCollateralClick={() =>
                  p.onEditCollateralClick(position.key)
                }
                onClosePositionClick={() =>
                  p.onClosePositionClick(position.key)
                }
                onGetPendingFeesClick={() =>
                  p.onSettlePositionFeesClick(position.key)
                }
                onOrdersClick={p.onOrdersClick}
                onSelectPositionClick={(tradeMode?: TradeMode) =>
                  p.onSelectPositionClick(position.key, tradeMode)
                }
                showPnlAfterFees={p.showPnlAfterFees}
                isLarge={true}
                savedShowPnlAfterFees={p.savedShowPnlAfterFees}
                currentMarketAddress={p.currentMarketAddress}
                currentCollateralAddress={p.currentCollateralAddress}
                currentTradeType={p.currentTradeType}
                openSettings={p.openSettings}
                hideActions={p.hideActions}
                onShareClick={() => handleSharePositionClick(position.key)}
              />
            ))}
        </tbody>
      </table>
      {positionToShare && (
        <PositionShare
          key={positionToShare.key}
          setIsPositionShareModalOpen={setIsPositionShareModalOpen}
          isPositionShareModalOpen={isPositionShareModalOpen}
          entryPrice={positionToShare.entryPrice}
          indexToken={positionToShare.indexToken}
          isLong={positionToShare.isLong}
          leverage={positionToShare.leverageWithPnl}
          markPrice={positionToShare.markPrice}
          pnlAfterFeesPercentage={positionToShare?.pnlAfterFeesPercentage}
          chainId={chainId}
          account={account}
        />
      )}
    </div>
  );
}
