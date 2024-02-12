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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<TokenRebalanceInput[]>(
    [
      {
        address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        chainId: 42161,
        symbol: "DAI",
        decimals: 18,
        name: "DAI Stablecoin",
        coinKey: "DAI",
        logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
        priceUSD: "0.99985",
        percentage: 100
      },
    ]
  );
  const [balancesTokens, setBalanceTokens] = useState<TokenBalance[]>([
    {
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      chainId: 42161,
      symbol: "USDC.e",
      decimals: 6,
      name: "Bridged USD Coin",
      coinKey: "USDCe",
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      priceUSD: "1",
      balance: BigNumber.from("4900000")
    },{
      address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      chainId: 42161,
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin",
      coinKey: "USDC",
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      priceUSD: "1",
      balance: BigNumber.from("2950000")
    },
  ]);
  const [onFocusToken, setOnFocusToken] =
    useState<TokenRebalanceInput | null>();
  const [tokensOptions, setTokensOptions] = useState<tokenType[]>(tokens);
  const [percentaje, setPercentaje] = useState(0);

  useEffect(() => {
    //TODO
    //Deberia poder elegir solo los tokens comunes en las chains que tenga balance. Obtener con connectiosn de lify?
    //setTokensOptions(tokens)
  }, []);

  const onSliderChange = (percentage: number) => {
    if (!onFocusToken) {
      return;
    }

    const updatedToken = { ...onFocusToken, percentage };
    console.log(updatedToken);
    setOnFocusToken(updatedToken);
    const updatedTokens = selectedTokens.map((token) =>
      token.coinKey === updatedToken.coinKey ? updatedToken : token
    );
    setSelectedTokens(updatedTokens);
  };

  const onAddToken = (token: tokenType) => {
    setSelectedTokens([
      ...selectedTokens,
      {
        ...token,
        percentage: 0,
      },
    ]);
    const updatedTokensOptions = tokensOptions.filter(
      (option) => option.coinKey !== token.coinKey
    );
    setTokensOptions(updatedTokensOptions);
  };

  const onRemoveToken = (token: tokenType) => {
    const updatedTokens = selectedTokens.filter(
      (selectedToken) => selectedToken.coinKey !== token.coinKey
    );
    setSelectedTokens([...updatedTokens]);
    setTokensOptions([{ ...token }, ...tokensOptions]);
  };


  async function onSubmit() {
    setIsSubmitting(true);


    const rebalances = computeRebalance(balancesTokens, selectedTokens);
    const userOps = await getUserOpSwapLifi(chainId, scAccount!, rebalances);

    console.log(userOps)

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
    <div>
      <div className="flex flex-col text-sm font-medium">
        <div className="flex flex-col text-sm font-medium">
          <TokenDropdown
            tokens={tokensOptions}
            getToken={onAddToken}
            token={undefined}
            type="Token"
            oppositToken={undefined}
            className="flex justify-between border-1 rounded-full font-semibold px-[12px] py-2.5 items-center "
          />
        </div>
        <div className="my-8">
          <RebalanceSlider
            value={percentaje}
            onChange={onSliderChange}
            marks={[0, 50, 100]}
          />
        </div>
      </div>

      <div>
        <Button
          variant="primary-action"
          className={`mt-4 ${
            submitButtonState.disabled ? "opacity-50" : ""
          } w-full bg-main rounded-xl py-3 text-white font-semibold`}
          type="submit"
          onClick={onSubmit}
          //disabled={submitButtonState.disabled}
        >
          {submitButtonState.text}
        </Button>
      </div>

      {selectedTokens &&
        selectedTokens.length > 0 &&
        selectedTokens.map((token) => (
          <div key={token.coinKey}>
            <TokenCardRebalance
              token={token}
              onRemove={onRemoveToken}
              onSelected={setOnFocusToken}
              isSelected={onFocusToken === token}
            />
          </div>
        ))}
    </div>
  );
}
