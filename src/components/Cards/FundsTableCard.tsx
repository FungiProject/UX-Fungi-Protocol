import Image from "next/image";
import React from "react";

import Link from "next/link";
import { fundType } from "@/types/Types";

type HomeTableCardProps = { fund: fundType };

export default function FundsTableCard({ fund }: HomeTableCardProps) {
  return (
    <div className="border-t-1 border-gray-300 grid grid-cols-7 py-[24px] items-center">
      <div className="flex col-span-2 items-center">
        {" "}
        <Image
          width={50}
          height={50}
          alt="Logo"
          src={fund.image}
          className="ml-[15px]"
        />
        <div className="ml-[30px]">{fund.name}</div>
      </div>
      <div className="text-center">${fund.aum}</div>{" "}
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
          className="rounded-full bg-main px-[10px] py-[8px] w-[75px] text-center text-white mr-[15px]"
          href={`/fund/0x`}
        >
          Join
        </Link>
      </div>
    </div>
  );
}
