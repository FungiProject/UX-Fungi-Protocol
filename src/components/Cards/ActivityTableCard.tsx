// React
import React, { useEffect, useState } from "react";
// Next
import Image from "next/image";
// Images
import SearchIcon from "../../../public/SearchIcon.svg";
// Utils
import { formatTimestampToDateActivity } from "@/utils/formatTimestampToDate";
import getEns from "@/utils/getEns";
// Components
import Loader from "../Loader/Spinner";

type ActivityTableCardProps = {
  activity: any;
  index: number;
};

export default function ActivityTableCard({
  activity,
  index,
}: ActivityTableCardProps) {
  const [ensName, setEnsName] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEns();
  }, []);

  const fetchEns = async () => {
    let ens;
    try {
      ens = await getEns(activity.sender);
    } catch {
      ens = undefined;
    }

    setEnsName(ens);
    setIsLoading(false);
  };

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
        <div className="flex items-center">
          <span>{activity.receiver.substring(0, 10) + "..."}</span>
          <Image
            height={20}
            width={20}
            alt="User Image"
            src={SearchIcon.src}
            className="ml-[12px]"
          />
        </div>
      </div>
      <div className="flex flex-col text-center justify-center h-full py-[27.5px] ">
        {!isLoading ? (
          <span>
            <span className="font-bold">By: </span>
            {ensName !== undefined
              ? ensName
              : activity.sender.substring(0, 10) + "..."}
          </span>
        ) : (
          <div className="flex justify-center">
            <Loader />{" "}
          </div>
        )}
      </div>
      <div className="flex flex-col text-end justify-center h-full py-[27.5px]">
        <span>{formatTimestampToDateActivity(activity.time * 1000)}</span>
      </div>
    </main>
  );
}
