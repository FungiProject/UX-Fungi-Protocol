import { Alchemy, AlchemySettings, Network } from 'alchemy-sdk';
import { getAlchemyNetwork } from '@/config/alchemyConfig';
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { getViemChain } from '@/config/chains';
import { getApiKeyChain } from '@/config/alchemyConfig';

/**
 * This is a wrapper around the Alchemy class that allows you to use the same
 * Alchemy object to make requests to multiple networks using different
 * settings.
 *
 * When instantiating this class, you can pass in an `AlchemyMultiChainSettings`
 * object to apply the same settings to all networks. You can also pass in an
 * optional `overrides` object to apply different settings to specific
 * networks.
 */
export class AlchemyMultichainClient {
  readonly settings: AlchemyMultichainSettings;
  readonly overrides?: Partial<Record<Network, AlchemyMultichainSettings>>;
  /**
   * Lazy-loaded mapping of `Network` enum to `Alchemy` instance.
   *
   * @private
   */
  private readonly instancesClient: Map<Network, Alchemy> = new Map();
  private readonly instancesScProvider: Map<number, AlchemyProvider> = new Map();

  /**
   * @param settings The settings to use for all networks.
   * @param overrides Optional settings to use for specific networks.
   */
  constructor(
    settings: AlchemyMultichainSettings,
    overrides?: Partial<Record<Network, AlchemyMultichainSettings>>
  ) {
    this.settings = settings;
    this.overrides = overrides;
  }

  /**
   * Returns an instance of `Alchemy` for the given `Network`.
   *
   * @param network
   */
  forNetwork(chainId: number): Alchemy | undefined {
    return this.loadInstance(getAlchemyNetwork(chainId));
  }

  forNetworkScProvider(chainId: number): AlchemyProvider | undefined {
    return this.loadInstanceAlchemyScProvider(chainId);
  }

  private loadInstance(network: Network): Alchemy | undefined {
    if (!this.instancesClient.has(network)) {
      // Use overrides if they exist -- otherwise use the default settings.
      const alchemySettings =
        this.overrides && this.overrides[network]
          ? { ...this.overrides[network], network }
          : { ...this.settings, network };
      this.instancesClient.set(network, new Alchemy(alchemySettings));
    }
    return this.instancesClient.get(network);
  }

  private loadInstanceAlchemyScProvider(chainId: number): AlchemyProvider | undefined {
    if (!this.instancesScProvider.has(chainId)) {
      this.instancesScProvider.set(chainId, new AlchemyProvider({chain: getViemChain(chainId), apiKey: getApiKeyChain(chainId)}));
    }
    return this.instancesScProvider.get(chainId);
  }
}

/** AlchemySettings with the `network` param omitted in order to avoid confusion. */
export type AlchemyMultichainSettings = Omit<AlchemySettings, 'network'>;