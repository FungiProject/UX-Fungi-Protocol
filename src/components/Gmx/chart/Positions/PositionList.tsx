import PositionShare from "./PositionShare";
import { PositionItem } from "./PositionItem";
import {
  OrdersInfoData,
  PositionOrderInfo,
  isOrderForPosition,
} from "../../../../utils/gmx/domain/synthetics/orders";
import { PositionsInfoData } from "../../../../utils/gmx/domain/synthetics/positions";
import {
  TradeMode,
  TradeType,
} from "../../../../utils/gmx/domain/synthetics/trade";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import { getByKey } from "../../../../utils/gmx/lib/objects";
import useWallet from "../../../../utils/gmx/lib/wallets/useWallet";
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
  const { scAccount } = useWallet();
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
      {/* {positions.length === 0 && (
        <div className="Exchange-empty-positions-list-note App-card small">
          {p.isLoading ? `Loading...` : `No open positions`}
        </div>
      )} */}
      {/* <div className="Exchange-list small">
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
      </div> */}

      <div className="w-full">
        <div>
          <div className="border-b-1 h-12 grid grid-cols-10 font-semibold flex items-center text-center pl-6">
            <span className="col-span-2">Position</span>
            <span>Net Value</span>
            <span>Size</span>
            <span>Collateral</span>
            <span>Entry Price</span>
            <span>Mark Price</span>
            <span>Liq. Price</span>
          </div>

          {positions.length === 0 && (
            <div>
              <div className="grid-span-full ml-9 font-semibold">
                <div className="Exchange-empty-positions-list-note ml-6 mt-[24px]">
                  {p.isLoading ? `Loading...` : `No open positions`}
                </div>
              </div>
            </div>
          )}
          <div className="h-[200px] overflow-auto">
            {" "}
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
          </div>
        </div>
      </div>
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
          account={scAccount}
        />
      )}
    </div>
  );
}
