import Image from "next/image";
import React from "react";

import Link from "next/link";
import { assetType } from "@/types/Types";
import useCoinGeckoData from "@/hooks/useCoinGeckoData";

type AssetsTableCardProps = { asset: assetType; index: number };

export default function AssetsTableCard({
  asset,
  index,
}: AssetsTableCardProps) {
  return (
    <div className="border-t-1 border-gray-300 grid grid-cols-6 py-[24px] items-center px-10">
      <div className="flex items-center">
        {index + 1}
        <Image
          width={50}
          height={50}
          alt="Logo"
          src={asset.image}
          className="ml-[50px]"
        />
      </div>
      <div className="flex items-start flex-col col-span-2">
        <div>{asset.name}</div> <div>{asset.symbol}</div>
      </div>
      <div className="text-center">${asset?.price}</div>
      <div className="text-center">${asset.marketCap}</div>
      <div className="text-center">${asset.volumen24}</div>
    </div>
  );
}
