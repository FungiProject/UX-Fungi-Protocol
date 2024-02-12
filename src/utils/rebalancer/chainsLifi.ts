export const chains = [
        {
            "key": "eth",
            "chainType": "EVM",
            "name": "Ethereum",
            "coin": "ETH",
            "id": 1,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg",
            "tokenlistUrl": "https://gateway.ipfs.io/ipns/tokens.uniswap.org",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x1",
                "blockExplorerUrls": [
                    "https://etherscan.io/"
                ],
                "chainName": "Ethereum Mainnet",
                "nativeCurrency": {
                    "name": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 1,
                "symbol": "ETH",
                "decimals": 18,
                "name": "ETH",
                "coinKey": "ETH",
                "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                "priceUSD": "2472.580000000000000000"
            }
        },
        {
            "key": "arb",
            "chainType": "EVM",
            "name": "Arbitrum",
            "coin": "ETH",
            "id": 42161,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg",
            "tokenlistUrl": "https://raw.githubusercontent.com/sushiswap/default-token-list/master/tokens/arbitrum.json",
            "faucetUrls": [
                "https://bridge.arbitrum.io/"
            ],
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0xa4b1",
                "blockExplorerUrls": [
                    "https://arbiscan.io/"
                ],
                "chainName": "Arbitrum",
                "nativeCurrency": {
                    "name": "AETH",
                    "symbol": "AETH",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://arb1.arbitrum.io/rpc"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 42161,
                "symbol": "ETH",
                "decimals": 18,
                "name": "ETH",
                "coinKey": "ETH",
                "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                "priceUSD": "2474.910000000000000000"
            }
        },
        {
            "key": "opt",
            "chainType": "EVM",
            "name": "Optimism",
            "coin": "ETH",
            "id": 10,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/optimism.svg",
            "tokenlistUrl": "https://static.optimism.io/optimism.tokenlist.json",
            "faucetUrls": [
                "https://gateway.optimism.io/"
            ],
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0xa",
                "blockExplorerUrls": [
                    "https://optimistic.etherscan.io/"
                ],
                "chainName": "Optimism",
                "nativeCurrency": {
                    "name": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://mainnet.optimism.io/"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 10,
                "symbol": "ETH",
                "decimals": 18,
                "name": "ETH",
                "coinKey": "ETH",
                "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                "priceUSD": "2464.5"
            }
        },
        {
            "key": "pol",
            "chainType": "EVM",
            "name": "Polygon",
            "coin": "MATIC",
            "id": 137,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/polygon.svg",
            "tokenlistUrl": "https://unpkg.com/quickswap-default-token-list@1.0.71/build/quickswap-default.tokenlist.json",
            "faucetUrls": [
                "https://stakely.io/faucet/polygon-matic"
            ],
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x89",
                "blockExplorerUrls": [
                    "https://polygonscan.com/",
                    "https://explorer-mainnet.maticvigil.com/"
                ],
                "chainName": "Matic(Polygon) Mainnet",
                "nativeCurrency": {
                    "name": "MATIC",
                    "symbol": "MATIC",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://polygon-rpc.com/",
                    "https://rpc-mainnet.maticvigil.com/"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 137,
                "symbol": "MATIC",
                "decimals": 18,
                "name": "MATIC",
                "coinKey": "MATIC",
                "logoURI": "https://static.debank.com/image/matic_token/logo_url/matic/6f5a6b6f0732a7a235131bd7804d357c.png",
                "priceUSD": "0.843247000000000000"
            }
        },
        {
            "key": "bsc",
            "chainType": "EVM",
            "name": "BSC",
            "coin": "BNB",
            "id": 56,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bsc.svg",
            "tokenlistUrl": "https://tokens.pancakeswap.finance/pancakeswap-extended.json",
            "faucetUrls": [
                "https://stakely.io/faucet/bsc-chain-bnb"
            ],
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x38",
                "blockExplorerUrls": [
                    "https://bscscan.com/"
                ],
                "chainName": "Binance Smart Chain Mainnet",
                "nativeCurrency": {
                    "name": "BNB",
                    "symbol": "BNB",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://bsc-dataseed.binance.org/",
                    "https://bsc-dataseed1.defibit.io/",
                    "https://bsc-dataseed1.ninicoin.io/"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 56,
                "symbol": "BNB",
                "decimals": 18,
                "name": "BNB",
                "coinKey": "BNB",
                "logoURI": "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
                "priceUSD": "323.500000000000000000"
            }
        },
        {
            "key": "era",
            "chainType": "EVM",
            "name": "zkSync Era",
            "coin": "ETH",
            "id": 324,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/zksync.svg",
            "multicallAddress": "0xF9cda624FBC7e059355ce98a31693d299FACd963",
            "metamask": {
                "chainId": "0x144",
                "blockExplorerUrls": [
                    "https://explorer.zksync.io/"
                ],
                "chainName": "zkSync Era Mainnet",
                "nativeCurrency": {
                    "name": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://mainnet.era.zksync.io"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 324,
                "symbol": "ETH",
                "decimals": 18,
                "name": "ETH",
                "coinKey": "ETH",
                "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                "priceUSD": "2464.62"
            }
        },
        {
            "key": "pze",
            "chainType": "EVM",
            "name": "Polygon zkEVM",
            "coin": "ETH",
            "id": 1101,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/zkevm.png",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x44d",
                "blockExplorerUrls": [
                    "https://zkevm.polygonscan.com/"
                ],
                "chainName": "Polygon zkEVM",
                "nativeCurrency": {
                    "name": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://zkevm-rpc.com"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 1101,
                "symbol": "ETH",
                "decimals": 18,
                "name": "ETH",
                "coinKey": "ETH",
                "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                "priceUSD": "2464.5"
            }
        },
        {
            "key": "bas",
            "chainType": "EVM",
            "name": "BASE",
            "coin": "ETH",
            "id": 8453,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/base.svg",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x2105",
                "blockExplorerUrls": [
                    "https://basescan.org/"
                ],
                "chainName": "BASE",
                "nativeCurrency": {
                    "name": "Ethereum",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://mainnet.base.org"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 8453,
                "symbol": "ETH",
                "decimals": 18,
                "name": "ETH",
                "coinKey": "ETH",
                "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                "priceUSD": "2469.720000000000000000"
            }
        },
        {
            "key": "ava",
            "chainType": "EVM",
            "name": "Avalanche",
            "coin": "AVAX",
            "id": 43114,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/avalanche.svg",
            "tokenlistUrl": "https://raw.githubusercontent.com/sushiswap/default-token-list/master/tokens/avalanche.json",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0xa86a",
                "blockExplorerUrls": [
                    "https://cchain.explorer.avax.network/"
                ],
                "chainName": "Avalanche Mainnet",
                "nativeCurrency": {
                    "name": "AVAX",
                    "symbol": "AVAX",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://api.avax.network/ext/bc/C/rpc"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 43114,
                "symbol": "AVAX",
                "decimals": 18,
                "name": "AVAX",
                "coinKey": "AVAX",
                "logoURI": "https://static.debank.com/image/avax_token/logo_url/avax/0b9c84359c84d6bdd5bfda9c2d4c4a82.png",
                "priceUSD": "36.090000000000000000"
            }
        },
        {
            "key": "lna",
            "chainType": "EVM",
            "name": "Linea",
            "coin": "ETH",
            "id": 59144,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/linea.svg",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0xe708",
                "blockExplorerUrls": [
                    "https://lineascan.build/"
                ],
                "chainName": "LINEA",
                "nativeCurrency": {
                    "name": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://rpc.linea.build"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 59144,
                "symbol": "ETH",
                "decimals": 18,
                "name": "ETH",
                "coinKey": "ETH",
                "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                "priceUSD": "2464.5"
            }
        },
        {
            "key": "dai",
            "chainType": "EVM",
            "name": "Gnosis",
            "coin": "DAI",
            "id": 100,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/gnosis.svg",
            "tokenlistUrl": "https://tokens.honeyswap.org/",
            "faucetUrls": [
                "https://stakely.io/faucet/xdai-chain"
            ],
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x64",
                "blockExplorerUrls": [
                    "https://blockscout.com/xdai/mainnet/"
                ],
                "chainName": "Gnosis Chain",
                "nativeCurrency": {
                    "name": "xDai",
                    "symbol": "xDai",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://rpc.gnosis.gateway.fm",
                    "https://rpc.gnosischain.com",
                    "https://rpc.ankr.com/gnosis"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 100,
                "symbol": "xDAI",
                "decimals": 18,
                "name": "xDAI Native Token",
                "coinKey": "DAI",
                "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
                "priceUSD": "0.999950000000000000"
            }
        },
        {
            "key": "ftm",
            "chainType": "EVM",
            "name": "Fantom",
            "coin": "FTM",
            "id": 250,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/fantom.svg",
            "tokenlistUrl": "https://raw.githubusercontent.com/SpookySwap/spooky-info/master/src/constants/token/spookyswap.json",
            "faucetUrls": [
                "https://stakely.io/faucet/fantom-blockchain-ftm",
                "https://docs.spookyswap.finance/getting-started/how-to-get-fantom-gas"
            ],
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0xfa",
                "blockExplorerUrls": [
                    "https://ftmscan.com/"
                ],
                "chainName": "Fantom Opera",
                "nativeCurrency": {
                    "name": "FTM",
                    "symbol": "FTM",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://rpc.ftm.tools/",
                    "https://rpcapi.fantom.network"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 250,
                "symbol": "FTM",
                "decimals": 18,
                "name": "FTM",
                "coinKey": "FTM",
                "logoURI": "https://static.debank.com/image/ftm_token/logo_url/ftm/33fdb9c5067e94f3a1b9e78f6fa86984.png",
                "priceUSD": "0.3859"
            }
        },
        {
            "key": "mor",
            "chainType": "EVM",
            "name": "Moonriver",
            "coin": "MOVR",
            "id": 1285,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/moonriver.svg",
            "tokenlistUrl": "https://raw.githubusercontent.com/sushiswap/default-token-list/master/tokens/moonriver.json",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x505",
                "blockExplorerUrls": [
                    "https://blockscout.moonriver.moonbeam.network/"
                ],
                "chainName": "Moonriver",
                "nativeCurrency": {
                    "name": "Moonriver",
                    "symbol": "MOVR",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://rpc.api.moonriver.moonbeam.network"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 1285,
                "symbol": "MOVR",
                "decimals": 18,
                "name": "MOVR",
                "coinKey": "MOVR",
                "logoURI": "https://assets.coingecko.com/coins/images/17984/small/9285.png",
                "priceUSD": "22.221"
            }
        },
        {
            "key": "moo",
            "chainType": "EVM",
            "name": "Moonbeam",
            "coin": "GLMR",
            "id": 1284,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/moonbeam.svg",
            "tokenlistUrl": "https://raw.githubusercontent.com/BeamSwap/beamswap-tokenlist/main/tokenlist.json",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x504",
                "blockExplorerUrls": [
                    "https://blockscout.moonbeam.network/"
                ],
                "chainName": "Moonbeam",
                "nativeCurrency": {
                    "name": "GLMR",
                    "symbol": "GLMR",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://rpc.api.moonbeam.network"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 1284,
                "symbol": "GLMR",
                "decimals": 18,
                "name": "GLMR",
                "coinKey": "GLMR",
                "logoURI": "https://s2.coinmarketcap.com/static/img/coins/64x64/6836.png",
                "priceUSD": "0.3889"
            }
        },
        {
            "key": "fus",
            "chainType": "EVM",
            "name": "FUSE",
            "coin": "FUSE",
            "id": 122,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/fuse.svg",
            "tokenlistUrl": "https://raw.githubusercontent.com/sushiswap/default-token-list/master/tokens/fuse.json",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x7a",
                "blockExplorerUrls": [
                    "https://explorer.fuse.io/"
                ],
                "chainName": "Fuse Mainnet",
                "nativeCurrency": {
                    "name": "FUSE",
                    "symbol": "FUSE",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://rpc.fuse.io"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 122,
                "symbol": "FUSE",
                "decimals": 18,
                "name": "FUSE",
                "coinKey": "FUSE",
                "logoURI": "https://s2.coinmarketcap.com/static/img/coins/64x64/5634.png",
                "priceUSD": "0.06168"
            }
        },
        {
            "key": "okt",
            "chainType": "EVM",
            "name": "OKXChain",
            "coin": "OKT",
            "id": 66,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/okx.svg",
            "tokenlistUrl": "https://raw.githubusercontent.com/sushiswap/default-token-list/master/tokens/okex.json",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x42",
                "blockExplorerUrls": [
                    "https://www.oklink.com/en/okc/"
                ],
                "chainName": "OKXChain Mainnet",
                "nativeCurrency": {
                    "name": "OKT",
                    "symbol": "OKT",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://exchainrpc.okex.org"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 66,
                "symbol": "OKT",
                "decimals": 18,
                "name": "OKT",
                "coinKey": "OKT",
                "logoURI": "https://static.debank.com/image/okt_token/logo_url/okt/1228cd92320b3d33769bd08eecfb5391.png",
                "priceUSD": "16.54"
            }
        },
        {
            "key": "bob",
            "chainType": "EVM",
            "name": "Boba",
            "coin": "ETH",
            "id": 288,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/boba.png",
            "tokenlistUrl": "https://raw.githubusercontent.com/OolongSwap/boba-community-token-list/main/build/boba.tokenlist.json",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x120",
                "blockExplorerUrls": [
                    "https://blockexplorer.boba.network/"
                ],
                "chainName": "Boba",
                "nativeCurrency": {
                    "name": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://mainnet.boba.network/"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 288,
                "symbol": "ETH",
                "decimals": 18,
                "name": "ETH",
                "coinKey": "ETH",
                "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
                "priceUSD": "2464.62"
            }
        },
        {
            "key": "aur",
            "chainType": "EVM",
            "name": "Aurora",
            "coin": "ETH",
            "id": 1313161554,
            "mainnet": true,
            "logoURI": "https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/aurora.png",
            "tokenlistUrl": "https://aurora.dev/tokens.json",
            "multicallAddress": "0xcA11bde05977b3631167028862bE2a173976CA11",
            "metamask": {
                "chainId": "0x4e454152",
                "blockExplorerUrls": [
                    "https://aurorascan.dev/"
                ],
                "chainName": "Aurora",
                "nativeCurrency": {
                    "name": "ETH",
                    "symbol": "ETH",
                    "decimals": 18
                },
                "rpcUrls": [
                    "https://mainnet.aurora.dev"
                ]
            },
            "nativeToken": {
                "address": "0x0000000000000000000000000000000000000000",
                "chainId": 1313161554,
                "symbol": "AETH",
                "decimals": 18,
                "name": "AETH",
                "coinKey": "AETH",
                "logoURI": "https://static.debank.com/image/aurora_token/logo_url/aurora/d61441782d4a08a7479d54aea211679e.png",
                "priceUSD": "2469.810000000000000000"
            }
        }
    ]
}