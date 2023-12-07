// Images
import NetworkNavBar from "../../public/NetworkNavBar.svg";
import AssetsNavBar from "../../public/AssetsNavBar.svg";
import IntegrationsNavBar from "../../public/IntegrationsNavBar.svg";
import PortfolioNavBar from "../../public/PortfolioNavBar.svg";
import Planet from "../../public/Planet.svg";
import Coins from "../../public/Coins.svg";
import DefaultImage from "../../public/DefaultImage.svg";
// Tokens Images
import AAVE from "../../public/AAVE.svg";
import GMX from "../../public/GMX.svg";
import Uniswap from "../../public/Uniswap.svg";
import USDC from "../../public/USDC.svg";
// Networks Images
import Polygon from "../../public/Polygon.svg";
import Mainnet from "../../public/Mainnet.svg";
import Arbitrum from "../../public/Arbitrum.svg";
// Arbitrum Tokens
import Chainlink from "../../public/ArbitrumTokens/Chainlink.jpeg";
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
    name: "Ukhezo Fund",
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
    name: "Ukhezo Fund",
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
    name: "Ukhezo Fund",
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
    name: "Ukhezo Fund",
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
    name: "Ukhezo Fund",
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
    name: "Ukhezo Fund",
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
    name: "Ukhezo Fund",
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
    name: "Etherium",
    address: "",
    symbol: "ETH",
    coingeckoApi: "ethereum",
    image: Mainnet.src,
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
    name: "Arbitrum",
    address: "",
    symbol: "ARB",
    coingeckoApi: "arbitrum",
    image: Arbitrum.src,
  },
  {
    name: "USD Coin (PoS)",
    address: "",
    symbol: "USDC.e",
    coingeckoApi: "usd-coin-ethereum-bridged",
    image: USDC.src,
  },
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
