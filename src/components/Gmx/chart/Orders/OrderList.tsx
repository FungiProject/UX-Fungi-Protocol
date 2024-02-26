import Checkbox from "../../common/Checkbox/Checkbox";
import { MarketsInfoData } from "../../../../utils/gmx/domain/synthetics/markets";
import {
  OrdersInfoData,
  isLimitOrderType,
  isTriggerDecreaseOrderType,
} from "../../../../utils/gmx/domain/synthetics/orders";
import { cancelOrdersTxn } from "../../../../utils/gmx/domain/synthetics/orders/cancelOrdersTxn";
import { PositionsInfoData } from "../../../../utils/gmx/domain/synthetics/positions";
import { TokensData } from "../../../../utils/gmx/domain/synthetics/tokens";
import { useChainId } from "../../../../utils/gmx/lib/chains";
import useWallet from "../../../../utils/gmx/lib/wallets/useWallet";
import { Dispatch, SetStateAction, useState } from "react";
import { OrderEditor } from "./OrderEditor";
import { OrderItem } from "./OrderItem";
import {
  useIsLastSubaccountAction,
  useSubaccount,
  useSubaccountCancelOrdersDetailsMessage,
} from "../../../../utils/gmx/context/SubaccountContext/SubaccountContext";

type Props = {
  hideActions?: boolean;
  ordersData?: OrdersInfoData;
  marketsInfoData?: MarketsInfoData;
  tokensData?: TokensData;
  positionsData?: PositionsInfoData;
  setSelectedOrdersKeys?: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  selectedOrdersKeys?: { [key: string]: boolean };
  isLoading: boolean;
  setPendingTxns: (txns: any) => void;
};

export function OrderList(p: Props) {
  const { marketsInfoData, tokensData, positionsData } = p;
  const { chainId } = useChainId();
  const { scAccount } = useWallet();

  const [canellingOrdersKeys, setCanellingOrdersKeys] = useState<string[]>([]);
  const [editingOrderKey, setEditingOrderKey] = useState<string>();

  const subaccount = useSubaccount(null);

  const orders = Object.values(p.ordersData || {}).filter(
    (order) =>
      isLimitOrderType(order.orderType) ||
      isTriggerDecreaseOrderType(order.orderType)
  );

  const isAllOrdersSelected =
    orders.length > 0 && orders.every((o) => p.selectedOrdersKeys?.[o.key]);
  const editingOrder = orders.find((o) => o.key === editingOrderKey);
  const isLastSubaccountAction = useIsLastSubaccountAction();
  const cancelOrdersDetailsMessage = useSubaccountCancelOrdersDetailsMessage(
    undefined,
    1
  );

  function onSelectOrder(key: string) {
    p.setSelectedOrdersKeys?.((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function onSelectAllOrders() {
    if (isAllOrdersSelected) {
      p.setSelectedOrdersKeys?.({});
      return;
    }

    const allSelectedOrders = orders.reduce(
      (acc, order) => ({ ...acc, [order.key]: true }),
      {}
    );

    p.setSelectedOrdersKeys?.(allSelectedOrders);
  }

  // function onCancelOrder(key: string) {
  //   if (!scAccount) return;
  //   setCanellingOrdersKeys((prev) => [...prev, key]);

  //   cancelOrdersTxn(chainId, signer, subaccount, {
  //     orderKeys: [key],
  //     setPendingTxns: p.setPendingTxns,
  //     isLastSubaccountAction,
  //     detailsMsg: cancelOrdersDetailsMessage,
  //   }).finally(() =>
  //     setCanellingOrdersKeys((prev) => prev.filter((k) => k !== key))
  //   );
  // }

  return (
    <>
      {/* {orders.length === 0 && (
        <div className="Exchange-empty-positions-list-note App-card small">
          {p.isLoading ? `Loading...` : `No open orders`}
        </div>
      )} */}
      <div className="Exchange-list Orders small">
        {!p.isLoading &&
          orders.map((order) => {
            return (
              <OrderItem
                key={order.key}
                order={order}
                isLarge={false}
                isSelected={p.selectedOrdersKeys?.[order.key]}
                onSelectOrder={() => onSelectOrder(order.key)}
                isCanceling={canellingOrdersKeys.includes(order.key)}
                // onCancelOrder={() => onCancelOrder(order.key)}
                onEditOrder={() => setEditingOrderKey(order.key)}
                marketsInfoData={marketsInfoData}
                positionsInfoData={positionsData}
                hideActions={p.hideActions}
              />
            );
          })}
      </div>

      <table className="w-full">
        <tbody>
          <tr className="border-b-1 h-14">
            {!p.hideActions && orders.length > 0 && (
              <th>
                <div className="checkbox-inline ">
                  <Checkbox
                    isChecked={isAllOrdersSelected}
                    setIsChecked={onSelectAllOrders}
                  />
                </div>
              </th>
            )}

            <th>
              <div className="ml-6 mr-14">Type</div>
            </th>
            <th>
              <div className="mr-14">Order</div>
            </th>
            <th>
              <div className="mr-14">Trigger Price</div>
            </th>
            <th>
              <div className="mr-14">Mark Price</div>
            </th>
          </tr>
          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="ml-6 mt-[24px]">
                {p.isLoading ? `Loading...` : `No open orders`}
              </td>
            </tr>
          )}
          {!p.isLoading &&
            orders.map((order) => {
              return (
                <OrderItem
                  isSelected={p.selectedOrdersKeys?.[order.key]}
                  key={order.key}
                  order={order}
                  isLarge={true}
                  onSelectOrder={() => onSelectOrder(order.key)}
                  isCanceling={canellingOrdersKeys.includes(order.key)}
                  // onCancelOrder={() => onCancelOrder(order.key)}
                  onEditOrder={() => setEditingOrderKey(order.key)}
                  hideActions={p.hideActions}
                  marketsInfoData={marketsInfoData}
                  positionsInfoData={positionsData}
                />
              );
            })}
        </tbody>
      </table>

      {editingOrder && (
        <OrderEditor
          marketsInfoData={marketsInfoData}
          tokensData={tokensData}
          positionsData={positionsData}
          order={editingOrder}
          onClose={() => setEditingOrderKey(undefined)}
          setPendingTxns={p.setPendingTxns}
        />
      )}
    </>
  );
}
