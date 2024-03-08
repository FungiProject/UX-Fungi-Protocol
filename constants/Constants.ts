// Images
import HomeActive from "../public/navbar/HomeActive.svg";
import HomeDesactive from "../public/navbar/HomeDesactive.svg";
import SpotActive from "../public/navbar/SpotActive.svg";
import SpotDesactive from "../public/navbar/SpotDesactive.svg";
import YieldActive from "../public/navbar/YieldActive.svg";
import YieldDesactive from "../public/navbar/YieldDesactive.svg";
import PerpsActive from "../public/navbar/PerpsActive.svg";
import PerpsDesactive from "../public/navbar/PerpsDesactive.svg";
import CreditActive from "../public/navbar/CreditActive.svg";
import CreditDesactive from "../public/navbar/CreditDesactive.svg";
import NFTActive from "../public/navbar/NFTActive.svg";
import NFTDesactive from "../public/navbar/NFTDesactive.svg";
import Arbitrum from "../public/Arbitrum.svg";
import Polygon from "../public/Polygon.svg";

export const navigation = [
  {
    name: "Home",
    href: "/",
    imageActive: HomeActive.src,
    imageDesactive: HomeDesactive.src,
  },
  {
    name: "Spot",
    href: "/spot",
    imageActive: SpotActive.src,
    imageDesactive: SpotDesactive.src,
  },
  {
    name: "Perps",
    href: "/perpetuals",
    imageActive: PerpsActive.src,
    imageDesactive: PerpsDesactive.src,
  },
  {
    name: "Credit",
    href: "/credit",
    imageActive: CreditActive.src,
    imageDesactive: CreditDesactive.src,
  },
  {
    name: "Yield",
    href: "/yield",
    imageActive: YieldActive.src,
    imageDesactive: YieldDesactive.src,
  },
  {
    name: "NFTs",
    href: "/nfts",
    imageActive: NFTActive.src,
    imageDesactive: NFTDesactive.src,
  },
];

export const networks = [
  // { name: "Ethereum", id: 1, image: Mainnet.src, symbol: "ETH" },
  // {
  //   name: "Ethereum Sepolia",
  //   id: 11155111,
  //   image: Mainnet.src,
  //   symbol: "ETH Sepolia",
  // },
  { name: "Arbitrum One", id: 42161, image: Arbitrum.src, symbol: "ARB" },
  { name: "Arbitrum Sepolia", id: 421614, image: Arbitrum.src, symbol: "ARB" },
  // {
  //   name: "Arbitrum Goerli",
  //   id: 421613,
  //   image: Arbitrum.src,
  //   symbol: "ARB Goerli",
  // },
  { name: "Polygon", id: 137, image: Polygon.src, symbol: "POL" },
  // {
  //   name: "Polygon Mumbai",
  //   id: 80001,
  //   image: Polygon.src,
  //   symbol: "POL Mumbai",
  // },
];

export const actions = ["Swap", "Fees", "Deposit", "Withdraw"];

export const fundViews = ["Overview", "Portfolio", "Activity", "Members"];
