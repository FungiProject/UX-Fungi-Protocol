// React
import React, { ReactElement, useEffect, useState } from "react";
// Images
import USDC from "../../../public/MainnetTokens/USDC.svg";
// Next
import Image from "next/image";
// Components
import TxButton from "../Buttons/TxButton";
// Utils
import getMaxTokens from "@/utils/getMaxToken";
// Wagmi
import { useAccount, useNetwork } from "wagmi";
// Constants
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
  const [children, setChildren] = useState<ReactElement>(<span></span>);
  const [balance, setBalance] = useState<number | undefined>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const initialTxButton = () => {
    switch (actionSelected) {
      case "Deposit":
        setChildren(<span>Approve</span>);
        break;
      case "Fees":
        setChildren(<span>Claim</span>);
        break;
      case "Withdraw":
        setChildren(<span>Withdraw</span>);
        break;
      default:
        break;
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initialTxButton();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    initialTxButton();
  }, [actionSelected]);

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
            Balance: <span>{balance}</span>
            <button className="text-main ml-1.5" onClick={() => maxBalance()}>
              Max
            </button>
          </div>
        </div>
      </div>
      {!isLoading && (
        <TxButton className="bg-main w-full mt-[12px] rounded-2xl py-[16px] text-white font-semibold tracking-wider hover:bg-mainHover">
          {children}
        </TxButton>
      )}
    </main>
  );
}
