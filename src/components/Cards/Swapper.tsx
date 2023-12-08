// React
import React, { ReactElement, useEffect, useState } from "react";
// Components
import TxButton from "../Buttons/TxButton";
import TokenDropdown from "../Dropdown/TokenDropdown";
// Types
import { assetType } from "@/types/Types";
// Wagmi
import { useAccount, useNetwork } from "wagmi";
// Constants
import {
  assetsArbitrum,
  assetsMainnet,
  assetsPolygon,
  assetsPolygonMumbai,
} from "@/constants/Constants";
import getMaxTokens from "@/utils/getMaxToken";
import { formatUnits } from "viem";

type SwapperProps = {
  actionSelected: string;
};

export default function Swapper({ actionSelected }: SwapperProps) {
  const [amountTo, setAmountTo] = useState<number | undefined>(undefined);
  const [amountFrom, setAmountFrom] = useState<number | undefined>(undefined);
  const [children, setChildren] = useState<ReactElement>(<span></span>);
  const [balance, setBalance] = useState<number | undefined>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tokenFrom, setTokenFrom] = useState<assetType | null>(null);
  const [tokenTo, setTokenTo] = useState<assetType | null>(null);
  const [assets, setAssets] = useState<assetType[] | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  const [maxBalanceTokenFrom, setMaxBalanceTokenFrom] = useState<null | number>(
    null
  );
  const [maxBalanceTokenTo, setMaxBalanceTokenTo] = useState<null | number>(
    null
  );

  const { address } = useAccount();
  const { chain } = useNetwork();

  const handleAmountChange = (amount: number) => {
    setAmountTo(amount);
  };

  useEffect(() => {
    const fetchMax = async () => {
      if (address && network && tokenFrom) {
        try {
          const result = await getMaxTokens(
            address,
            tokenFrom?.address,
            network
          );
          setMaxBalanceTokenFrom(result);
        } catch (error) {
          console.error("Error fetching max tokens of", tokenFrom.symbol);
        }
      }
    };

    fetchMax();
  }, [tokenFrom]);

  useEffect(() => {
    const fetchMax = async () => {
      if (address && network && tokenTo) {
        try {
          const result = await getMaxTokens(address, tokenTo?.address, network);
          setMaxBalanceTokenTo(result);
        } catch (error) {
          console.error("Error fetching max tokens of", tokenTo.symbol);
        }
      }
    };

    fetchMax();
  }, [tokenTo]);

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

  const getTokenTo = (token: assetType) => {
    setTokenTo(token);
  };

  const getTokenFrom = (token: assetType) => {
    setTokenFrom(token);
  };

  return (
    <main className="mt-[58px] ">
      <div>
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
            value={amountFrom}
            onChange={(e: any) => handleAmountChange(e.target.value)}
          />
          <div className="flex flex-col text-sm font-medium">
            <div className="flex flex-col text-sm font-medium">
              {assets && (
                <TokenDropdown
                  assets={assets}
                  getToken={getTokenFrom}
                  token={tokenFrom}
                  oppositToken={tokenTo}
                  type="From"
                />
              )}

              {/* {tokenFrom && (
                <div>
                  Balance:{" "}
                  <span>
                    {maxBalanceTokenFrom &&
                      Number(
                        formatUnits(
                          maxBalanceTokenFrom as unknown as bigint,
                          18
                        )
                      ).toFixed(3)}
                  </span>
                  <button
                    className="text-main ml-1.5"
                    onClick={() => setAmountTo(maxBalanceTokenFrom)}
                  >
                    Max
                  </button>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[16px]">
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
            {assets && (
              <TokenDropdown
                assets={assets}
                getToken={getTokenTo}
                token={tokenTo}
                oppositToken={tokenFrom}
                type="To"
              />
            )}
            {/* {tokenTo && (
              <div>
                Balance:{" "}
                <span>
                  {maxBalanceTokenFrom &&
                    Number(
                      formatUnits(maxBalanceTokenTo as unknown as bigint, 18)
                    ).toFixed(3)}
                </span>
                <button
                  className="text-main ml-1.5"
                  onClick={() => setAmountTo(maxBalanceTokenTo)}
                >
                  Max
                </button>
              </div>
            )} */}
          </div>
        </div>
        <TxButton
          className={`bg-main w-full mt-[24px] rounded-2xl py-[16px] text-white font-semibold tracking-wider hover:bg-mainHover ${
            tokenTo && tokenFrom ? "opacity-100" : "opacity-30"
          }`}
          children={<span>Approve {tokenFrom?.symbol}</span>}
        />
        {/* <TxButton
          className={`bg-main w-full mt-[12px] rounded-2xl py-[16px] text-white font-semibold tracking-wider hover:bg-mainHover ${
            approve ? "opacity-100" : "opacity-30"
          }`}
          children={<span>Approve {tokenFrom?.symbol}</span>}
        /> */}
        <TxButton
          className={`bg-main w-full mt-[12px] rounded-2xl py-[16px] text-white font-semibold tracking-wider hover:bg-mainHover 
            opacity-30
          `}
          children={<span>Swap {tokenFrom?.symbol}</span>}
        />
      </div>
    </main>
  );
}
