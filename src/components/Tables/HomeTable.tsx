// Types
import { positionType } from "@/types/Types";
// React
import React from "react";
// Components
import HomeTableCard from "../Cards/HomeTableCard";
import ActionsButton from "../Buttons/ActionsButton";
// Utils
import formatNumber from "@/utils/formatNumber";

type HomeTableProps = {
  positions: positionType[];
  getSelectedAction: (action: string) => void;
};

export default function HomeTable({
  positions,
  getSelectedAction,
}: HomeTableProps) {
  const balance = 958673.87;
  const cash = 102.34;
  return (
    <div className="w-full h-[574px] bg-white rounded-lg overflow-hidden">
      <div className="flex justify-between py-[35px] pl-[50px] pr-[22px]">
        <div className="flex justify-between">
          <p className="mr-[76px] font-medium">
            <span className="text-gray-400 mb-[4px]">My Balance</span>
            <br></br>
            <span className="text-3xl">${formatNumber(balance)}</span>
          </p>
          <p className="font-medium">
            <span className="text-gray-400 mb-[4px]">Cash</span>
            <br></br>
            <span className="text-3xl">${formatNumber(cash)}</span>
          </p>
        </div>
        <ActionsButton />
      </div>
      {positions.map((position: positionType, index: number) => (
        <HomeTableCard
          position={position}
          key={index}
          getSelectedAction={getSelectedAction}
        />
      ))}
    </div>
  );
}
