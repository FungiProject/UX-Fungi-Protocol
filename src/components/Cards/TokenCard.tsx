import React, { useEffect, useState } from "react";
import { tokenType } from "@/types/Types";
import { TokenInfo } from "@/domain/tokens/types";
import { BigNumber } from "alchemy-sdk";
import { ethers } from "ethers";

type TokenCardProps = {
  token: TokenInfo;
  onClick: (token: TokenInfo) => void;
};

export default function TokenCard({ token, onClick }: TokenCardProps) {

  return (
    <button
      className="px-4 py-2 rounded-xl w-full hover:bg-gray-100 flex justify-between items-center my-0.5 text-start"
      onClick={() => onClick(token)}
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
          <span>{token.name}</span>
          <span>{token.symbol}</span>
        </div>
      </div>
      {token.balance && !token.balance.eq(BigNumber.from(0)) ? (
        <div>
          {Number(ethers.utils.formatUnits(token.balance,token.decimals)).toFixed(5)}
        </div>
      ) : (
        <div>0</div>
      )}
    </button>
  );
}
