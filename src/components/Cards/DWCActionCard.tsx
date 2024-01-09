// React
import React, { ReactElement, useEffect, useState } from "react";
// Components
import TxButton from "../Buttons/TxButton";
import TokenDropdown from "../Dropdown/TokenDropdown";
// Wagmi
import { useContractRead, useNetwork } from "wagmi";
// Constants
import {
  assetsArbitrum,
  assetsMainnet,
  assetsPolygon,
  assetsPolygonMumbai,
} from "../../../constants/Constants";
// Types
import { assetType } from "@/types/Types";
// Abis
import { abiERC20 } from "../../../abis/abis.json";
// Viem
import { formatUnits } from "viem";

type DWCActionCardProps = {
  actionSelected: string;
};

export default function DWCActionCard({ actionSelected }: DWCActionCardProps) {
  const [amountTo, setAmountTo] = useState<number | undefined>(undefined);
  const [children, setChildren] = useState<ReactElement>(<span></span>);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [assets, setAssets] = useState<assetType[] | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [tokenTo, setTokenTo] = useState<assetType | null>(null);
  const [maxBalanceTokenTo, setMaxBalanceTokenTo] = useState<null | number>(
    null
  );

  const { chain } = useNetwork();

  const { data: tokenToDecimals } = useContractRead({
    address: tokenTo?.address as `0x${string}`,
    abi: abiERC20,
    functionName: "decimals",
  });

  const handleAmountChange = (amount: number) => {
    setAmountTo(amount);
  };

  const initialTxButton = () => {
    switch (actionSelected) {
      case "Deposit":
        setChildren(<span>Approve</span>);
        break;
      case "Withdraw":
        setChildren(<span>Withdraw</span>);
        break;
      default:
        break;
    }
    setIsLoading(false);
  };

  const getTokenTo = (token: assetType) => {
    setTokenTo(token);
  };

  useEffect(() => {
    if (chain && chain.id === 80001) {
      setAssets(assetsPolygonMumbai);
      setNetwork("mumbai");
    } else if (chain && chain.id === 42161) {
      setAssets(assetsArbitrum);
      setNetwork("arbitrum");
    } else if (chain && chain.id === 1) {
      setAssets(assetsMainnet);
      setNetwork("mainnet");
    } else if (chain && chain.id === 137) {
      setAssets(assetsPolygon);
      setNetwork("polygon");
    }
  }, [chain]);

  useEffect(() => {
    initialTxButton();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    initialTxButton();
  }, [actionSelected]);
  console.log(tokenTo, maxBalanceTokenTo, tokenToDecimals);
  return (
    <main className="mt-[40px] ">
      <h1 className="text-2xl font-medium ml-[28px] mb-[16px]">
        {actionSelected}
      </h1>
      <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px]">
        <input
          type="number"
          step={0.0000001}
          min={0}
          className="outline-none placeholder:text-black"
          placeholder="0.00"
          value={amountTo}
          onChange={(e: any) => handleAmountChange(e.target.value)}
        />
        <div className="flex flex-col text-sm font-medium">
          <div className="flex flex-col text-sm font-medium">
            {assets && (
              <TokenDropdown
                assets={assets}
                getToken={getTokenTo}
                token={tokenTo}
                type="Token"
                oppositToken={null}
              />
            )}

            {tokenTo && maxBalanceTokenTo && tokenToDecimals !== undefined ? (
              <div className="mt-[6px] flex justify-end">
                Balance:{" "}
                <span className="ml-1">
                  {Number(
                    formatUnits(
                      maxBalanceTokenTo as unknown as bigint,
                      tokenToDecimals as number
                    )
                  ).toFixed(3)}
                </span>
                <button
                  className="text-main ml-1.5"
                  onClick={() => setAmountTo(100)}
                >
                  Max
                </button>
              </div>
            ) : (
              <div></div>
            )}
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
