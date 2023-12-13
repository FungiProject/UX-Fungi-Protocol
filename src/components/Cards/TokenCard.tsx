// React
import React from "react";
// Types
import { assetType } from "@/types/Types";
// Utils
import formatNumber from "@/utils/formatNumber";
// Next
import Image from "next/image";

type TokenCardProps = {
  asset: assetType;
  getToken: (token: assetType) => void;
};

export default function TokenCard({ asset, getToken }: TokenCardProps) {
  return (
    <button
      className="px-4 py-2 rounded-xl w-full hover:bg-gray-100 flex justify-between items-center my-0.5 text-start"
      onClick={() => getToken(asset)}
      key={asset.symbol}
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
      </div>{" "}
      <div>{formatNumber(1000)}</div>
    </button>
  );
}
