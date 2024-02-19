// React
import React, { useEffect, useState } from "react";
// Components
import TokenDropdown from "../Dropdown/TokenDropdown";
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { useAlchemyAccountKitContext } from "@/lib/wallets/AlchemyAccountKitProvider";
import { useLiFiTx } from "./useLiFiTx";
import Button from "../Gmx/common/Buttons/Button";
import { helperToast } from "@/utils/gmx/lib/helperToast";
import BuyInputSection from "../Gmx/common/BuyInputSection/BuyInputSection";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { useUserOperations } from "@/hooks/useUserOperations";
import { formatTokenAmount } from "@/utils/gmx/lib/numbers";
import { TokenInfo } from "@/domain/tokens/types";

type SwapperProps = {
  tokens: TokenInfo[];
  chainId: number;
};

export default function Swapper({ tokens, chainId }: SwapperProps) {
  const { scAccount } = useWallet();

  const { alchemyProvider, login: openConnectModal } =
    useAlchemyAccountKitContext();
  const [amountFrom, setAmountFrom] = useState<number | undefined>(undefined);
  const [tokenFrom, setTokenFrom] = useState<TokenInfo | undefined>(undefined);
  const [tokenTo, setTokenTo] = useState<TokenInfo | undefined>(undefined);
  const [network, setNetwork] = useState<string | undefined>(undefined);
  const [fromAddress, setFromAddress] = useState(scAccount);
  const [toAddress, setToAddress] = useState(scAccount);
  const [slippage, setSlippage] = useState("0.1");
  const [amountToReceive, setAmountToReceive] = useState<number | undefined>(
    undefined
  );
  const {sendUserOperations} = useUserOperations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tx, sendTx] = useLiFiTx(
    "Swap",
    network,
    (Number(amountFrom) * 10 ** Number(tokenFrom?.decimals)).toString(),
    tokenFrom?.coinKey,
    network,
    tokenTo?.coinKey,
    fromAddress,
    toAddress,
    slippage
  );
  const [submitButtonState, setSubmitButtonState] = useState<{
    disabled: boolean;
    text: string | null;
  }>({ disabled: true, text: "Enter an amount" });

  useEffect(() => {
    if (tokenFrom && tokenTo && amountFrom) {
      setAmountToReceive(
        (amountFrom * Number(tokenFrom.priceUSD)) / Number(tokenTo.priceUSD)
      );
    } else {
      setAmountToReceive(0);
    }
  }, [amountFrom, tokenFrom, tokenTo]);

  useEffect(() => {
    if (scAccount) {
      setFromAddress(scAccount);
      setToAddress(scAccount);
    }
  }, [scAccount]);

  useEffect(() => {
    const submitButtonDisabled = typeof tx === "object" ? tx.disabled : true;
    const submitButtonText = typeof tx === "object" ? tx.text : "";

    setSubmitButtonState({
      text: submitButtonText,
      disabled: submitButtonDisabled,
    });
  }, [tx]);

  useEffect(() => {
    if (
      scAccount !== undefined &&
      amountFrom !== undefined &&
      tokenFrom !== undefined &&
      tokenTo !== undefined &&
      network !== undefined &&
      fromAddress !== undefined &&
      toAddress !== undefined &&
      slippage !== undefined
    ) {
      setSubmitButtonState({
        text: `Swap ${tokenFrom.coinKey}`,
        disabled: false,
      });
    }
    if (amountToReceive === 0) {
      setSubmitButtonState({
        text: "Enter an amount",
        disabled: true,
      });
    }
  }, [
    scAccount,
    amountFrom,
    tokenFrom,
    tokenTo,
    network,
    fromAddress,
    toAddress,
    slippage,
    amountToReceive,
  ]);

  useEffect(() => {
    if (chainId === 42161) {
      setNetwork("ARB");
    }
  }, [chainId]);

  function onSubmit() {
    setIsSubmitting(true);

    let txnPromise: Promise<any>;

    if (!scAccount) {
      openConnectModal?.();
      return;
    } else {
      txnPromise = onSubmitSwap();
    }
  }

  const onSubmitSwap = async () => {
    if (
      scAccount === undefined ||
      amountFrom === undefined ||
      tokenFrom === undefined ||
      tokenTo === undefined ||
      network === undefined ||
      fromAddress === undefined ||
      toAddress === undefined ||
      slippage === undefined ||
      typeof sendTx !== "function"
    ) {
      helperToast.error(`Error submitting order`);
      return Promise.resolve();
    }

    const resultTx: any = await sendTx();

    await sendUserOperations(resultTx);
  };

  function onSwitchTokens() {
    setTokenTo(tokenFrom || undefined);
    setTokenFrom(tokenTo || undefined);
  }

  const handleAmountChange = (amount: number) => {
    setAmountFrom(amount);
  };

  const getTokenTo = (token: TokenInfo) => {
    setTokenTo(token);
  };

  const getTokenFrom = (token: TokenInfo) => {
    setTokenFrom(token);
  };

  return (
    <main className="mt-[12px]">
      <div className="relative">
        <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px]">
          {/* <input
            type="number"
            step={0.0000001}
            min={0}
            className="outline-none placeholder:text-black"
            placeholder="0.00"
            value={amountFrom ?? ""}
            onChange={(e: any) => handleAmountChange(e.target.value)}
          />
          <div className="flex flex-col text-sm font-medium">
            <div className="flex flex-col text-sm font-medium">
              <TokenDropdown
                tokens={tokens}
                getToken={getTokenFrom}
                token={tokenFrom}
                oppositToken={tokenTo}
                type="From"
                className="flex justify-between w-[125px] rounded-full font-semibold px-[12px] py-2.5 items-center "
              />
            </div>
          </div> */}

          <BuyInputSection
            topLeftLabel={`Pay`}
            topLeftValue={
              amountFrom !== 0 &&
              amountFrom !== undefined &&
              tokenTo !== undefined
                ? `$${(amountFrom * Number(tokenFrom?.priceUSD)).toFixed(2)}`
                : ""
            }
            topRightLabel={`Balance`}
             topRightValue={formatTokenAmount(
              tokenFrom?.balance,
              tokenFrom?.decimals,
               "",
               {
                 useCommas: true,
               }
             )}
            // onClickTopRightLabel={onMaxClick}
            inputValue={amountFrom}
            onInputValueChange={(e: any) => handleAmountChange(e.target.value)}
            // showMaxButton={isNotMatchAvailableBalance}
            // onClickMax={onMaxClick}
          >
            <TokenDropdown
              tokens={tokens}
              getToken={getTokenFrom}
              token={tokenFrom}
              oppositToken={tokenTo}
              type="From"
              className="flex justify-between w-[125px] px-[12px] py-2.5 border-1 rounded-full font-semibold items-center "
            />
          </BuyInputSection>
        </div>
        <div
          className="flex items-center justify-center arrows-swapper-token rounded-xl absolute inset-0 top-[38%] bg-white"
          onClick={onSwitchTokens}
        >
          <ArrowsUpDownIcon className="h-7 w-7" />
        </div>
        <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px] mt-[24px]">
          <BuyInputSection
            topLeftLabel={`Receive`}
            topLeftValue={
              amountToReceive !== 0 &&
              amountToReceive !== undefined &&
              tokenTo !== undefined
                ? `$${(amountToReceive * Number(tokenTo?.priceUSD)).toFixed(2)}`
                : ""
            }
            topRightLabel={`Balance`}
             topRightValue={formatTokenAmount(
               tokenTo?.balance,
               tokenTo?.decimals,
               "",
               {
                 useCommas: true,
               }
             )}
            inputValue={amountToReceive?.toFixed(amountToReceive === 0 ? 2 : 5)}
            topRightValue={"0"}
            staticInput={true}
            showMaxButton={false}
            preventFocusOnLabelClick="right"
          >
            <TokenDropdown
              tokens={tokens}
              getToken={getTokenTo}
              token={tokenTo}
              oppositToken={tokenFrom}
              type="To"
              className="flex justify-between w-[125px] px-[12px] py-2.5 border-1 rounded-full font-semibold items-center "
            />
          </BuyInputSection>
        </div>{" "}
      </div>
      <Button
        variant="primary-action"
        className={`mt-4 ${
          submitButtonState.disabled ? "opacity-50" : ""
        } w-full bg-main rounded-xl py-3 text-white font-semibold`}
        type="submit"
        onClick={onSubmit}
        disabled={submitButtonState.disabled}
        // disabled={submitButtonState.disabled && !shouldDisableValidation}
      >
        {submitButtonState.text}
      </Button>
    </main>
  );
}
