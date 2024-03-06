// React
import React from "react";
// Components
import HomeTableCard from "../Cards/TableCards/HomeTableCard";
import ActionsButton from "../Buttons/ActionsButton";
// Utils
import formatNumber from "@/utils/formatNumber";
import { PositionInfo } from "@/domain/position/types";
import SpinnerLoader from "../Loader/SpinnerLoader";

type HomeTableProps = {
  positions: PositionInfo[];
  getSelectedAction: (action: string) => void;
  balance: number | undefined;
  cash: number | undefined;
};

export default function HomeTable({
  positions,
  getSelectedAction,
  balance,
  cash,
}: HomeTableProps) {
  return (
    <div className="w-full h-[574px] bg-white rounded-lg overflow-hidden">
      <div className="flex justify-between py-[35px] pl-[50px] pr-[22px] border-b-1">
        <div className="flex justify-between">
          <p className="mr-[76px] font-medium">
            <span className="text-gray-400 mb-[4px]">My Balance</span>
            <br></br>
            {balance !== undefined ? (
              <span className="text-3xl">${formatNumber(balance)}</span>
            ) : (
              <SpinnerLoader />
            )}
          </p>
          <p className="font-medium">
            <span className="text-gray-400 mb-[4px]">Cash</span>
            <br></br>
            {cash !== undefined ? (
              <span className="text-3xl">${formatNumber(cash)}</span>
            ) : (
              <SpinnerLoader />
            )}
          </p>
        </div>
        <ActionsButton />
      </div>
      {positions.map((position: PositionInfo, index: number) => (
        <HomeTableCard
          position={position}
          key={index}
          getSelectedAction={getSelectedAction}
        />
      ))}
    </div>
  );
}
