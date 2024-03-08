import {
  SUPPORTED_CHAIN_IDS,
  ARBITRUM,
  ARBITRUM_SEPOLIA,
  ETH_MAINNET,
  POLYGON,
  POLYGON_MUMBAI,
  isSupportedChainOrDefault,
} from "@/config/chains";
import { Network } from "alchemy-sdk";


const ALCHEMY_API_KEYS = {
  [ARBITRUM]: "wa9SqZ2OET5sVzUtzMZUu-WGuwx85Xdt",
  [POLYGON]: "D10Zw8Iea33Vssr-oGS-VJwONZNrkUzr",
  [ARBITRUM_SEPOLIA]: "EIeMw-aBVJDyYoBC0BwwlbsHw9j36kbw"
};

const ALCHEMY_URL = {
  [ARBITRUM]: "https://arb-mainnet.g.alchemy.com/v2/",
  [POLYGON]: "https://polygon-mainnet.g.alchemy.com/v2/",
  [ARBITRUM_SEPOLIA]: "https://arb-sepolia.g.alchemy.com/v2/"
}

export function getApiKeyChain(chainId: number) {
  return ALCHEMY_API_KEYS[chainId];
}

export function getAlchemyApiUrl(chainId: number) {
  return ALCHEMY_URL[chainId];
}

export function getProviderDefaultSettings(chainId: number) {
  return { apiKey: getApiKeyChain(isSupportedChainOrDefault(chainId)) };
}

export function getProviderMultichainSetting() {
  return SUPPORTED_CHAIN_IDS.reduce((acc, chain) => {
    const network = getAlchemyNetwork(chain);
    acc[network] = { apiKey: getApiKeyChain(chain) };
    return acc;
  }, {});
}

//TODO add chain
export function getAlchemyNetwork(chainId: number): Network {
  switch (chainId) {
    case ETH_MAINNET:
      return Network.ETH_MAINNET;
    case ARBITRUM_SEPOLIA:
      return Network.ARB_SEPOLIA;
    case ARBITRUM:
      return Network.ARB_MAINNET;
    case POLYGON:
      return Network.MATIC_MAINNET;
    case POLYGON_MUMBAI:
      return Network.MATIC_MUMBAI;
    default:
      throw new Error("Chain not supported");
  }
}

