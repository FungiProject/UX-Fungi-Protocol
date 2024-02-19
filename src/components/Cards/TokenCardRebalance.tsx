// React
import React, { useEffect, useState } from "react";
import { tokenType } from "@/types/Types";
import { TokenInfoRebalanceInput } from "@/domain/tokens/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TokenInfo } from "@/domain/tokens/types";

type TokenCardProps = {
  token: TokenInfoRebalanceInput;
  selectedTokens: TokenInfoRebalanceInput[];
  onRemove: (token: TokenInfo) => void;
  onPercentageChange: (coinKey: string, percentage: number) => void;
};

export default function TokenCardRebalance({
  token,
  onRemove,
  onPercentageChange,
  selectedTokens,
}: TokenCardProps) {
  const [percentage, setPercentage] = useState<number>(token.percentage);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const setRemove = () => {
    onRemove(token);
  };

  const handlePercentageChange = (value: number) => {
    const sumOfPercentages = selectedTokens.reduce(
      (acc, token) => acc + token.percentage,
      0
    );
    const newSum = sumOfPercentages - percentage + value;
    if (newSum > 100) {
      setErrorMessage("The sum of percentages cannot exceed 100%.");
      setPercentage(0);
    } else {
      setPercentage(value);
      onPercentageChange(token.coinKey, value);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  }, [errorMessage]);

  return (
    <>
      {" "}
      <div className="relative rounded-xl text-black items-center w-[90%] outline-none placeholder:text-black bg-white flex shadow-searchBar my-[16px] mx-auto">
        <div
          className={`py-2 px-4 rounded-xl w-full flex justify-between items-center text-start`}
        >
          <div className="flex">
            <img
              width={46}
              height={46}
              alt={token.coinKey}
              src={token.logoURI}
              aria-hidden="true"
              className="mr-6 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-md">{token.name}</span>
              <span className="text-sm text-black/60">{token.symbol}</span>
            </div>
          </div>
          <span className="border-1 rounded-lg px-2 py-1">
            <input
              type="number"
              step={0.01}
              min={0}
              max={100}
              className="outline-none placeholder:text-black text-sm "
              placeholder="0.00"
              value={percentage ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handlePercentageChange(parseFloat(e.target.value))
              }
            />
            %
          </span>
        </div>
        <button
          type="button"
          className="absolute -top-1.5 -right-3 mr-2 rounded-md hover:text-gray-700 text-black focus:outline-none"
          onClick={setRemove}
        >
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>
      {errorMessage && (
        <p className="text-red-500 w-[90%] mx-auto">{errorMessage}</p>
      )}
    </>
  );
}
