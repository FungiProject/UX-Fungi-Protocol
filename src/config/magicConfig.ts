import { MagicSDKParams } from "@/lib/magic/MagicMultichainClient";
import { getAlchemyApiUrl, getApiKeyChain } from "./alchemyConfig";
import { SUPPORTED_CHAIN_IDS } from "./chains";


export function getMagicApiKey(): string {
    return process.env.NEXT_PUBLIC_MAGIC_API_KEY || ""
}

export function getMagicDefaultSettings(): MagicSDKParams {
    return {
        apiKey: getMagicApiKey()
    }
}

export function getMagicMultichainSetting(): Partial<Record<number, MagicSDKParams>> {
    return SUPPORTED_CHAIN_IDS.reduce((acc, chain) => {
        acc[chain] = {
            apiKey: getMagicApiKey(), 
            options: {
                network: {
                    rpcUrl: getAlchemyApiUrl(chain) + getApiKeyChain(chain),
                    chainId: chain
                }
            }
        };
        return acc;
    }, {});
}