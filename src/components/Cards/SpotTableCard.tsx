// React
import React from "react";
// Next
import Image from "next/image";
// Types
import { assetType } from "@/types/Types";
// Utils
import formatNumber from "@/utils/formatNumber";
import { networks } from "../../../constants/Constants";
import { TokenData } from "@/domain/tokens/types";

type AssetsTableCardProps = {
  asset: TokenData;
  index: number;
};

export default function AssetsTableCard({ asset }: AssetsTableCardProps) {
  return (
    <div className="border-b-1 border-gray-300 grid grid-cols-7 py-[22px] items-center fadeInAnimation">
      <div className="flex items-center col-span-2">
        <img
          width={40}
          height={40}
          alt="Token Logo"
          src={asset.token.logoURI}
          className="ml-[36px] rounded-full"
        />
        <div className="flex items-start flex-col text-start ml-[30px]">
          <div>{asset.token.name}</div> <div>{asset.token.symbol}</div>
        </div>
      </div>
      <div className="text-center">
        $
        {asset?.tokenData?.price !== undefined &&
          formatNumber(asset.tokenData.price || 0)}
      </div>
      <div className="text-center">
        $
        {asset?.tokenData?.marketCap !== undefined &&
          formatNumber(asset.tokenData.marketCap || 0)}
      </div>
      <div className="text-center">
        $
        {asset?.tokenData?.volumen24 !== undefined &&
          formatNumber(asset.tokenData.volumen24 || 0)}
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
