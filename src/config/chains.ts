import { arbitrum, arbitrumSepolia, polygon, polygonMumbai, mainnet, optimism} from "@alchemy/aa-core";


export const ETH_MAINNET: number = 1;
export const ETH_SEPOLIA = 11155111;
export const ARBITRUM: number = 42161;
export const ARBITRUM_GOERLI: number = 421613;
export const ARBITRUM_SEPOLIA: number = 421614;
export const POLYGON: number = 137;
export const OPTIMISM: number = 10;
export const POLYGON_MUMBAI: number = 80001;

export const DEFAULT_CHAIN_ID = ARBITRUM;

export const SUPPORTED_CHAIN_IDS = [ARBITRUM, OPTIMISM];

export function isSupportedChainOrDefault(chainId: number): number {
    return SUPPORTED_CHAIN_IDS.includes(chainId) ? chainId : DEFAULT_CHAIN_ID
}

export function isSupportedChain(chainId: number): boolean {
    return SUPPORTED_CHAIN_IDS.includes(chainId);
}

export function getViemChain(chainId: number) {
    switch (chainId) {
      case ETH_MAINNET:
        return mainnet;
      case ARBITRUM:
        return arbitrum;
      case ARBITRUM_SEPOLIA:
          return arbitrumSepolia;
      case POLYGON:
        return polygon;
      case POLYGON_MUMBAI:
        return polygonMumbai;
      case OPTIMISM:
          return optimism;
      default:
        throw new Error("Chain not supported");
    }
  }