// React
import React, { useEffect, useState } from "react";
// Types
import { NetworkType, assetType, tokenType } from "@/types/Types";
// Next
import Image from "next/image";
// Wagmi
import { useAccount, useContractRead, useNetwork } from "wagmi";
// Abis
import { abiERC20 } from "../../../abis/abis.json";
// Utils
import getMaxTokens from "@/utils/getMaxToken";
// Viem
import { formatUnits } from "viem";

type NetworkCardProps = {
  network: NetworkType;
  getNetwork: (network: NetworkType) => void;
};

export default function NetworkCard({ network, getNetwork }: NetworkCardProps) {
  return (
    <button
      className="px-4 py-2 rounded-xl w-full hover:bg-gray-100 flex justify-between items-center my-0.5 text-start"
      onClick={() => getNetwork(network)}
    >
      <div className="pl-[46px] flex">
        <img
          width={46}
          height={46}
          alt={network.symbol}
          src={network.image}
          aria-hidden="true"
          className="mr-6 rounded-full"
        />
        <div className="flex flex-col">
          <span>{network.name}</span>
          <span>{network.symbol}</span>
        </div>
      </div>
    </button>
  );
}
