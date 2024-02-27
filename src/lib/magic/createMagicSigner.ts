"use client";
import { getMagicApiKey} from "@/config/magicConfig";

export const createMagicSigner = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  const { MagicSigner } = await import("@alchemy/aa-signers/magic");

  const magicSigner = new MagicSigner({ apiKey: getMagicApiKey() });

  return magicSigner;
};
