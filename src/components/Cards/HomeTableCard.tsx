// React
import React from "react";
// Next
import Image from "next/image";
// Types
import { positionType } from "@/types/Types";
// Utils
import formatNumber from "@/utils/formatNumber";

type HomeTableCardProps = { position: positionType };

export default function HomeTableCard({ position }: HomeTableCardProps) {
  return (
    <div className="border-t-1 border-gray-300 grid grid-cols-5 py-[24px] items-center text-xl font-medium">
      <div className="text-start ml-[40px]">{position.type}</div>
      <div className="text-center">
        {position.type === "Spot" ? "Nr. of tokens" : "Open positions"}
        <br></br>
        {position.number}
      </div>{" "}
      <div className="text-center">
        {" "}
        {position.type === "Spot" ? "Value of tokens" : "Collateral in"}
        <br></br>
        {formatNumber(position.totalValue)}
      </div>{" "}
      <div className="text-center">
        <span>Unrealized PnL</span>
        <br></br>
        <span
          className={`${
            position.unPnL < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {" "}
          ${formatNumber(position.unPnL)}
        </span>
      </div>
      <div className="justify-center flex">
        <button className="rounded-full bg-main px-[16px] py-[8px] w-[75px] text-center text-white mr-[15px] hover:bg-mainHover text-xs">
          Go
        </button>
      </div>
    </div>
  );
}
