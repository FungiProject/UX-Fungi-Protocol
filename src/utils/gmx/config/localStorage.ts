export const PRODUCTION_PREVIEW_KEY = "production-preview";
export const SELECTED_NETWORK_LOCAL_STORAGE_KEY = "SELECTED_NETWORK";
export const ORACLE_KEEPER_INSTANCES_CONFIG_KEY =
  "oracle-keeper-instances-config";
export const REFERRAL_CODE_KEY = "UkhezoCode";
export const SHOW_DEBUG_VALUES_KEY = "show-debug-values";
export const SLIPPAGE_BPS_KEY = "Exchange-swap-slippage-basis-points-v3";
export const EXECUTION_FEE_BUFFER_BPS_KEY = "execution-fee-buffer-basis-points";
export const SYNTHETICS_ACCEPTABLE_PRICE_IMPACT_BUFFER_KEY =
  "synthetics-acceptable-price-impact-buffer";
export const SYNTHETICS_DEPOSIT_MARKET_KEY = "synthetics-market-deposit-market";
export const SYNTHETICS_MARKET_DEPOSIT_TOKEN_KEY =
  "synthetics-market-deposit-token";
export const SYNTHETICS_LIST_SECTION_KEY = "synthetics-list-section";
export const SYNTHETICS_COLLATERAL_EDIT_TOKEN_KEY =
  "synthetics-collateral-edit-token";
export const SYNTHETICS_TRADE_OPTIONS = "synthetics-trade-options";
export const SYNTHETICS_DEPOSIT_INDEX_TOKEN_KEY =
  "synthetics-deposit-index-token";
export const TV_SAVE_LOAD_CHARTS_KEY = "tv-save-load-charts";
export const LEVERAGE_OPTION_KEY = "leverage-option";
export const LEVERAGE_ENABLED_KEY = "leverage-enabled";
export const KEEP_LEVERAGE_FOR_DECREASE_KEY = "Exchange-keep-leverage";

export const ONE_CLICK_TRADING_OFFER_HIDDEN = "one-click-trading-offer-hidden";
export const ONE_CLICK_TRADING_NATIVE_TOKEN_WARN_HIDDEN =
  "one-click-trading-native-token-warn-hidden";
export const REQUIRED_UI_VERSION_KEY = "required-ui-version";

export function getSyntheticsDepositMarketKey(chainId: number) {
  return [chainId, SYNTHETICS_DEPOSIT_MARKET_KEY];
}

export function getSyntheticsListSectionKey(chainId: number) {
  return [chainId, SYNTHETICS_LIST_SECTION_KEY];
}

export function getSyntheticsDepositIndexTokenKey(chainId: number) {
  return [chainId, SYNTHETICS_DEPOSIT_INDEX_TOKEN_KEY];
}

export function getSyntheticsAcceptablePriceImpactBufferKey(chainId: number) {
  return [chainId, SYNTHETICS_ACCEPTABLE_PRICE_IMPACT_BUFFER_KEY];
}

export function getExecutionFeeBufferBpsKey(chainId: number) {
  return [chainId, EXECUTION_FEE_BUFFER_BPS_KEY];
}

export function getSyntheticsTradeOptionsKey(chainId: number) {
  return [chainId, SYNTHETICS_TRADE_OPTIONS];
}

export function getSyntheticsCollateralEditAddressKey(
  chainId: number,
  positionCollateralAddress?: string
) {
  return [
    chainId,
    SYNTHETICS_COLLATERAL_EDIT_TOKEN_KEY,
    positionCollateralAddress,
  ];
}

export function getAllowedSlippageKey(chainId: number) {
  return [chainId, SLIPPAGE_BPS_KEY];
}

export function getLeverageKey(chainId: number) {
  return [chainId, LEVERAGE_OPTION_KEY];
}

export function getKeepLeverageKey(chainId: number) {
  return [chainId, KEEP_LEVERAGE_FOR_DECREASE_KEY];
}

export function getLeverageEnabledKey(chainId: number) {
  return [chainId, LEVERAGE_ENABLED_KEY];
}

export const getSubgraphUrlKey = (chainId: number, subgraph: string) =>
  `subgraphUrl:${chainId}:${subgraph}`;

export function getSubaccountConfigKey(
  chainId: number | undefined,
  account: string | undefined
) {
  if (!chainId || !account) return null;
  return [chainId, account, "one-click-trading-config"];
}
