import {
  SUPPORTED_CHAIN_IDS,
  ARBITRUM,
  ETH_MAINNET,
  POLYGON,
  POLYGON_MUMBAI,
  isSupportedChainOrDefault,
} from "@/config/chains";
import { Network } from "alchemy-sdk";

const ALCHEMY_API_KEYS = {
  [ARBITRUM]: "wa9SqZ2OET5sVzUtzMZUu-WGuwx85Xdt",
  [POLYGON]: "D10Zw8Iea33Vssr-oGS-VJwONZNrkUzr",
};

export function getApiKeyChain(chainId: number) {
  return ALCHEMY_API_KEYS[chainId];
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
