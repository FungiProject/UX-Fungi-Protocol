// React
import React from "react";
// Next
import Image from "next/image";
// Utils
import {formatNumber, formatAmount, formatAmountToUsd} from "@/utils/formatNumber";
import { networks } from "../../../../constants/Constants";
import { TokenData } from "@/domain/tokens/types";

type AssetsTableCardProps = {
  asset: TokenData;
  index: number;
  setTokenFrom: (TokenInfo) => void;
};

export default function AssetsTableCard({ asset, setTokenFrom }: AssetsTableCardProps) {
  return (
    <div className="border-b-1 border-gray-300 grid grid-cols-7 py-[22px] items-center fadeInAnimation border-l-4 hover:border-l-main border-l-white cursor-pointer">
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
        {asset?.token?.priceUSD !== undefined &&
          Number(asset?.token?.priceUSD).toFixed(2)}
      </div>
      <div className="text-center">
        $
        {asset?.token.balance !== undefined &&
          formatAmount(asset?.token?.balance.toString() || "0", asset?.token?.decimals).slice(0,9)}
      </div>
      <div className="text-center">
        $
        {asset?.token.balance !== undefined &&
        formatAmountToUsd(asset?.token?.balance.toString() || "0", asset?.token?.decimals, Number(asset?.token?.priceUSD))}
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
              key={asset.token.address + index}
            />
          );
        })}
      </div>
      <div className="justify-center flex">
        <button className="rounded-full bg-main px-[16px] py-[8px] w-[75px] text-center text-white mr-[15px] hover:bg-mainHover text-xs" onClick={()=>setTokenFrom(asset.token)}>
          Swap
        </button>
      </div>
    </div>
  );
}
