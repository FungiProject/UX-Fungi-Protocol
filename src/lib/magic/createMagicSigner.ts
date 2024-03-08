"use client";
import { getMagicApiKey } from "@/config/magicConfig";
import { getAlchemyApiUrl, getApiKeyChain } from "@/config/alchemyConfig";
import { MagicSigner } from "@alchemy/aa-signers/magic";

export const createMagicSigner = async (chainId: number): Promise<MagicSigner | undefined> => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const { MagicSigner } = await import("@alchemy/aa-signers/magic");

  const magicSigner = new MagicSigner({
    apiKey: getMagicApiKey(),
    options: {
      network: {
        rpcUrl: getAlchemyApiUrl(chainId) + getApiKeyChain(chainId),
        chainId
      }
    }
  });

  return magicSigner || undefined;
};
