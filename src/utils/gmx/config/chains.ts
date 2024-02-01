import { sample } from "lodash";
import { BigNumber } from "ethers";

export const ENV_ARBITRUM_RPC_URLS = process.env.REACT_APP_ARBITRUM_RPC_URLS; //TODO fungi
export const ENV_AVALANCHE_RPC_URLS = process.env.REACT_APP_AVALANCHE_RPC_URLS; //TODO fungi

export const BSС_MAINNET = 56;
export const BSС_TESTNET = 97;
export const ETH_MAINNET: number = 1;
export const ETH_SEPOLIA = 11155111; 
export const AVALANCHE: number = 43114;
export const AVALANCHE_FUJI: number = 43113;
export const ARBITRUM: number = 42161;
export const ARBITRUM_GOERLI: number = 421613;
export const POLYGON: number = 137;
export const POLYGON_MUMBAI: number = 80001;

export const DEFAULT_CHAIN_ID = ARBITRUM;
export const SUPPORTED_CHAIN_IDS = [ARBITRUM, AVALANCHE];
export const CHAIN_ID = DEFAULT_CHAIN_ID;

export const GAS_PRICE_ADJUSTMENT_MAP = {
  [ARBITRUM]: "0",
  [AVALANCHE]: "3000000000", // 3 gwei
};

export const NETWORK_EXECUTION_TO_CREATE_FEE_FACTOR = {
  [ARBITRUM]: BigNumber.from(10).pow(29).mul(5),
  [AVALANCHE]: BigNumber.from(10).pow(29).mul(35),
  [AVALANCHE_FUJI]: BigNumber.from(10).pow(29).mul(2),
} as const;

export const IS_NETWORK_DISABLED = {
  [ARBITRUM]: false,
  [AVALANCHE]: false,
  [BSС_MAINNET]: false,
};

export const MAX_GAS_PRICE_MAP = {
  [AVALANCHE]: "200000000000", // 200 gwei
};

export const CHAIN_NAMES_MAP = {
  [BSС_MAINNET]: "BSC",
  [BSС_TESTNET]: "BSC Testnet",
  [ARBITRUM_GOERLI]: "Arbitrum Goerli",
  [ARBITRUM]: "Arbitrum",
  [AVALANCHE]: "Avalanche",
  [AVALANCHE_FUJI]: "Avalanche Fuji",
};

export const FALLBACK_PROVIDERS = {
  [ARBITRUM]: ENV_ARBITRUM_RPC_URLS
    ? JSON.parse(ENV_ARBITRUM_RPC_URLS)
    : [getAlchemyHttpUrl()],
  [AVALANCHE]: ENV_AVALANCHE_RPC_URLS
    ? JSON.parse(ENV_AVALANCHE_RPC_URLS)
    : [
        "https://avax-mainnet.gateway.pokt.network/v1/lb/626f37766c499d003aada23b",
      ],
  [AVALANCHE_FUJI]: [
    "https://endpoints.omniatech.io/v1/avax/fuji/public",
    "https://api.avax-test.network/ext/bc/C/rpc",
    "https://ava-testnet.public.blastapi.io/ext/bc/C/rpc",
  ],
  [ARBITRUM_GOERLI]: [
    "https://arb-goerli.g.alchemy.com/v2/cZfd99JyN42V9Clbs_gOvA3GSBZH1-1j",
  ],
};

export function getFallbackRpcUrl(chainId: number): string | undefined {
  return sample(FALLBACK_PROVIDERS[chainId]);
}

const ALCHEMY_WHITELISTED_DOMAINS = ["gmx.io", "app.gmx.io"]; //TODO fungi

export function getAlchemyHttpUrl() {
  /*if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
      return "https://arb-mainnet.g.alchemy.com/v2/RcaXYTizJs51m-w9SnRyDrxSZhE5H9Mf";
    }*/ // TODO fungi
  return "https://arb-mainnet.g.alchemy.com/v2/hxBqIr-vfpJ105JPYLei_ibbJLe66k46";
}

export function getAlchemyWsUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "wss://arb-mainnet.g.alchemy.com/v2/RcaXYTizJs51m-w9SnRyDrxSZhE5H9Mf";
  }
  return "wss://arb-mainnet.g.alchemy.com/v2/hxBqIr-vfpJ105JPYLei_ibbJLe66k46";
}

export const RPC_PROVIDERS = {
  [ETH_MAINNET]: ["https://rpc.ankr.com/eth"],
  [ETH_SEPOLIA]: ["https://eth-sepolia.g.alchemy.com/v2/04K3Ey0y6hJIGfrqM7fquzu3ZzkE8aos"],
  [BSС_MAINNET]: [
    "https://bsc-dataseed.binance.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed2.defibit.io",
    "https://bsc-dataseed3.defibit.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed4.ninicoin.io",
    "https://bsc-dataseed1.binance.org",
    "https://bsc-dataseed2.binance.org",
    "https://bsc-dataseed3.binance.org",
    "https://bsc-dataseed4.binance.org",
  ],
  [BSС_TESTNET]: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  [ARBITRUM]: ["https://arb1.arbitrum.io/rpc"],
  [ARBITRUM_GOERLI]: [
    "https://goerli-rollup.arbitrum.io/rpc",
    // "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
    // "https://arbitrum-goerli.public.blastapi.io",
  ],
  [AVALANCHE]: ["https://api.avax.network/ext/bc/C/rpc"],
  [AVALANCHE_FUJI]: [
    "https://avalanche-fuji-c-chain.publicnode.com",
    "https://api.avax-test.network/ext/bc/C/rpc",
    // "https://ava-testnet.public.blastapi.io/v1/avax/fuji/public",
    // "https://rpc.ankr.com/avalanche_fuji",
  ],
  [POLYGON]: ["https://polygon.blockpi.network/v1/rpc/public	"],
  [POLYGON_MUMBAI]: ["https://polygon-mumbai.blockpi.network/v1/rpc/public"]
};

export function getRpcUrl(chainId: number): string | undefined {
  return sample(RPC_PROVIDERS[chainId]);
}

export function getExplorerUrl(chainId: number) {
  if (chainId === 3) {
    return "https://ropsten.etherscan.io/";
  } else if (chainId === 42) {
    return "https://kovan.etherscan.io/";
  } else if (chainId === BSС_MAINNET) {
    return "https://bscscan.com/";
  } else if (chainId === BSС_TESTNET) {
    return "https://testnet.bscscan.com/";
  } else if (chainId === ARBITRUM_GOERLI) {
    return "https://goerli.arbiscan.io/";
  } else if (chainId === ARBITRUM) {
    return "https://arbiscan.io/";
  } else if (chainId === AVALANCHE) {
    return "https://snowtrace.io/";
  } else if (chainId === AVALANCHE_FUJI) {
    return "https://testnet.snowtrace.io/";
  }
  return "https://etherscan.io/";
}

export const HIGH_EXECUTION_FEES_MAP = {
  [ARBITRUM]: 3, // 3 USD
  [AVALANCHE]: 3, // 3 USD
  [AVALANCHE_FUJI]: 3, // 3 USD
};

export const EXECUTION_FEE_CONFIG_V2: {
  [chainId: number]: {
    shouldUseMaxPriorityFeePerGas: boolean;
    defaultBufferBps?: number;
  };
} = {
  [AVALANCHE]: {
    shouldUseMaxPriorityFeePerGas: true,
    defaultBufferBps: 1000, // 10%
  },
  [AVALANCHE_FUJI]: {
    shouldUseMaxPriorityFeePerGas: true,
    defaultBufferBps: 1000, // 10%
  },
  [ARBITRUM]: {
    shouldUseMaxPriorityFeePerGas: false,
    defaultBufferBps: 1000, // 10%
  },
  [ARBITRUM_GOERLI]: {
    shouldUseMaxPriorityFeePerGas: false,
    defaultBufferBps: 1000, // 10%
  },
};

export function getChainName(chainId: number) {
  return CHAIN_NAMES_MAP[chainId];
}

export function getHighExecutionFee(chainId) {
  return HIGH_EXECUTION_FEES_MAP[chainId] || 3;
}
