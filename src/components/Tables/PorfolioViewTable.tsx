// React
import React from "react";
// Types
import { assetType } from "@/types/Types";
// Components
import AssetsTableCard from "../Cards/AssetsTableCard";

type PorfolioViewTableProps = {
  assets: assetType[];
  startIndex: number;
  endIndex: number;
};

export default function PorfolioViewTable({
  assets,
  startIndex,
  endIndex,
}: PorfolioViewTableProps) {
  return (
    <div className="mt-[20px] w-full h-[574px] pt-[23px] px-[20px] bg-white rounded-lg">
      <div className="grid grid-cols-6 pb-[26px] text-xl font-medium px-10">
        <div></div>
        <div className="text-start col-span-2">Name</div>{" "}
        <div className="text-center">Price</div>{" "}
        <div className="text-center">Balance</div>{" "}
        <div className="text-center">Amount</div>
      </div>{" "}
      {assets
        .slice(startIndex, endIndex)
        .map((asset: assetType, index: number) => (
          <AssetsTableCard
            asset={asset}
            key={asset.name}
            index={index}
            isPortfolio={true}
          />
        ))}
    </div>
  );
}
