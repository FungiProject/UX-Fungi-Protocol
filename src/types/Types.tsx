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
