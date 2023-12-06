export type navigationType = {
  image: string;
  name: string;
  href: string;
};

export type integrationType = {
  protocolImage: string;
  title: string;
  description: string;
  networks: string[];
  status: boolean;
};

export type homeDataType = {
  title: string;
  amount: number;
  imageHeight: number;
  imageWidth: number;
  imageSrc: string;
};

export type fundType = {
  name: string;
  aum: number;
  networks: string[];
  image: string;
  members: number;
  allTime: number;
  href: string;
};

export type NetworkType = {
  name: string;
  id: number;
  image: string;
};

export type assetType = {
  name: string;
  address: string;
  symbol: string;
  coingeckoApi: string;
  image: string;
  price?: number;
  marketCap?: number;
  volumen24?: number;
};

export type memberType = {
  address: string;
  image: string;
};
