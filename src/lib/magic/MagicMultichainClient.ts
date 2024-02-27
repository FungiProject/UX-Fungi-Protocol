import { MagicSigner } from "@alchemy/aa-signers/magic";
import type {
    MagicSDKAdditionalConfiguration,
    MagicSDKExtensionsOption,
} from "magic-sdk";
import { createMagicSigner } from "@/lib/magic/createMagicSigner";

export type MagicSDKParams = {
    apiKey: string;
    options?: MagicSDKAdditionalConfiguration<
        string,
        MagicSDKExtensionsOption<string>
    >;
};

export class MagicMultichainClient {

    private readonly instances: Map<number, Promise<MagicSigner | undefined>> = new Map();

    constructor() { }

    forNetwork(chainId: number): Promise<MagicSigner | undefined> {
        return this.loadInstance(chainId);
    }

    private async loadInstance(chainId: number): Promise<MagicSigner | undefined> {
        if (!this.instances.has(chainId)) {
            const newMagic = createMagicSigner(chainId);
            this.instances.set(chainId, newMagic);
        }
        return this.instances.get(chainId);
    }
}