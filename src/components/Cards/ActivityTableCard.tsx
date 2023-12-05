import React, { useEffect, useState } from "react";
import Image from "next/image";
import SearchIcon from "../../../public/SearchIcon.svg";
import { formatTimestampToDateActivity } from "@/utils/formatTimestampToDate";
import getEns from "@/utils/getEns";
import Loader from "../Loader/Spinner";

type ActivityTableCardProps = {
  activity: any;
};

export default function ActivityTableCard({
  activity,
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
    <main className="grid grid-cols-3 border-b-1 py-[32px] min-h-[150px]">
      <div className="flex flex-col">
        <span>{activity.type}</span>
        {activity.type === "Swap" && (
          <span>
            From: <span>{activity.amountIn}</span>
          </span>
        )}
        {activity.type === "Swap" ? (
          <span>
            To: <span>{activity.amountOut}</span>
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
      <div className="flex flex-col text-center justify-center h-full">
        {!isLoading ? (
          <span>
            By:{" "}
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
      <div className="flex flex-col text-end justify-center h-full">
        <span>{formatTimestampToDateActivity(activity.time * 1000)}</span>
      </div>
    </main>
  );
}
