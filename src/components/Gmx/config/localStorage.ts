export const PRODUCTION_PREVIEW_KEY = "production-preview";
export const SELECTED_NETWORK_LOCAL_STORAGE_KEY = "SELECTED_NETWORK";
export const ORACLE_KEEPER_INSTANCES_CONFIG_KEY = "oracle-keeper-instances-config";
export const SHOW_DEBUG_VALUES_KEY = "show-debug-values";
export const SLIPPAGE_BPS_KEY = "Exchange-swap-slippage-basis-points-v3";
export const EXECUTION_FEE_BUFFER_BPS_KEY = "execution-fee-buffer-basis-points";
export const SYNTHETICS_ACCEPTABLE_PRICE_IMPACT_BUFFER_KEY = "synthetics-acceptable-price-impact-buffer";
export const SYNTHETICS_DEPOSIT_MARKET_KEY = "synthetics-market-deposit-market";
export const SYNTHETICS_MARKET_DEPOSIT_TOKEN_KEY = "synthetics-market-deposit-token";
export const SYNTHETICS_DEPOSIT_INDEX_TOKEN_KEY = "synthetics-deposit-index-token";


export function getSyntheticsDepositMarketKey(chainId: number) {
    return [chainId, SYNTHETICS_DEPOSIT_MARKET_KEY];
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

export function getAllowedSlippageKey(chainId: number) {
    return [chainId, SLIPPAGE_BPS_KEY];
}
export const getSubgraphUrlKey = (chainId: number, subgraph: string) => `subgraphUrl:${chainId}:${subgraph}`;

