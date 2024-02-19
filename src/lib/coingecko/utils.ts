import { chains } from "./chains";

export function getCoinGeckoChainByChainId(chainId: number): string | undefined {
    return chains.find(c=>c.chain_identifier === chainId)?.id;
}
