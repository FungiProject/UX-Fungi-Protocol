// React
import React, { useEffect, useState } from "react";
// Types
import { assetType } from "@/types/Types";
// Next
import Image from "next/image";
// Wagmi
import { useAccount, useContractRead, useNetwork } from "wagmi";
// Abis
import { abiERC20 } from "../../../abis/abis.json";
// Utils
import getMaxTokens from "@/utils/getMaxToken";
// Viem
import { formatUnits } from "viem";

type TokenCardProps = {
  asset: assetType;
  getToken: (token: assetType) => void;
};

export default function TokenCard({ asset, getToken }: TokenCardProps) {
  const [network, setNetwork] = useState<string | null>(null);
  const [balanceToken, setBalanceToken] = useState<null | number>(null);

  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data: tokenFromDecimals } = useContractRead({
    address: asset?.address as `0x${string}`,
    abi: abiERC20,
    functionName: "decimals",
  });

  useEffect(() => {
    if (chain && chain.id === 80001) {
      setNetwork("mumbai");
    } else if (chain && chain.id === 42161) {
      setNetwork("arbitrum");
    } else if (chain && chain.id === 1) {
      setNetwork("mainnet");
    } else if (chain && chain.id === 137) {
      setNetwork("polygon");
    }
  }, [chain]);

  useEffect(() => {
    const fetchMax = async () => {
      if (address && network && asset) {
        try {
          const result = await getMaxTokens(address, asset?.address, network);
          setBalanceToken(result);
        } catch (error) {
          console.error("Error fetching max tokens of", asset.symbol);
        }
      }
    };

    fetchMax();
  }, [address, network]);

  return (
    <button
      className="px-4 py-2 rounded-xl w-full hover:bg-gray-100 flex justify-between items-center my-0.5 text-start"
      onClick={() => getToken(asset)}
    >
      <div className="pl-[46px] flex">
        <Image
          width={46}
          height={46}
          alt="Network Image"
          src={asset.image}
          aria-hidden="true"
          className="mr-6 rounded-full"
        />
        <div className="flex flex-col">
          <span>{asset.name}</span>
          <span>{asset.symbol}</span>
        </div>
      </div>
      {balanceToken &&
      tokenFromDecimals !== undefined &&
      Number(balanceToken) !== 0 ? (
        <div>
          {Number(
            formatUnits(
              balanceToken as unknown as bigint,
              tokenFromDecimals as number
            )
          ).toFixed(5)}
        </div>
      ) : (
        <div>0</div>
      )}
    </button>
  );
}
