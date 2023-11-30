import Image from "next/image";
import React from "react";

import { assetType } from "@/types/Types";
import formatNumber from "@/utils/formatNumber";

type AssetsTableCardProps = {
  asset: assetType;
  index: number;
  isPortfolio?: boolean;
};

export default function AssetsTableCard({
  asset,
  index,
  isPortfolio,
}: AssetsTableCardProps) {
  const assetsPageChildren = (
    <>
      {" "}
      <div className="text-center">${formatNumber(asset?.price)}</div>
      <div className="text-center">${formatNumber(asset.marketCap)}</div>
      <div className="text-center">${formatNumber(asset.volumen24)}</div>
    </>
  );
  const porfolioPageChildren = (
    <>
      <div className="text-center">${formatNumber(asset?.price)}</div>
      <div className="text-center">${formatNumber(asset.marketCap)}</div>
      <div className="text-center">${formatNumber(asset.volumen24)}</div>
    </>
  );

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
      {isPortfolio ? porfolioPageChildren : assetsPageChildren}
    </div>
  );
}
