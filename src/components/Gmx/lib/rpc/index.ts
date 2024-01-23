import {
  getRpcUrl,
} from "../../config/chains";
import { Signer, ethers } from "ethers";

export function getProvider(signer: undefined, chainId: number): ethers.providers.StaticJsonRpcProvider;
export function getProvider(signer: Signer, chainId: number): Signer;
export function getProvider(signer: Signer | undefined, chainId: number);
export function getProvider(signer: Signer | undefined, chainId: number) {
  let provider;

  if (signer) {
    return signer;
  }

  provider = getRpcUrl(chainId);

  return new ethers.providers.StaticJsonRpcProvider(
    provider,
    // @ts-ignore incorrect Network param types
    { chainId }
  );
}
