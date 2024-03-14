// React
import React from "react";
// Next
import Image from "next/image";
// Utils
import {
  formatNumber,
  formatAmount,
  formatAmountToUsd,
} from "@/utils/formatNumber";
import { networks } from "../../../../constants/Constants";

export default function SpotTableCardFallback() {
  return (
    <div className="border-b-1 border-gray-300 grid grid-cols-7 py-[22px] items-center fadeInAnimation border-l-4 hover:border-l-main border-l-white cursor-pointer">
      <div className="flex items-center col-span-2">
        <div className="ml-[36px] rounded-full w-[40px] h-[40px] bg-gray-300" />
        <div className="flex items-start flex-col text-start ml-[50px]">
          <div className="bg-gray-300 w-[80px] text-gray-300">a</div>
          <div className="bg-gray-300 w-[40px] text-gray-300 mt-2">a</div>
        </div>
      </div>
      <div className="bg-gray-300 w-[20px] text-gray-300 ml-16">a</div>
      <div className="bg-gray-300 w-[20px] text-gray-300 ml-14">a</div>
      <div className="bg-gray-300 w-[20px] text-gray-300 ml-14">a</div>
      <div className="flex justify-center -ml-10">
        {/* TODO: Change to tokens network */}
        {networks.map((network: any, index: number) => {
          return (
            <div
              style={{ zIndex: `${index * 10}` }}
              className={
                index === 1
                  ? "-mx-2.5 rounded-full w-[45px] h-[45px] bg-gray-300 text-gray-300"
                  : " rounded-full w-[45px] h-[45px] bg-gray-300 text-gray-300"
              }
              key={index}
            >
              a
            </div>
          );
        })}
      </div>
      <div className="justify-center flex">
        <button className="rounded-full bg-gray-300 px-[16px] py-[20px] w-[75px] text-center text-white mr-[15px]"></button>
      </div>
    </div>
  );
}
