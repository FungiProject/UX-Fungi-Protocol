// Types
import { assetType } from "@/types/Types";
// React
import React from "react";
// Components
import AssetsTableCard from "../Cards/AssetsTableCard";

type AssetsTableProps = {
  assets: assetType[];
  startIndex: number;
  endIndex: number;
};

export default function AssetsTable({
  assets,
  startIndex,
  endIndex,
}: AssetsTableProps) {
  return (
    <div className="mt-[20px] w-full h-[574px] pt-[23px] px-[20px] bg-white rounded-lg">
      <div className="grid grid-cols-6 pb-[26px] text-xl font-medium px-10">
        <div></div>
        <div className="text-start col-span-2">Name</div>{" "}
        <div className="text-center">Price</div>{" "}
        <div className="text-center">Market Cap</div>{" "}
        <div className="text-center">Volume (24h)</div>
      </div>{" "}
      {assets
        .slice(startIndex, endIndex)
        .map((asset: assetType, index: number) => (
          <AssetsTableCard asset={asset} key={asset.name} index={index} />
        ))}
    </div>
  );
}
