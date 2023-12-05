import { assetType } from "@/types/Types";
import React from "react";
import ActivityTableCard from "../Cards/ActivityTableCard";

type ActivityViewTableProps = {
  activities: any[];
  startIndex: number;
  endIndex: number;
};

export default function ActivityViewTable({
  activities,
  startIndex,
  endIndex,
}: ActivityViewTableProps) {
  return (
    <div className="mt-[20px] w-full h-[574px]  px-[20px] bg-white rounded-lg">
      {activities.slice(startIndex, endIndex).map((activity: any) => {
        return <ActivityTableCard activity={activity} key={activity.name} />;
      })}
    </div>
  );
}
