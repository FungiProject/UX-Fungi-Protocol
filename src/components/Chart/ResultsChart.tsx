// React
import React, { useState } from "react";
// Next
import Image from "next/image";
// Images
import Chart from "../../../public/Chart.svg";
// Utils
import formatNumber from "@/utils/formatNumber";

type ResultsChartProps = {
  personalBalance: number;
};

export default function ResultsChart({ personalBalance }: ResultsChartProps) {
  const [chartTime, setChartTime] = useState("1h");

  const timeButtons = ["1h", "1d", "7d", "1m", "ytd", "all"];

  return (
    <main className="h-[574px] flex flex-col mt-[24px]">
      <div className="flex justify-between">
        <div className=" flex flex-col">
          <span className="text-xl ml-[30px]">
            ${formatNumber(personalBalance)}
          </span>
        </div>
        <div className="text-xs items-center flex mr-[12px]">
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
