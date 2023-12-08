// Alchemy
import { Alchemy, Network } from "alchemy-sdk";

export default async function getMaxTokens(
  walletAddress: `0x${string}`,
  tokenAddress: string,
  network: string
) {
  let networkSelected;

  if (network === "mainnet") {
    networkSelected = "eth-mainnet";
  } else if (network === "arbitrum") {
    networkSelected = "arb-mainnet";
  } else {
    networkSelected = "polygon-mumbai";
  }

  const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API,
    network: networkSelected as Network | undefined,
  };

  const alchemy = new Alchemy(config);
  let response = await alchemy.core.getTokenBalances(walletAddress, [
    tokenAddress,
  ]);

  return Number(response.tokenBalances[0].tokenBalance);
}
