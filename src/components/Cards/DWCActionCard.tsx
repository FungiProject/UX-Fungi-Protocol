import React, { useState } from "react";
import USDC from "../../../public/USDC.svg";
import Image from "next/image";
import TxButton from "../Buttons/TxButton";
import getMaxTokens from "@/utils/getMaxToken";
import { assetType } from "@/types/Types";
import { useAccount, useNetwork } from "wagmi";
import {
  assetsArbitrum,
  assetsMainnet,
  assetsPolygon,
  assetsPolygonMumbai,
} from "@/constants/Constants";

type DWCActionCardProps = {
  actionSelected: string;
};

export default function DWCActionCard({ actionSelected }: DWCActionCardProps) {
  const [amountTo, setAmountTo] = useState<number | undefined>(undefined);
  const { address } = useAccount();
  const { chain } = useNetwork();

  const handleAmountChange = (amount: number) => {
    setAmountTo(amount);
  };

  const maxBalance = () => {
    let assets;
    let network;
    if (chain && chain.id === 80001) {
      assets = assetsPolygonMumbai;
      network = "mumbai";
    } else if (chain && chain.id === 42161) {
      assets = assetsArbitrum;
      network = "atbitrum";
    } else if (chain && chain.id === 1) {
      assets = assetsMainnet;
      network = "mainnet";
    } else if (chain && chain.id === 137) {
      assets = assetsPolygon;
      network = "polygon";
    }
    if (assets && address && network) {
      const usdcAddress = assets.filter(
        (asset: any) => asset.symbol === "USDC.e" || asset.symbol === "USDC"
      );
      const balance = getMaxTokens(address, usdcAddress[0].address, network);
    }
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
            <button className="text-main ml-1.5" onClick={() => maxBalance()}>
              Max
            </button>
          </div>
        </div>
      </div>
      {/* <TxButton /> */}
    </main>
  );
}
