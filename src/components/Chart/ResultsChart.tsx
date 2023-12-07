// React
import React, { useState } from "react";
// Next
import Image from "next/image";
// Images
import Chart from "../../../public/Chart.svg";
// Utils
import formatNumber from "@/utils/formatNumber";

type ResultsChartProps = {
  performance?: number;
  aum?: number;
  personalBalance: number;
};

export default function ResultsChart({
  performance,
  aum,
  personalBalance,
}: ResultsChartProps) {
  const [chartTime, setChartTime] = useState("1h");

  const timeButtons = ["1h", "1d", "7d", "1m", "ytd", "all"];
  return (
    <main className="h-[574px] flex flex-col bg-white rounded-xl px-[40px] py-[16px] shadow-xl">
      <div className="flex justify-between">
        {performance && aum && (
          <div className="flex flex-col">
            <span className="text-lg xl:text-xl">AUM</span>
            <span className="text-xl xl:text-3xl">${formatNumber(aum)}</span>
          </div>
        )}
        <div className=" flex flex-col">
          <span className="text-lg xl:text-xl">My Balance</span>
          <span className="text-xl xl:text-3xl">
            ${formatNumber(personalBalance)}
          </span>
        </div>
        {performance && aum && (
          <div className=" flex flex-col">
            <span className="text-lg xl:text-xl">Performance</span>
            <span
              className={
                performance >= 0
                  ? "text-green-500 text-xl xl:text-3xl"
                  : "text-red-500 text-xl xl:text-3xl"
              }
            >
              {performance} %
            </span>
          </div>
        )}
        <div className="text-lg xl:text-xl items-center flex">
          {timeButtons.map((time: string) => {
            return (
              <button
                className={`mr-[4px] uppercase px-2  rounded-lg ${
                  chartTime === time
                    ? "bg-gray-100 text-black"
                    : "text-gray-400"
                }`}
                key={time}
                onClick={() => setChartTime(time)}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-full">
        <Image
          height={113}
          width={250}
          alt="User Image"
          src={Chart.src}
          className="mr-[8px]"
        />{" "}
        <span className="text-4xl">Chart coming Soon</span>
      </div>
    </main>
  );
}
