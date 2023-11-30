import React, { useState } from "react";
import Image from "next/image";
import Chart from "../../../public/Chart.svg";
import formatNumber from "@/utils/formatNumber";

type ResultsChartProps = {
  performance: number;
  aum: number;
  personalBalance: number;
};

export default function ResultsChart({
  performance,
  aum,
  personalBalance,
}: ResultsChartProps) {
  const [chartTime, setChartTime] = useState("1h");
  return (
    <main className="h-[574px] flex flex-col bg-white rounded-xl px-[40px] py-[16px] shadow-xl">
      <div className="flex justify-between">
        <div className=" flex flex-col">
          <span className="text-xl">AUM</span>
          <span className="text-3xl">${formatNumber(aum)}</span>
        </div>
        <div className=" flex flex-col">
          <span className="text-xl">My Balance</span>
          <span className="text-3xl">${formatNumber(personalBalance)}</span>
        </div>
        <div className=" flex flex-col">
          <span className="text-xl">Performance</span>
          <span
            className={
              performance >= 0
                ? "text-green-500 text-3xl"
                : "text-red-500 text-3xl"
            }
          >
            {performance} %
          </span>
        </div>
        <div className="text-xl">
          <button className="mr-[6px]" onClick={() => setChartTime("1h")}>
            1H
          </button>
          <button className="mx-[6px]" onClick={() => setChartTime("1d")}>
            1D
          </button>
          <button className="mx-[6px]" onClick={() => setChartTime("7d")}>
            7D
          </button>
          <button className="mx-[6px]" onClick={() => setChartTime("1m")}>
            1M
          </button>
          <button className="mx-[6px]" onClick={() => setChartTime("ytd")}>
            YTD
          </button>
          <button className="ml-[6px]" onClick={() => setChartTime("all")}>
            ALL
          </button>
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
