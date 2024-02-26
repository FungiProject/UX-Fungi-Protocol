import React, { useEffect, useMemo, useState } from "react";
import Button from "../Gmx/common/Buttons/Button";
import TokenCardRebalance from "./TokenCardRebalance";
import {
  computeRebalance,
  getUserOpRebalance,
} from "@/domain/tokens/useRebalance";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { useUserOperations } from "@/hooks/useUserOperations";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchBar from "../Filters/SearchBar";
import TokenCard from "./TokenCard";
import { TokenInfo } from "@/domain/tokens/types";
import { useTokenBalances } from "@/hooks/useTokensBalances";
import { TokenInfoRebalanceInput } from "@/domain/tokens/types";
type RebalancerProps = {
  tokens: TokenInfo[];
};

export default function Rebalancer({ tokens }: RebalancerProps) {
  const { chainId, scAccount } = useWallet();
  const [error, setError] = useState(false);
  const [totalPercentage, setTotalPercentage] = useState<number>(0);
  const [openSelector, setOpenSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<
    TokenInfoRebalanceInput[]
  >([]);
  const [search, setSearch] = useState<string>("");
  const [tokensCopy, setTokensCopy] = useState<TokenInfo[]>([...tokens]);
  const { tokensBalances } = useTokenBalances();
  const { sendUserOperations } = useUserOperations();

  const getInfo = (query: string) => {
    setSearch(query);
  };

  const onAddToken = (token: TokenInfo) => {
    setSelectedTokens([
      ...selectedTokens,
      {
        ...token,
        percentage: 0,
      },
    ]);
    const updatedTokensOptions = tokensCopy.filter(
      (option) => option.coinKey !== token.coinKey
    );
    setTokensCopy(updatedTokensOptions);
  };

  const onRemoveToken = (token: TokenInfo) => {
    const updatedTokens = selectedTokens.filter(
      (selectedToken) => selectedToken.coinKey !== token.coinKey
    );
    setSelectedTokens([...updatedTokens]);
    setTokensCopy([{ ...token }, ...tokensCopy]);
  };

  const onPercentageChange = (coinKey: string, percentage: number) => {
    const updatedTokens = selectedTokens.map((token) => {
      if (token.coinKey === coinKey) {
        return { ...token, percentage };
      }
      return token;
    });

    setSelectedTokens(updatedTokens);
  };

  useEffect(() => {
    const sum = selectedTokens.reduce((acc, object) => {
      return acc + Number(object.percentage);
    }, 0);

    setTotalPercentage(sum);
  }, [selectedTokens]);

  async function onSubmit() {
    if (!tokensBalances || !selectedTokens || !chainId) {
      return;
    }

    setIsSubmitting(true);

    const rebalances = computeRebalance(tokensBalances, selectedTokens);
    const userOps = await getUserOpRebalance(chainId, scAccount!, rebalances);

    let txnPromise = sendUserOperations(userOps);

    txnPromise
      .then(() => {
        //onSubmitted();
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const submitButtonState = useMemo(() => {
    if (isSubmitting) {
      return {
        text: `Rebalancing...`,
        disabled: true,
      };
    }

    if (error) {
      return {
        text: error,
        disabled: true,
      };
    }

    if (!selectedTokens || selectedTokens.length === 0) {
      return {
        text: "Select tokens",
        disabled: true,
      };
    }

    if (!scAccount || scAccount.length === 0) {
      return {
        text: "Connect account",
        disabled: true,
      };
    }

    let text = "Rebalance";

    return {
      text,
      disabled: false,
    };
  }, [selectedTokens]);

  return (
    <div className="relative mt-10">
      {openSelector && (
        <div className="h-[630px] w-full absolute z-50 bg-white shadow-input rounded-xl">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white hover:text-gray-700 text-black focus:outline-none"
              onClick={() => setOpenSelector(false)}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-[25px] w-[25px]" aria-hidden="true" />
            </button>
          </div>
          <div className="sm:flex flex-col sm:items-start mt-[50px]">
            <div className="w-full border-b-1 px-[36px]">
              <div className=" text-start sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl">Select Tokens</h3>
              </div>
              <SearchBar
                getInfo={getInfo}
                query={search}
                classMain="rounded-xl text-black px-[22px] items-center w-full  outline-none placeholder:text-black bg-white flex shadow-searchBar my-[16px] "
                placeholder="Search token or paste address"
              />
            </div>

            <div className="px-[18px] w-full my-4 overflow-y-auto h-[520px]">
              {tokensCopy.map((token: TokenInfo) => {
                return (
                  <TokenCard
                    token={token}
                    onClick={onAddToken}
                    key={token.coinKey}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col text-sm font-medium mb-8">
        <div className="flex justify-center text-sm font-medium">
          <button
            className="flex justify-between border-1 rounded-xl font-semibold px-[12px] py-2.5 items-center w-[300px]"
            onClick={() => setOpenSelector(true)}
          >
            <span>Select tokens</span>{" "}
            <ChevronDownIcon
              className=" h-5 w-5 text-black"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      <h1 className="my-4 text-xl px-4">Selected Tokens</h1>
      <div className="bar">
        <div
          className="bar-filled"
          style={{ width: `${totalPercentage}%`, transitionDuration: "0.8s" }}
        />
      </div>
      <div className="grid grid-cols-3 w-full text-sm mb-8">
        <span>0%</span> <span className="text-center">50%</span>{" "}
        <span className="text-end">100%</span>
      </div>
      {selectedTokens &&
        selectedTokens.length > 0 &&
        selectedTokens.map((token) => (
          <TokenCardRebalance
            selectedTokens={selectedTokens}
            token={token}
            onRemove={onRemoveToken}
            onPercentageChange={onPercentageChange}
            key={token.coinKey}
          />
        ))}{" "}
      <div>
        <Button
          variant="primary-action"
          className={`mt-4 ${
            submitButtonState.disabled ? "opacity-50" : ""
          } w-full bg-main rounded-xl py-3 text-white font-semibold`}
          type="submit"
          onClick={onSubmit}
          disabled={submitButtonState.disabled}
        >
          {submitButtonState.text}
        </Button>
      </div>
    </div>
  );
}
