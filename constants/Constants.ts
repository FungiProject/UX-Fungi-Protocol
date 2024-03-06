// Images
import HomeActive from "../public/HomeActive.svg";
import HomeDesactive from "../public/HomeDesactive.svg";
import SpotActive from "../public/SpotActive.svg";
import SpotDesactive from "../public/SpotDesactive.svg";
import YieldActive from "../public/YieldActive.svg";
import YieldDesactive from "../public/YieldDesactive.svg";
import PerpsActive from "../public/PerpsActive.svg";
import PerpsDesactive from "../public/PerpsDesactive.svg";
import CreditActive from "../public/CreditActive.svg";
import CreditDesactive from "../public/CreditDesactive.svg";
import NFTActive from "../public/NFTActive.svg";
import NFTDesactive from "../public/NFTDesactive.svg";

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
