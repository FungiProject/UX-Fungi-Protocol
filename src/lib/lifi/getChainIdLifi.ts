import { ARBITRUM, ARBITRUM_SEPOLIA, POLYGON, ETH_MAINNET, OPTIMISM } from "../../config/chains";

export const LIFI_CHAINS = {
    [ARBITRUM]: {
        "key": "arb",
        "chainType": "EVM",
        "name": "Arbitrum",
        "coin": "ETH",
        "id": 42161,
        "mainnet": true,
        "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg",
    },
    [ETH_MAINNET]:  {
        "key": "eth",
        "chainType": "EVM",
        "name": "Ethereum",
        "coin": "ETH",
        "id": 1,
        "mainnet": true,
        "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg",
    },
    [POLYGON]:  {
        "key": "pol",
        "chainType": "EVM",
        "name": "Polygon",
        "coin": "MATIC",
        "id": 137,
        "mainnet": true,
        "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/polygon.svg",
    },  
    [OPTIMISM]:     {
        "key": "opt",
        "chainType": "EVM",
        "name": "Optimism",
        "coin": "ETH",
        "id": 10,
        "mainnet": true,
        "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/optimism.svg",
      },        
}

export function getChainIdLifi(chainId: number){
    return LIFI_CHAINS[chainId]?.key || null
}