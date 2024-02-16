// React
import React, { useEffect, useState } from "react";
// Types
import { tokenType } from "@/types/Types";
// Wagmi
import { useAccount, useNetwork } from "wagmi";
// Utils
import getMaxTokens from "@/utils/getMaxToken";
// Viem
import { formatUnits } from "viem";

type TokenCardProps = {
  token: tokenType;
  getToken: (token: tokenType) => void;
};

export default function TokenCard({ token, getToken }: TokenCardProps) {
  const [network, setNetwork] = useState<string | null>(null);
  const [balanceToken, setBalanceToken] = useState<null | number>(null);

  const { address } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    if (chain && chain.id === 80001) {
      setNetwork("mumbai");
    } else if (chain && chain.id === 42161) {
      setNetwork("arbitrum");
    } else if (chain && chain.id === 1) {
      setNetwork("mainnet");
    } else if (chain && chain.id === 137) {
      setNetwork("polygon");
    }
  }, [chain]);

  useEffect(() => {
    const fetchMax = async () => {
      if (address && network && token) {
        try {
          const result = await getMaxTokens(address, token?.address, network);
          setBalanceToken(result);
        } catch (error) {
          console.error("Error fetching max tokens of", token.symbol);
        }
      }
    };

    fetchMax();
  }, [address, network]);

  return (
    <button
      className="px-4 py-2 rounded-xl w-full hover:bg-gray-100 flex justify-between items-center my-0.5 text-start"
      onClick={() => getToken(token)}
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
      {balanceToken && Number(balanceToken) !== 0 ? (
        <div>
          {Number(
            formatUnits(
              balanceToken as unknown as bigint,
              token.decimals as number
            )
          ).toFixed(5)}
        </div>
      ) : (
        <div>0</div>
      )}
    </button>
  );
}
