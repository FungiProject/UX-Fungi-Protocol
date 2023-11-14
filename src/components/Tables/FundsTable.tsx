import { funds } from "@/constants/Constants";
import { fundType } from "@/types/Types";
import React from "react";
import FundsTableCard from "../Cards/FundsTableCard";

export default function FundsTable() {
  return (
    <div className="mt-[20px] w-full h-[574px] pt-[23px] px-[20px] bg-white rounded-lg">
      <div className="grid grid-cols-7 pb-[26px] text-xl font-medium">
        <div className="col-span-2 ml-[100px]">Name</div>{" "}
        <div className="text-center">AUM</div>{" "}
        <div className="text-center">Networks</div>{" "}
        <div className="text-center">Members</div>
        <div className="col-span-2 ml-[40px]">All Time</div>
      </div>{" "}
      {funds.map((fund: fundType) => {
        return <FundsTableCard fund={fund} />;
      })}
    </div>
  );
}
