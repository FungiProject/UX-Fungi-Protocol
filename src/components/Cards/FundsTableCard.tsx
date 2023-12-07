// React
import React from "react";
// Next
import Image from "next/image";
import Link from "next/link";
// Types
import { fundType } from "@/types/Types";
// Utils
import formatNumber from "@/utils/formatNumber";

type HomeTableCardProps = { fund: fundType; isPortfolio: boolean };

export default function FundsTableCard({
  fund,
  isPortfolio,
}: HomeTableCardProps) {
  return (
    <div className="border-t-1 border-gray-300 grid grid-cols-7 py-[24px] items-center text-lg">
      <div className="flex col-span-2 items-center">
        {!isPortfolio && (
          <Image
            width={50}
            height={50}
            alt="Logo"
            src={fund.image}
            className="ml-[15px]"
          />
        )}
        <div className="ml-[30px]">{fund.name}</div>
      </div>
      <div className="text-center">${formatNumber(fund.aum)}</div>{" "}
      <div className="flex justify-center">
        {fund.networks.map((network: string, index: number) => {
          return (
            <Image
              style={{ zIndex: `${index * 10}` }}
              width={35}
              height={35}
              alt="Logo"
              src={network}
              className={index === 1 ? "-mx-2.5" : ""}
              key={network}
            />
          );
        })}
      </div>{" "}
      <div className="text-center">{fund.members}</div>{" "}
      <div className="flex justify-between col-span-2">
        {" "}
        <div
          className={`ml-[60px] ${
            fund.allTime < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {fund.allTime}
        </div>{" "}
        <Link
          className="rounded-full bg-main px-[10px] py-[8px] w-[75px] text-center text-white mr-[15px] hover:bg-mainHover"
          href={`/fund/${fund.href}`}
        >
          {isPortfolio ? "Open" : "Join"}
        </Link>
      </div>
    </div>
  );
}
