// React
import React from "react";
// Next
import Image from "next/image";
// Images
import SearchIcon from "../../../public/SearchIcon.svg";
import CopyIcon from "../../../public/CopyIcon.svg";
// Utils
import { formatTimestampToDateActivity } from "@/utils/formatTimestampToDate";

type ActivityTableCardProps = {
  activity: any;
  index: number;
};

export default function ActivityTableCard({
  activity,
  index,
}: ActivityTableCardProps) {
  return (
    <main
      className={`grid grid-cols-3 ${
        index === 4 ? "" : "border-b-1"
      }  h-[145px] font-semibold`}
    >
      <div className="flex flex-col py-[27.5px] justify-center h-full">
        <span className="font-bold">{activity.type}</span>
        {activity.type === "Swap" && (
          <span>
            <span className="font-bold">From: </span>{" "}
            <span>{activity.amountIn}</span>
          </span>
        )}
        {activity.type === "Swap" ? (
          <span>
            <span className="font-bold">To:</span>{" "}
            <span>{activity.amountOut}</span>
          </span>
        ) : (
          <span>
            Amount: <span>{activity.amountOut}</span>
          </span>
        )}{" "}
      </div>
      <div className="flex items-center justify-center h-full py-[27.5px] ">
        <div>
          <div>Transaction hash:</div>
          <div>{activity.hash.substring(0, 10) + "..."}</div>
        </div>
        <div className="flex">
          <Image
            height={20}
            width={20}
            alt="User Image"
            src={CopyIcon.src}
            className="ml-[12px]"
          />
          <Image
            height={20}
            width={20}
            alt="User Image"
            src={SearchIcon.src}
            className="ml-[12px]"
          />
        </div>
      </div>
      <div className="flex flex-col text-end justify-center h-full py-[27.5px]">
        <span>{formatTimestampToDateActivity(activity.time * 1000)}</span>
      </div>
    </main>
  );
}
