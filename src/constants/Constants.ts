// Images
import NetworkNavBar from "../../public/NetworkNavBar.svg";
import AssetsNavBar from "../../public/AssetsNavBar.svg";
import IntegrationsNavBar from "../../public/IntegrationsNavBar.svg";
import PortfolioNavBar from "../../public/PortfolioNavBar.svg";
import Planet from "../../public/Planet.svg";
import Coins from "../../public/Coins.svg";
import DefaultImage from "../../public/DefaultImage.svg";
// Arbitrum Tokens
import Chainlink from "../../public/ArbitrumTokens/Chainlink.jpeg";
import Polygon from "../../public/MainnetTokens/Polygon.svg";
import Mainnet from "../../public/MainnetTokens/Mainnet.svg";
import GMX from "../../public/ArbitrumTokens/GMX.svg";
import WBTC from "../../public/ArbitrumTokens/WBTC.jpeg";
import Tether from "../../public/ArbitrumTokens/Tether.jpeg";
import Dai from "../../public/ArbitrumTokens/Dai.jpeg";
import Lido from "../../public/ArbitrumTokens/Lido.jpeg";
import Curve from "../../public/ArbitrumTokens/Curve.jpeg";
import RocketPool from "../../public/ArbitrumTokens/RocketPool.jpeg";
import Stargate from "../../public/ArbitrumTokens/Stargate.jpeg";
import Radiant from "../../public/ArbitrumTokens/Radiant.jpeg";
import Gains from "../../public/ArbitrumTokens/Gains.jpeg";
import Joe from "../../public/ArbitrumTokens/Joe.jpeg";
import Magic from "../../public/ArbitrumTokens/Magic.jpeg";
import Pendle from "../../public/ArbitrumTokens/Pendle.jpeg";
import Spell from "../../public/ArbitrumTokens/Spell.jpeg";
import Balancer from "../../public/ArbitrumTokens/Balancer.jpeg";
import Frax from "../../public/ArbitrumTokens/Frax.jpeg";
import Sushi from "../../public/ArbitrumTokens/Sushi.jpeg";
// Mainnet Tokens
import Shiba from "../../public/MainnetTokens/Shiba.jpeg";
import Arbitrum from "../../public/ArbitrumTokens/Arbitrum.svg";
import Maker from "../../public/MainnetTokens/Maker.jpeg";
import Immutable from "../../public/MainnetTokens/Immutable.jpeg";
import Synthetix from "../../public/MainnetTokens/Synthetix.jpeg";
import Sand from "../../public/MainnetTokens/Sand.jpeg";
import Mana from "../../public/MainnetTokens/Mana.jpeg";
import Fantom from "../../public/MainnetTokens/Fantom.jpeg";
import ApeCoin from "../../public/MainnetTokens/ApeCoin.png";
import TheGraph from "../../public/MainnetTokens/TheGraph.jpeg";
import Compound from "../../public/MainnetTokens/Compound.jpeg";
import inch from "../../public/MainnetTokens/1inch.jpeg";
import BAT from "../../public/MainnetTokens/BAT.jpeg";
import Convex from "../../public/MainnetTokens/Convex.jpeg";
import Enjin from "../../public/MainnetTokens/Enjin.jpeg";
import Olympus from "../../public/MainnetTokens/Olympus.jpeg";
import ENS from "../../public/MainnetTokens/ENS.jpeg";
import Ankr from "../../public/MainnetTokens/Ankr.jpeg";
import Numeraire from "../../public/MainnetTokens/Numeraire.jpeg";
import Perpetual from "../../public/MainnetTokens/Perpetual.jpeg";
import YearnFinance from "../../public/MainnetTokens/YearnFinance.jpeg";
import AAVE from "../../public/MainnetTokens/AAVE.svg";
import Uniswap from "../../public/MainnetTokens/Uniswap.svg";
import USDC from "../../public/MainnetTokens/USDC.svg";

// import Ox from "../../public/MainnetTokens/Ox.jpeg";

export const navigation = [
  {
    name: "Network",
    href: "/",
    image: NetworkNavBar.src,
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    image: PortfolioNavBar.src,
  },
  {
    name: "Assets",
    href: "/assets",
    image: AssetsNavBar.src,
  },
  {
    name: "Integrations",
    href: "/integrations",
    image: IntegrationsNavBar.src,
  },
];

export const integrations = [
  {
    protocolImage: Uniswap.src,
    title: "Uniswap V2",
    description:
      "Swap, earn, and build on the leading decentralized crypto trading protocol.",
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    status: true,
  },
  {
    protocolImage: Uniswap.src,
    title: "Uniswap V3",
    description:
      "Swap, earn, and build on the leading decentralized crypto trading protocol.",
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    status: true,
  },
  {
    protocolImage: GMX.src,
    title: "GMX",
    description:
      "Decentralized exchange (DEX) for trading perpetual cryptocurrency futures.",
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    status: false,
  },
  {
    protocolImage: AAVE.src,
    title: "AAVE",
    description:
      "Decentralized liquidity protocol where users can participate as depositors or borrowers.",
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    status: false,
  },
];

export const homeCards = [
  {
    title: "Funds",
    amount: 0,
    imageHeight: 75,
    imageWidth: 75,
    imageSrc: Planet.src,
  },
  {
    title: "AUM",
    amount: 0,
    imageHeight: 70,
    imageWidth: 70,
    imageSrc: Coins.src,
  },
];

export const funds = [
  {
    name: "Block Fund",
    aum: 10000200,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 15,
    allTime: 23,
    href: "0x",
  },
  {
    name: "Flex Fund",
    aum: 100022400,
    networks: [Mainnet.src, Arbitrum.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -23,
    href: "0x",
  },
  {
    name: "Animal Fund",
    aum: 2000000,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 11345,
    allTime: 13,
    href: "0x",
  },
  {
    name: "Fungi Fund",
    aum: 10000,
    networks: [Mainnet.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -43,
    href: "0x",
  },
  {
    name: "Terminal Fund",
    aum: 100,
    networks: [Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 4345,
    allTime: 3,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 10000200,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 15,
    allTime: 23,
    href: "0x",
  },
  {
    name: "Flex Fund",
    aum: 100022400,
    networks: [Mainnet.src, Arbitrum.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -23,
    href: "0x",
  },
  {
    name: "Animal Fund",
    aum: 2000000,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 11345,
    allTime: 13,
    href: "0x",
  },
  {
    name: "Fungi Fund",
    aum: 10000,
    networks: [Mainnet.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -43,
    href: "0x",
  },
  {
    name: "Terminal Fund",
    aum: 100,
    networks: [Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 4345,
    allTime: 3,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 10000200,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 15,
    allTime: 23,
    href: "0x",
  },
  {
    name: "Flex Fund",
    aum: 100022400,
    networks: [Mainnet.src, Arbitrum.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -23,
    href: "0x",
  },
  {
    name: "Animal Fund",
    aum: 2000000,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 11345,
    allTime: 13,
    href: "0x",
  },
  {
    name: "Fungi Fund",
    aum: 10000,
    networks: [Mainnet.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -43,
    href: "0x",
  },
  {
    name: "Terminal Fund",
    aum: 100,
    networks: [Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 4345,
    allTime: 3,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 10000200,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 15,
    allTime: 23,
    href: "0x",
  },
  {
    name: "Flex Fund",
    aum: 100022400,
    networks: [Mainnet.src, Arbitrum.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -23,
    href: "0x",
  },
  {
    name: "Animal Fund",
    aum: 2000000,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 11345,
    allTime: 13,
    href: "0x",
  },
  {
    name: "Fungi Fund",
    aum: 10000,
    networks: [Mainnet.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -43,
    href: "0x",
  },
  {
    name: "Terminal Fund",
    aum: 100,
    networks: [Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 4345,
    allTime: 3,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 10000200,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 15,
    allTime: 23,
    href: "0x",
  },
  {
    name: "Flex Fund",
    aum: 100022400,
    networks: [Mainnet.src, Arbitrum.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -23,
    href: "0x",
  },
  {
    name: "Animal Fund",
    aum: 2000000,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 11345,
    allTime: 13,
    href: "0x",
  },
  {
    name: "Fungi Fund",
    aum: 10000,
    networks: [Mainnet.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -43,
    href: "0x",
  },
  {
    name: "Terminal Fund",
    aum: 100,
    networks: [Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 4345,
    allTime: 3,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 10000200,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 15,
    allTime: 23,
    href: "0x",
  },
  {
    name: "Flex Fund",
    aum: 100022400,
    networks: [Mainnet.src, Arbitrum.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -23,
    href: "0x",
  },
  {
    name: "Animal Fund",
    aum: 2000000,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 11345,
    allTime: 13,
    href: "0x",
  },
  {
    name: "Fungi Fund",
    aum: 10000,
    networks: [Mainnet.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -43,
    href: "0x",
  },
  {
    name: "Terminal Fund",
    aum: 100,
    networks: [Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 4345,
    allTime: 3,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 10000200,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 15,
    allTime: 23,
    href: "0x",
  },
  {
    name: "Flex Fund",
    aum: 100022400,
    networks: [Mainnet.src, Arbitrum.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -23,
    href: "0x",
  },
  {
    name: "Animal Fund",
    aum: 2000000,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 11345,
    allTime: 13,
    href: "0x",
  },
  {
    name: "Fungi Fund",
    aum: 10000,
    networks: [Mainnet.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -43,
    href: "0x",
  },
  {
    name: "Terminal Fund",
    aum: 100,
    networks: [Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 4345,
    allTime: 3,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 10000200,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 15,
    allTime: 23,
    href: "0x",
  },
  {
    name: "Flex Fund",
    aum: 100022400,
    networks: [Mainnet.src, Arbitrum.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -23,
    href: "0x",
  },
  {
    name: "Animal Fund",
    aum: 2000000,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 11345,
    allTime: 13,
    href: "0x",
  },
  {
    name: "Fungi Fund",
    aum: 10000,
    networks: [Mainnet.src],
    image: DefaultImage.src,
    members: 13445,
    allTime: -43,
    href: "0x",
  },
];

export const networks = [
  { name: "Ethereum", id: 1, image: Mainnet.src },
  { name: "Arbitrum One", id: 42161, image: Arbitrum.src },
  { name: "Polygon", id: 137, image: Polygon.src },
  { name: "Polygon Mumbai", id: 80001, image: Polygon.src },
];

export const assetsArbitrum = [
  {
    name: "Ethereum",
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    symbol: "ETH",
    coingeckoApi: "ethereum",
    image: Mainnet.src,
  },
  {
    name: "USD Tether",
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    symbol: "USDT",
    coingeckoApi: "tether",
    image: Tether.src,
  },
  {
    name: "USD Coin",
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    symbol: "USDC",
    coingeckoApi: "usd-coin",
    image: USDC.src,
  },
  {
    name: "Wrapped Bitcoin",
    address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    symbol: "WBTC",
    coingeckoApi: "wrapped-bitcoin",
    image: WBTC.src,
  },
  {
    name: "Chainlink ",
    address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    symbol: "LINK",
    coingeckoApi: "chainlink",
    image: Chainlink.src,
  },
  {
    name: "Dai",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    symbol: "DAI",
    coingeckoApi: "dai",
    image: Dai.src,
  },
  {
    name: "Uniswap",
    address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
    symbol: "UNI",
    coingeckoApi: "uniswap",
    image: Uniswap.src,
  },
  {
    name: "Lido",
    address: "0x13Ad51ed4F1B7e9Dc168d8a00cB3f4dDD85EfA60",
    symbol: "LDO",
    coingeckoApi: "ldo",
    image: Lido.src,
  },
  {
    name: "Arbitrum",
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    symbol: "ARB",
    coingeckoApi: "arbitrum",
    image: Arbitrum.src,
  },
  {
    name: "Curve DAO",
    address: "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978",
    symbol: "CRV",
    coingeckoApi: "curve-dao-token",
    image: Curve.src,
  },
  {
    name: "Rocket Pool",
    address: "0xB766039cc6DB368759C1E56B79AFfE831d0Cc507",
    symbol: "RPL",
    coingeckoApi: "rocket-pool",
    image: RocketPool.src,
  },
  {
    name: "GMX",
    address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    symbol: "GMX",
    coingeckoApi: "gmx",
    image: GMX.src,
  },
  {
    name: "Stargate Finance",
    address: "0x6694340fc020c5E6B96567843da2df01b2CE1eb6",
    symbol: "STG",
    coingeckoApi: "stargate-finance",
    image: Stargate.src,
  },
  {
    name: "Radiant Capital",
    address: "0x3082CC23568eA640225c2467653dB90e9250AaA0",
    symbol: "RDNT",
    coingeckoApi: "radiant-capital",
    image: Radiant.src,
  },
  {
    name: "Joe",
    address: "0x371c7ec6D8039ff7933a2AA28EB827Ffe1F52f07",
    symbol: "JOE",
    coingeckoApi: "joe",
    image: Joe.src,
  },
  {
    name: "Magic",
    address: "0x539bdE0d7Dbd336b79148AA742883198BBF60342",
    symbol: "MAGIC",
    coingeckoApi: "magic",
    image: Magic.src,
  },
  {
    name: "Gains Network",
    address: "0x18c11FD286C5EC11c3b683Caa813B77f5163A122",
    symbol: "GNS",
    coingeckoApi: "gains-network",
    image: Gains.src,
  },
  {
    name: "Pendle",
    address: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8",
    symbol: "PENDLE",
    coingeckoApi: "pendle",
    image: Pendle.src,
  },
  {
    name: "Spell",
    address: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
    symbol: "SPEll",
    coingeckoApi: "spell-token",
    image: Spell.src,
  },
  {
    name: "Balancer",
    address: "0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8",
    symbol: "BAL",
    coingeckoApi: "balancer",
    image: Balancer.src,
  },
  {
    name: "Frax Share",
    address: "0x9d2F299715D94d8A7E6F5eaa8E654E8c74a988A7",
    symbol: "FXS",
    coingeckoApi: "frax",
    image: Frax.src,
  },
  {
    name: "Sushi",
    address: "0xd4d42F0b6DEF4CE0383636770eF773390d85c61A",
    symbol: "SUSHI",
    coingeckoApi: "sushi",
    image: Sushi.src,
  },
];

export const assetsMainnet = [
  {
    name: "Ethereum",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    symbol: "ETH",
    coingeckoApi: "ethereum",
    image: Mainnet.src,
  },
  {
    name: "USD Tether",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    coingeckoApi: "tether",
    image: Tether.src,
  },
  {
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    coingeckoApi: "usd-coin-ethereum-bridged",
    image: USDC.src,
  },
  {
    name: "Matic",
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    symbol: "MATIC",
    coingeckoApi: "matic-network",
    image: Polygon.src,
  },
  {
    name: "Chainlink ",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    symbol: "LINK",
    coingeckoApi: "chainlink",
    image: Chainlink.src,
  },
  {
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    symbol: "WBTC",
    coingeckoApi: "wrapped-bitcoin",
    image: WBTC.src,
  },
  {
    name: "Shiba",
    address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    symbol: "SHIB",
    coingeckoApi: "shiba-inu",
    image: Shiba.src,
  },
  {
    name: "Dai",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "DAI",
    coingeckoApi: "dai",
    image: Dai.src,
  },
  {
    name: "Uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    symbol: "UNI",
    coingeckoApi: "uniswap",
    image: Uniswap.src,
  },
  {
    name: "Maker",
    address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    symbol: "MKR",
    coingeckoApi: "maker",
    image: Maker.src,
  },
  {
    name: "Lido",
    address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    symbol: "LDO",
    coingeckoApi: "ldo",
    image: Lido.src,
  },
  {
    name: "Arbitrum",
    address: "0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1",
    symbol: "ARB",
    coingeckoApi: "arbitrum",
    image: Arbitrum.src,
  },
  {
    name: "AAVE",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    symbol: "AAVE",
    coingeckoApi: "aave",
    image: AAVE.src,
  },
  {
    name: "The Graph",
    address: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
    symbol: "GRT",
    coingeckoApi: "the-graph",
    image: TheGraph.src,
  },
  {
    name: "Immutable",
    address: "0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF",
    symbol: "IMX",
    coingeckoApi: "immutable-x",
    image: Immutable.src,
  },
  {
    name: "Synthetix Network",
    address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
    symbol: "SNX",
    coingeckoApi: "havven",
    image: Synthetix.src,
  },
  {
    name: "The Sandbox",
    address: "0x3845badAde8e6dFF049820680d1F14bD3903a5d0",
    symbol: "SAND",
    coingeckoApi: "the-sandbox",
    image: Sand.src,
  },
  {
    name: "Decentraland",
    address: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
    symbol: "MANA",
    coingeckoApi: "decentraland",
    image: Mana.src,
  },
  {
    name: "Fantom",
    address: "0x4E15361FD6b4BB609Fa63C81A2be19d873717870",
    symbol: "FTM",
    coingeckoApi: "fantom",
    image: Fantom.src,
  },
  {
    name: "Curve DAO",
    address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    symbol: "CRV",
    coingeckoApi: "curve-dao-token",
    image: Curve.src,
  },
  {
    name: "Frax Share",
    address: "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0",
    symbol: "FXS",
    coingeckoApi: "frax",
    image: Frax.src,
  },
  {
    name: "Rocket Pool",
    address: "0xD33526068D116cE69F19A9ee46F0bd304F21A51f",
    symbol: "RPL",
    coingeckoApi: "rocket-pool",
    image: RocketPool.src,
  },
  {
    name: "ApeCoin",
    address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    symbol: "APE",
    coingeckoApi: "apecoin",
    image: ApeCoin.src,
  },
  {
    name: "Compound",
    address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
    symbol: "COMP",
    coingeckoApi: "compound-governance-token",
    image: Compound.src,
  },
  {
    name: "1inch",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    symbol: "1INCH",
    coingeckoApi: "1inch",
    image: inch.src,
  },
  {
    name: "Basic Attention",
    address: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
    symbol: "BAT",
    coingeckoApi: "basic-attention-token",
    image: BAT.src,
  },
  {
    name: "Convex Finance",
    address: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
    symbol: "CVX",
    coingeckoApi: "convex-finance",
    image: Convex.src,
  },
  {
    name: "Enjin Coin",
    address: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
    symbol: "ENJ",
    coingeckoApi: "enjincoin",
    image: Enjin.src,
  },
  {
    name: "Olympus",
    address: "0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5",
    symbol: "OHM",
    coingeckoApi: "olympus",
    image: Olympus.src,
  },
  {
    name: "Ethereum Name Service",
    address: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
    symbol: "ENS",
    coingeckoApi: "ethereum-name-service",
    image: ENS.src,
  },
  {
    name: "Sushi",
    address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
    symbol: "SUSHI",
    coingeckoApi: "sushi",
    image: Sushi.src,
  },
  {
    name: "Ankr Network",
    address: "0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4",
    symbol: "ANKR",
    coingeckoApi: "ankr",
    image: Ankr.src,
  },
  {
    name: "Balancer",
    address: "0xba100000625a3754423978a60c9317c58a424e3D",
    symbol: "BAL",
    coingeckoApi: "balancer",
    image: Balancer.src,
  },
  {
    name: "Numeraire",
    address: "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671",
    symbol: "NMR",
    coingeckoApi: "numeraire",
    image: Numeraire.src,
  },
  {
    name: "Perpetual",
    address: "0xbC396689893D065F41bc2C6EcbeE5e0085233447",
    symbol: "PERP",
    coingeckoApi: "perpetual-protocol",
    image: Perpetual.src,
  },
  {
    name: "Stargate Finance",
    address: "0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6",
    symbol: "STG",
    coingeckoApi: "stargate-finance",
    image: Stargate.src,
  },
  {
    name: "Yearn Finance",
    address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
    symbol: "YFI",
    coingeckoApi: "yearn-finance",
    image: YearnFinance.src,
  },
  {
    name: "Pendle",
    address: "0x808507121B80c02388fAd14726482e061B8da827",
    symbol: "PENDLE",
    coingeckoApi: "pendle",
    image: Pendle.src,
  },
  {
    name: "Spell",
    address: "0x090185f2135308BaD17527004364eBcC2D37e5F6",
    symbol: "SPEll",
    coingeckoApi: "spell-token",
    image: Spell.src,
  },
  // {
  //   name: "0x Protocol",
  //   address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
  //   symbol: "ZRX",
  //   coingeckoApi: "0x",
  //   image: Ox.src,
  // },
];

export const assetsPolygon = [
  {
    name: "Polygon",
    address: "",
    symbol: "MATIC",
    coingeckoApi: "matic-network",
    image: Polygon.src,
  },
  {
    name: "AAVE",
    address: "",
    symbol: "AAVE",
    coingeckoApi: "aave",
    image: AAVE.src,
  },
  {
    name: "Uniswap",
    address: "",
    symbol: "UNI",
    coingeckoApi: "uniswap",
    image: Uniswap.src,
  },
  {
    name: "USD Coin (PoS)",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    symbol: "USDC.e",
    coingeckoApi: "bridged-usdc-polygon-pos-bridge",
    image: USDC.src,
  },
];

export const assetsPolygonMumbai = [
  {
    name: "Polygon",
    address: "",
    symbol: "MATIC",
    coingeckoApi: "matic-network",
    image: Polygon.src,
  },
  {
    name: "AAVE",
    address: "",
    symbol: "AAVE",
    coingeckoApi: "aave",
    image: AAVE.src,
  },
  {
    name: "Uniswap",
    address: "",
    symbol: "UNI",
    coingeckoApi: "uniswap",
    image: Uniswap.src,
  },
  {
    name: "USD Coin (PoS)",
    address: "",
    symbol: "USDC.e",
    coingeckoApi: "bridged-usdc-polygon-pos-bridge",
    image: USDC.src,
  },
];

export const actions = ["Swap", "Fees", "Deposit", "Withdraw"];

export const fundViews = ["Overview", "Portfolio", "Activity", "Members"];

export const activities = [
  {
    type: "Swap",
    amountOut: "2000 LINK",
    amountIn: "3000 UNI",
    sender: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    receiver: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    time: 1701772887,
  },
  {
    type: "Deposit",
    amountOut: "2000 USDC.e",
    amountIn: null,
    sender: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    receiver: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    time: 1701742887,
  },
  {
    type: "Swap",
    amountOut: "2000 LINK",
    amountIn: "3000 UNI",
    sender: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    receiver: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    time: 1701772887,
  },
  {
    type: "Swap",
    amountOut: "2000 LINK",
    amountIn: "3000 UNI",
    sender: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    receiver: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    time: 1701772887,
  },
  {
    type: "Swap",
    amountOut: "2000 LINK",
    amountIn: "3000 UNI",
    sender: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    receiver: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    time: 1701772887,
  },
  {
    type: "Swap",
    amountOut: "2000 LINK",
    amountIn: "3000 UNI",
    sender: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    receiver: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    time: 1701772887,
  },
  {
    type: "Deposit",
    amountOut: "2000 USDC.e",
    amountIn: null,
    sender: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    receiver: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    time: 1701742887,
  },
  {
    type: "Swap",
    amountOut: "2000 LINK",
    amountIn: "3000 UNI",
    sender: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    receiver: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    time: 1701772887,
  },
  {
    type: "Deposit",
    amountOut: "2000 USDC.e",
    amountIn: null,
    sender: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    receiver: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    time: 1701742887,
  },
  {
    type: "Deposit",
    amountOut: "2000 USDC.e",
    amountIn: null,
    sender: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    receiver: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    time: 1701742887,
  },
  {
    type: "Swap",
    amountOut: "2000 LINK",
    amountIn: "3000 UNI",
    sender: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    receiver: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    time: 1701772887,
  },
  {
    type: "Deposit",
    amountOut: "2000 USDC.e",
    amountIn: null,
    sender: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    receiver: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    time: 1701742887,
  },
  {
    type: "Deposit",
    amountOut: "2000 USDC.e",
    amountIn: null,
    sender: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    receiver: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    time: 1701742887,
  },
  {
    type: "Swap",
    amountOut: "2000 LINK",
    amountIn: "3000 UNI",
    sender: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
    receiver: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    time: 1701772887,
  },
];
