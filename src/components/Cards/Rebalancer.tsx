import React, { useEffect, useMemo, useState } from "react";
import Button from "../Gmx/common/Buttons/Button";
import TokenDropdown from "../Dropdown/TokenDropdown";
import { tokenType } from "@/types/Types";
import TokenCardRebalance from "./TokenCardRebalance";
import RebalanceSlider from "../Sliders/RebalanceSlider";
import {
  computeRebalance,
  getUserOpSwapLifi,
} from "@/utils/rebalancer/useRebalance";
import { BigNumber } from "ethers";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { sendUserOperations } from "@/utils/gmx/lib/userOperations/sendUserOperations";
import { useAlchemyAccountKitContext } from "@/lib/wallets/AlchemyAccountKitProvider";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchBar from "../Filters/SearchBar";
import TokenCard from "./TokenCard";

type RebalancerProps = {
  tokens: tokenType[];
  chainId: number;
};

export interface TokenRebalanceInput extends tokenType {
  percentage: number;
}

export interface TokenBalance extends tokenType {
  balance: BigNumber;
  totalValueUsd?: number;
}

export default function Rebalancer({ tokens, chainId }: RebalancerProps) {
  const { scAccount } = useWallet();
  const { alchemyProvider } = useAlchemyAccountKitContext();
  const [error, setError] = useState(false);
  const [totalPercentage, setTotalPercentage] = useState<number>(0);
  const [openSelector, setOpenSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<TokenRebalanceInput[]>([
    {
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      chainId: 42161,
      symbol: "DAI",
      decimals: 18,
      name: "DAI Stablecoin",
      coinKey: "DAI",
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
      priceUSD: "0.99985",
      percentage: 100,
    },
  ]);
  const [balancesTokens, setBalanceTokens] = useState<TokenBalance[]>([
    {
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      chainId: 42161,
      symbol: "USDC.e",
      decimals: 6,
      name: "Bridged USD Coin",
      coinKey: "USDCe",
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      priceUSD: "1",
      balance: BigNumber.from("4900000"),
    },
    {
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      chainId: 42161,
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin",
      coinKey: "USDC",
      logoURI:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      priceUSD: "1",
      balance: BigNumber.from("2950000"),
    },
  ]);
  const [search, setSearch] = useState<string>("");
  const [tokensArrayCopy, setTokensArrayCopy] = useState<tokenType[]>([
    ...tokens,
  ]);

  const getInfo = (query: string) => {
    setSearch(query);
  };

  useEffect(() => {
    const updatedTokensOptions = tokensArrayCopy.filter(
      (option) => option.coinKey !== "DAI"
    );
    setTokensArrayCopy(updatedTokensOptions);

    const sum = selectedTokens.reduce((acc, object) => {
      return acc + Number(object.percentage);
    }, 0);

    setTotalPercentage(sum);
    //TODO
    //Deberia poder elegir solo los tokens comunes en las chains que tenga balance. Obtener con connectiosn de lify?
    //setTokensOptions(tokens)
  }, []);

  const onAddToken = (token: tokenType) => {
    setSelectedTokens([
      ...selectedTokens,
      {
        ...token,
        percentage: 0,
      },
    ]);
    const updatedTokensOptions = tokensArrayCopy.filter(
      (option) => option.coinKey !== token.coinKey
    );
    setTokensArrayCopy(updatedTokensOptions);
  };

  const onRemoveToken = (token: tokenType) => {
    const updatedTokens = selectedTokens.filter(
      (selectedToken) => selectedToken.coinKey !== token.coinKey
    );
    setSelectedTokens([...updatedTokens]);
    setTokensArrayCopy([{ ...token }, ...tokensArrayCopy]);
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
    setIsSubmitting(true);

    const rebalances = computeRebalance(balancesTokens, selectedTokens);
    const userOps = await getUserOpSwapLifi(chainId, scAccount!, rebalances);

    let txnPromise: Promise<any> = sendUserOperations(
      alchemyProvider,
      chainId,
      userOps
    );

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
    <div className="relative">
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
              {tokensArrayCopy.map((token: tokenType) => {
                return (
                  <TokenCard
                    token={token}
                    getToken={onAddToken}
                    key={token.address}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col text-sm font-medium">
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
      <div className="grid grid-cols-3 w-full text-sm">
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
