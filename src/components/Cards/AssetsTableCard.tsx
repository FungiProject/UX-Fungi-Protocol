// React
import React from "react";
// Next
import Image from "next/image";
// Types
import { assetType } from "@/types/Types";
// Utils
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
      <div className="text-center">
        ${asset?.price !== undefined && formatNumber(asset.price)}
      </div>
      <div className="text-center">
        ${asset?.marketCap !== undefined && formatNumber(asset.marketCap)}
      </div>
      <div className="text-center">
        ${asset?.volumen24 !== undefined && formatNumber(asset.volumen24)}
      </div>
    </>
  );
  const porfolioPageChildren = (
    <>
      <div className="text-center">
        ${asset?.price !== undefined && formatNumber(asset.price)}
      </div>
      <div className="text-center">
        ${asset?.marketCap !== undefined && formatNumber(asset.marketCap)}
      </div>
      <div className="text-center">
        ${asset?.volumen24 !== undefined && formatNumber(asset.volumen24)}
      </div>
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
          className="ml-[50px] rounded-full"
        />
      </div>
      <div className="flex items-start flex-col col-span-2">
        <div>{asset.name}</div> <div>{asset.symbol}</div>
      </div>
      {isPortfolio ? porfolioPageChildren : assetsPageChildren}
    </div>
  );
}
