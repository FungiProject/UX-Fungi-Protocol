import React, { useState } from "react";
import USDC from "../../../public/USDC.svg";
import Image from "next/image";
import TxButton from "../Buttons/TxButton";

type DWCActionCardProps = {
  actionSelected: string;
};

export default function DWCActionCard({ actionSelected }: DWCActionCardProps) {
  const [amountTo, setAmountTo] = useState<number | undefined>(undefined);

  const handleAmountChange = (amount: number) => {
    setAmountTo(amount);
  };
  return (
    <main className="mt-[108px] ">
      <h1 className="text-4xl font-medium ml-[15px] mb-[30px]">
        {actionSelected}
      </h1>
      <div className="flex items-center justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[22px]">
        <input
          type="number"
          step={0.0000001}
          min={0}
          className="placeholder:text-gray-500 text-3xl outline-none"
          placeholder="0.00"
          value={amountTo}
          onChange={(e: any) => handleAmountChange(e.target.value)}
        />
        <div className="flex flex-col text-sm font-medium">
          <div className="flex items-center text-2xl justify-end">
            <span>USDC</span>
            <Image
              height={25}
              width={25}
              alt="USDC"
              src={USDC.src}
              className="ml-1.5"
            />
          </div>{" "}
          <div>
            Balance: <span>1000</span>
            <button
              className="text-main ml-1.5"
              onClick={() => setAmountTo(1000)}
            >
              Max
            </button>
          </div>
        </div>
      </div>
      {/* <TxButton /> */}
    </main>
  );
}
