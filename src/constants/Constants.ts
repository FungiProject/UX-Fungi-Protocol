import NetworkNavBar from "../../public/NetworkNavBar.svg";
import AssetsNavBar from "../../public/AssetsNavBar.svg";
import IntegrationsNavBar from "../../public/IntegrationsNavBar.svg";
import PortfolioNavBar from "../../public/PortfolioNavBar.svg";

import AAVE from "../../public/AAVE.svg";
import GMX from "../../public/GMX.svg";
import Uniswap from "../../public/Uniswap.svg";

import Polygon from "../../public/Polygon.svg";
import Mainnet from "../../public/Mainnet.svg";
import Arbitrum from "../../public/Arbitrum.svg";
import USDC from "../../public/USDC.svg";

import Planet from "../../public/Planet.svg";
import Coins from "../../public/Coins.svg";

import DefaultImage from "../../public/DefaultImage.svg";

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
    name: "USD Coin",
    address: "",
    symbol: "USDC",
    coingeckoApi: "usd-coin",
    image: USDC.src,
  },
];

export const assetsArbitrum = [
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
    name: "GMX",
    address: "",
    symbol: "GMX",
    coingeckoApi: "gmx",
    image: GMX.src,
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
];
