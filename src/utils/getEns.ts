// Alchemy
import { Alchemy, Network } from "alchemy-sdk";

export default async function getEns(walletAddress: string) {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API,
    network: Network.ETH_MAINNET,
  };
  const alchemy = new Alchemy(config);

  const ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
  const nfts = await alchemy.nft.getNftsForOwner(walletAddress, {
    contractAddresses: [ensContractAddress],
  });

  return nfts.ownedNfts[0].name;
}
