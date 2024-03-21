// React
import React, { useEffect, useState } from "react";
// Components
import TokenDropdown from "../Dropdown/TokenDropdown";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useLiFiTx } from "./useLiFiTx";
import Button from "../Gmx/common/Buttons/Button";
import BuyInputSection from "../Gmx/common/BuyInputSection/BuyInputSection";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { formatAmountFree, formatTokenAmount } from "@/utils/gmx/lib/numbers";
import { TokenInfo } from "@/domain/tokens/types";
import useWallet from "@/hooks/useWallet";
import { createApproveTokensUserOp } from "@/lib/userOperations/getApproveUserOp";
import { BigNumber } from "ethers";
import { useNotification } from "@/context/NotificationContextProvider";
import { useSimUO } from "@/hooks/useSimUO";

type SwapperProps = {
  tokens: TokenInfo[];
  chainId: number;
  tokenFrom?: TokenInfo;
};

export default function Swapper({
  tokens,
  chainId,
  tokenFrom: tokenFromTable,
}: SwapperProps) {
  const { scAccount } = useWallet();
  const { showNotification } = useNotification();
  const { login: openConnectModal } = useWallet();
  const { sendUserOperations } = useUserOperations();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { simStatus, simTransfer } = useSimUO();
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const [tx, sendTx] = useLiFiTx(
    "Swap",
    chainId,
    (Number(amountFrom) * 10 ** Number(tokenFrom?.decimals)).toString(),
    tokenFrom?.address,
    chainId,
    tokenTo?.address,
    fromAddress,
    tokenFrom?.coinKey,
    toAddress,
    slippage
  );
  const [submitButtonState, setSubmitButtonState] = useState<{
    disabled: boolean;
    text: string | null;
  }>({ disabled: true, text: "Enter an amount" });

  const isNotMatchAvailableBalance = tokenFrom?.balance?.gt(0);

  useEffect(() => {
    setTokenFrom(tokenFromTable);
  }, [tokenFromTable]);

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

  // async function onSubmit2() {
  //   setIsSubmitting(true);
  //   const uo = createApproveTokensUserOp({
  //     tokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  //     spender: "0x28962eEdacA9D89b41fcE2D3A2e89A28469e1ecf",
  //     amount: BigNumber.from(1000000),
  //   });
  //   await sendUserOperations([uo], "OK");
  // }

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
      showNotification({
        message: "Error submitting order",
        type: "error",
      });
      return Promise.resolve();
    }
    showNotification({
      message: "Your transaction is being processed",
      type: "loading",
    });

    const resultTx: any = await sendTx();

    try {
      await sendUserOperations(resultTx);
    } catch (e) {
      showNotification({
        message: "Error submitting order",
        type: "error",
      });
    }
  };

  const simulateSwap = async () => {
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
      showNotification({
        message: "Error submitting order",
        type: "error",
      });
      return Promise.resolve();
    }
    try {
      const resultTx: any = await sendTx();
      const result = await simTransfer(resultTx);
      if (!result || result.error) {
        throw new Error(result?.error || "Simulation failed. No result returned.");
    }
    setSimulationResult(result);
    } catch (error: any) {
      showNotification({
        message: error.message,
        type: "error",
      });
      setSimulationResult(null);
    }
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

  function onMaxClick() {
    if (tokenFrom?.balance) {
      const formattedAmount = formatAmountFree(
        tokenFrom.balance,
        tokenFrom.decimals
      );
      handleAmountChange(Number(formattedAmount));
    }
  }

  return (
    <main className="mt-[12px]">
      <div className="relative">
        <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px]">
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
            onClickTopRightLabel={onMaxClick}
            inputValue={amountFrom}
            onInputValueChange={(e: any) => handleAmountChange(e.target.value)}
            showMaxButton={isNotMatchAvailableBalance}
            onClickMax={onMaxClick}
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
            inputValue={amountToReceive?.toFixed(amountToReceive === 0 ? 2 : 8)}
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
      >
        {submitButtonState.text}
      </Button>
      <button
        onClick={simulateSwap}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded"
        disabled={isSubmitting} // Assume isSubmitting indicates if a real transaction is in progress
      >
        Simulate Swap
      </button>
      {simulationResult ? (
        <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f7f7f7',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
            <h3 style={{ color: '#333' }}>Swap Summary</h3>
            {/* <p>Estimated Network Fee: {simulationResult.changes[0].amount} {simulationResult.changes[0].symbol}</p> */}
            {/* Use the last transaction as reference */}
            <div>
        {simulationResult && simulationResult.changes && (
          <>
            {/* Render the element at index 0 */}
            {simulationResult.changes[0] && (
              <div style={{ marginBottom: "10px" }}>
                <p>Fee: {simulationResult.changes[0].amount} {simulationResult.changes[0].symbol}</p>
                {/* <p>To: {simulationResult.changes[0].to}</p> */}
              </div>
            )}

            {/* Render the element at index 2 */}
            {simulationResult.changes[2] && (
              <div style={{ marginBottom: "10px" }}>
                <p>You will swap: {simulationResult.changes[2].amount} {simulationResult.changes[2].symbol}</p>
                {/* <p>To: {simulationResult.changes[2].to}</p> */}
              </div>
            )}

            {/* Render the last element */}
            {simulationResult.changes[simulationResult.changes.length - 3] && (
              <div style={{ marginBottom: "10px" }}>
                <p>For: {simulationResult.changes[simulationResult.changes.length - 3].amount} {simulationResult.changes[simulationResult.changes.length - 1].symbol}</p>
                {/* <p>To: {simulationResult.changes[simulationResult.changes.length - 1].to}</p> */}
              </div>
            )}
          </>
        )}
      </div>
                            </div>
                        ) : (
                            simStatus.loading ? (
                                <p>Loading...</p>
                            ) : simStatus.error ? (
                                <p style={{ color: 'red' }}>{simStatus.error}</p>
                            ) : null
                        )}
      {/* <Button
        variant="primary-action"
        className={`mt-4 ${
          submitButtonState.disabled ? "opacity-50" : ""
        } w-full bg-main rounded-xl py-3 text-white font-semibold`}
        onClick={onSubmit2}
      >
        Test
      </Button> */}
    </main>
  );
}
