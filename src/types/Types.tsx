export type navigationType = {
  imageActive: string;
  imageDesactive: string;
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

export type positionType = {
  type: string;
  number: number;
  totalValue: number;
  unPnL: number;
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
