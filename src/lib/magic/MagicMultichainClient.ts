
import { MagicSigner } from "@alchemy/aa-signers/magic";
import type {
    MagicSDKAdditionalConfiguration,
    MagicSDKExtensionsOption,
  } from "magic-sdk";

export type MagicSDKParams = {
    apiKey: string;
    options?: MagicSDKAdditionalConfiguration<
      string,
      MagicSDKExtensionsOption<string>
    >;
  };

export class MagicMultichainClient {
  readonly settings: MagicSDKParams;
  readonly overrides?: Partial<Record<number, MagicSDKParams>>;
 
  private readonly instances: Map<number, MagicSigner> = new Map();

  /**
   * @param settings The settings to use for all networks.
   * @param overrides Optional settings to use for specific networks.
   */
  constructor(
    settings: MagicSDKParams,
    overrides?: Partial<Record<number, MagicSDKParams>>
  ) {
    this.settings = settings;
    this.overrides = overrides;
  }

  /**
   * Returns an instance of `MagicSigner` for the given `Network`.
   *
   * @param network
   */
  forNetwork(chainId: number): MagicSigner | undefined {
    return this.loadInstance(chainId);
  }

  /**
   * Checks if an instance of `Magic` exists for the given `ChainId`. If not,
   * it creates one and stores it in the `instances` map.
   *
   * @private
   * @param network
   */
  private loadInstance(chainId: number): MagicSigner | undefined {
    if (!this.instances.has(chainId)) {
      // Use overrides if they exist -- otherwise use the default settings.
      const magicSettings =
        this.overrides && this.overrides[chainId]
          ? { ...this.overrides[chainId], chainId }
          : { ...this.settings, chainId };
      this.instances.set(chainId, new MagicSigner(magicSettings));
    }
    return this.instances.get(chainId);
  }
}
