// import { Trans, t } from "@lingui/macro";
import ExchangeInfoRow from "./ExchangeInfoRow";
import TokenSelector from "../gmcomponents/TokenSelector/TokenSelector";
import Tooltip from "./Tooltip";
import { AvailableMarketsOptions } from "../domain/synthetics/trade/useAvailableMarketsOptions";
import { Token } from "../domain/tokens";
import cx from "classnames";
import { useChainId } from "../lib/chains";
import { useMemo } from "react";

export type Props = {
  selectedCollateralAddress?: string;
  selectedMarketAddress?: string;
  marketsOptions?: AvailableMarketsOptions;
  availableCollaterals?: Token[];
  hasExistingPosition?: boolean;
  hasExistingOrder?: boolean;
  onSelectCollateralAddress: (address?: string) => void;
  isMarket: boolean;
};

export function CollateralSelectorRow(p: Props) {
  const {
    selectedCollateralAddress,
    selectedMarketAddress,
    marketsOptions,
    hasExistingOrder,
    hasExistingPosition,
    availableCollaterals,
    onSelectCollateralAddress,
    isMarket,
  } = p;

  const {
    collateralWithOrder,
    marketWithOrder,
    marketWithPosition,
    collateralWithPosition,
  } = marketsOptions || {};

  const { chainId } = useChainId();

  const { message, level } = useMemo(() => {
    if (
      !hasExistingPosition &&
      collateralWithPosition &&
      selectedMarketAddress === marketWithPosition?.marketTokenAddress &&
      collateralWithPosition?.address !== selectedCollateralAddress
    ) {
      if (isMarket) {
        return {
          message: (
            <div className="MarketSelector-tooltip-row">
              <span className="negative">
                You have an existing position with{" "}
                {collateralWithPosition.symbol} as collateral. This action will
                not apply for that position.
              </span>
              <div
                className="MarketSelector-tooltip-row-action clickable underline muted"
                onClick={() => {
                  onSelectCollateralAddress(collateralWithPosition.address);
                }}
              >
                Switch to {collateralWithPosition.symbol} collateral.
              </div>{" "}
            </div>
          ),
          level: "error",
        };
      }

      return {
        message: (
          <div className="MarketSelector-tooltip-row">
            <span className="negative">
              You have an existing position with {collateralWithPosition.symbol}{" "}
              as collateral. This Order will not be valid for that Position.
            </span>
            <div
              className="MarketSelector-tooltip-row-action clickable underline muted"
              onClick={() => {
                onSelectCollateralAddress(collateralWithPosition.address);
              }}
            >
              Switch to {collateralWithPosition.symbol} collateral.
            </div>{" "}
          </div>
        ),
        level: "error",
      };
    }

    if (
      !hasExistingPosition &&
      !hasExistingOrder &&
      !collateralWithPosition &&
      marketWithOrder &&
      selectedMarketAddress === marketWithOrder?.marketTokenAddress &&
      collateralWithOrder &&
      collateralWithOrder.address !== selectedCollateralAddress
    ) {
      return {
        message: (
          <div className="MarketSelector-tooltip-row">
            You have an existing order with {collateralWithOrder.symbol} as
            collateral.{" "}
            <div
              className="MarketSelector-tooltip-row-action clickable underline muted"
              onClick={() => {
                onSelectCollateralAddress(collateralWithOrder.address);
              }}
            >
              Switch to {collateralWithOrder.symbol} collateral.
            </div>{" "}
          </div>
        ),
        level: "warning",
      };
    }

    return { message: null };
  }, [
    hasExistingPosition,
    collateralWithPosition,
    selectedMarketAddress,
    marketWithPosition?.marketTokenAddress,
    selectedCollateralAddress,
    hasExistingOrder,
    marketWithOrder,
    collateralWithOrder,
    onSelectCollateralAddress,
    isMarket,
  ]);

  return (
    <ExchangeInfoRow
      label={
        message ? (
          <Tooltip
            handle={`Collateral In`}
            position="left-bottom"
            className={cx("MarketSelector-tooltip", {
              error: level === "error",
            })}
            renderContent={() => (
              <div className="MarketSelector-tooltip-content">{message}</div>
            )}
          />
        ) : (
          `Collateral In`
        )
      }
      className="SwapBox-info-row"
      value={
        selectedCollateralAddress &&
        availableCollaterals && (
          <TokenSelector
            label={`Collateral In`}
            className="border-1 rounded-full px-[12px] py-1 w-[125px] "
            chainId={chainId}
            tokenAddress={selectedCollateralAddress}
            onSelectToken={(token) => {
              onSelectCollateralAddress(token.address);
            }}
            tokens={availableCollaterals}
            showTokenImgInDropdown={true}
          />
        )
      }
    />
  );
}
