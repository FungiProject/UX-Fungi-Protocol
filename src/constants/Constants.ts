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
    aum: 1000000,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 1345,
    allTime: 23,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 1000000,
    networks: [Mainnet.src, Arbitrum.src],
    image: DefaultImage.src,
    members: 1345,
    allTime: -23,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 1000000,
    networks: [Mainnet.src, Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 1345,
    allTime: 13,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 1000000,
    networks: [Mainnet.src],
    image: DefaultImage.src,
    members: 1345,
    allTime: -43,
    href: "0x",
  },
  {
    name: "Block Fund",
    aum: 1000000,
    networks: [Arbitrum.src, Polygon.src],
    image: DefaultImage.src,
    members: 1345,
    allTime: 3,
    href: "0x",
  },
];

export const networks = [
  { name: "Mainnet", id: 1, image: Mainnet.src },
  { name: "Arbitrum", id: 42161, image: Arbitrum.src },
  { name: "Polygon Mumbai", id: 80001, image: Polygon.src },
];
