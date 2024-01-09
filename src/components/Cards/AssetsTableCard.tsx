// React
import React from "react";
// Next
import Image from "next/image";
// Types
import { assetType } from "@/types/Types";
// Utils
import formatNumber from "@/utils/formatNumber";
import { networks } from "../../../constants/Constants";

type AssetsTableCardProps = {
  asset: assetType;
  index: number;
};

export default function AssetsTableCard({
  asset,
  index,
}: AssetsTableCardProps) {
  return (
    <div
      className={`${
        index !== 0 && "border-t-1 border-gray-300"
      } grid grid-cols-7 py-[24px] items-center`}
    >
      <div className="flex items-center col-span-2">
        <Image
          width={40}
          height={40}
          alt="Logo"
          src={asset.image}
          className="ml-[36px] rounded-full"
        />
        <div className="flex items-start flex-col text-start ml-[30px]">
          <div>{asset.name}</div> <div>{asset.symbol}</div>
        </div>
      </div>
      <div className="text-center">
        ${asset?.price !== undefined && formatNumber(asset.price)}
      </div>
      <div className="text-center">
        ${asset?.marketCap !== undefined && formatNumber(asset.marketCap)}
      </div>
      <div className="text-center">
        ${asset?.volumen24 !== undefined && formatNumber(asset.volumen24)}
      </div>
      <div className="flex justify-center">
        {/* TODO: Change to tokens network */}
        {networks.map((network: any, index: number) => {
          return (
            <Image
              style={{ zIndex: `${index * 10}` }}
              width={35}
              height={35}
              alt="Logo"
              src={network.image}
              className={index === 1 ? "-mx-2.5" : ""}
              key={network}
            />
          );
        })}
      </div>
      <div className="justify-center flex">
        <button className="rounded-full bg-main px-[16px] py-[8px] w-[75px] text-center text-white mr-[15px] hover:bg-mainHover text-xs">
          Swap
        </button>
      </div>
    </div>
  );
}
