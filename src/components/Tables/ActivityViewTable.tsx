// React
import React from "react";
// Components
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
    <div className="mt-[20px] w-full h-[725px]  px-[20px] bg-white rounded-lg">
      {activities
        .slice(startIndex, endIndex)
        .map((activity: any, index: number) => {
          return (
            <ActivityTableCard
              activity={activity}
              key={activity.name}
              index={index}
            />
          );
        })}
    </div>
  );
}
