// React
import React, { useEffect, useState } from "react";
// Components
import TokenDropdown from "../Dropdown/TokenDropdown";
// Axios
import axios from "axios";
// Constants
import Arbitrum from "../../../public/ArbitrumTokens/Arbitrum.svg";
// Types
import { TokenInfo } from "@/domain/tokens/types";
import { NetworkType } from "@/types/Types";
import useWallet from "@/hooks/useWallet";
import { useUserOperations } from "@/hooks/useUserOperations";
import { useLiFiTx } from "./useLiFiTx";
import BuyInputSection from "../Gmx/common/BuyInputSection/BuyInputSection";
import Button from "../Gmx/common/Buttons/Button";
import NetworkDropdown from "../Dropdown/NetworkDropdown";
import { networks } from "../../../constants/Constants";
import { formatTokenAmount } from "@/utils/gmx/lib/numbers";
import { useNotification } from "@/context/NotificationContextProvider";

type BridgeProps = {
  tokens: TokenInfo[];
  chainId: number;
};

export default function Bridge({ tokens, chainId }: BridgeProps) {
  const { scAccount } = useWallet();
  const { showNotification } = useNotification();
  const { login } = useWallet();
  const { sendUserOperations } = useUserOperations();
  const [amountFrom, setAmountFrom] = useState<number | undefined>(undefined);
  const [tokenFrom, setTokenFrom] = useState<TokenInfo | undefined>(undefined);
  const [tokenTo, setTokenTo] = useState<TokenInfo | undefined>(undefined);
  const [networkFrom, setNetworkFrom] = useState<NetworkType | undefined>(
    undefined
  );
  const [networkTo, setNetworkTo] = useState<NetworkType | undefined>(
    undefined
  );
  const [fromAddress, setFromAddress] = useState(scAccount);
  const [toAddress, setToAddress] = useState(scAccount);
  const [slippage, setSlippage] = useState("0.1");
  const [amountToReceive, setAmountToReceive] = useState<number | undefined>(
    undefined
  );

  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tx, sendTx] = useLiFiTx(
    "Bridge",
    networkFrom?.symbol,
    (Number(amountFrom) * 10 ** Number(tokenFrom?.decimals)).toString(),
    tokenFrom?.coinKey,
    networkTo?.symbol,
    tokenTo?.coinKey,
    fromAddress,
    toAddress,
    slippage
  );

  const [submitButtonState, setSubmitButtonState] = useState<{
    disabled: boolean;
    text: string | null;
  }>({ disabled: true, text: "Enter an amount" });

  const [connections, setConnections] = useState();

  const isNotMatchAvailableFromBalance = tokenFrom?.balance?.gt(0);
  const isNotMatchAvailableToBalance = tokenFrom?.balance?.gt(0);

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
      networkTo !== undefined &&
      networkFrom !== undefined &&
      fromAddress !== undefined &&
      toAddress !== undefined &&
      slippage !== undefined
    ) {
      setSubmitButtonState({
        text: `Bridge ${tokenFrom.coinKey}`,
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
    networkFrom,
    networkTo,
    fromAddress,
    toAddress,
    slippage,
    amountToReceive,
  ]);

  useEffect(() => {
    if (chainId === 42161) {
      setNetworkFrom({
        name: "Arbitrum One",
        id: 42161,
        image: Arbitrum.src,
        symbol: "ARB",
      });
    }
  }, [chainId]);

  useEffect(() => {
    const getConnections = async (
      fromChain: string,
      toChain: string,
      fromToken: string
    ) => {
      const result = await axios.get("https://li.quest/v1/connections", {
        params: {
          fromChain,
          toChain,
          fromToken,
        },
      });

      setConnections(result.data.connections[0].toTokens);
      setConnectionsLoading(false);
    };

    return () => {
      if (
        networkFrom !== undefined &&
        networkTo !== undefined &&
        tokenFrom !== undefined
      ) {
        getConnections(networkFrom.symbol, networkTo.symbol, tokenFrom.symbol);
      }
    };
  }, [networkFrom, networkTo, tokenFrom, amountFrom]);

  useEffect(() => {
    setConnectionsLoading(false);
  }, [connections]);

  function onSubmit() {
    setIsSubmitting(true);

    let txnPromise: Promise<any>;

    if (!scAccount) {
      login();
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
      networkFrom === undefined ||
      networkTo === undefined ||
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

    const resultTx: any = await sendTx();

    await sendUserOperations(resultTx).then(() =>
      showNotification({
        message: "Bridge complete",
        type: "success",
      })
    );
  };

  const handleAmountChange = (amount: number) => {
    setAmountFrom(amount);
  };

  const getTokenTo = (token: TokenInfo) => {
    setTokenTo(token);
  };

  const getTokenFrom = (token: TokenInfo) => {
    setTokenFrom(token);
  };

  const getNetworkTo = (network: NetworkType) => {
    setNetworkTo(network);
  };

  const getNetworkFrom = (network: NetworkType) => {
    setNetworkFrom(network);
  };

  const onMaxClickFrom = () => {
    if (tokenFrom?.balance) {
      const formattedAmount = formatTokenAmount(
        tokenFrom?.balance,
        tokenFrom?.decimals,
        "",
        {
          useCommas: true,
        }
      );

      setAmountFrom(Number(formattedAmount));
    }
  };

  return (
    <main className="mt-[12px]">
      <div className="relative">
        <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[150px]">
          <BuyInputSection
            topLeftLabel={`Pay`}
            topLeftValue={
              amountFrom !== 0 &&
              amountFrom !== undefined &&
              tokenTo !== undefined
                ? `$${(amountFrom * Number(tokenFrom?.priceUSD)).toFixed(2)}`
                : ""
            }
            bridgeComponent={
              <div className="flex flex-col">
                <TokenDropdown
                  tokens={tokens}
                  getToken={getTokenFrom}
                  token={tokenFrom}
                  oppositToken={tokenTo}
                  type="From"
                  className="flex justify-between w-[125px] px-[12px] py-2.5 border-1 rounded-full font-semibold items-center "
                />
                <span className="text-xs mt-2 text-gray-500 ml-2">
                  From this token
                </span>
              </div>
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
            onClickTopRightLabel={onMaxClickFrom}
            inputValue={amountFrom}
            onInputValueChange={(e: any) => handleAmountChange(e.target.value)}
            showMaxButton={isNotMatchAvailableFromBalance}
            onClickMax={onMaxClickFrom}
          >
            <div className="flex flex-col">
              {/* Change to network selector */}
              <NetworkDropdown
                networks={networks}
                getNetwork={getNetworkFrom}
                network={networkFrom}
                type="On"
                className="flex justify-between w-[125px] rounded-full font-semibold items-center "
              />
              <span className="text-xs text-end mt-2 text-gray-500">
                On this network
              </span>
            </div>
          </BuyInputSection>
        </div>
        <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[150px] mt-[12px]">
          <BuyInputSection
            topLeftLabel={`Receive`}
            topLeftValue={
              amountToReceive !== 0 &&
              amountToReceive !== undefined &&
              tokenTo !== undefined
                ? `$${(amountToReceive * Number(tokenTo?.priceUSD)).toFixed(2)}`
                : ""
            }
            bridgeComponent={
              <>
                {!connectionsLoading && connections !== undefined ? (
                  <div className="flex flex-col">
                    <TokenDropdown
                      tokens={connections}
                      getToken={getTokenTo}
                      token={tokenTo}
                      oppositToken={tokenFrom}
                      type="To"
                      className="flex justify-between w-[125px] px-[12px] py-2.5 border-1 rounded-full font-semibold items-center "
                    />
                    <span className="text-xs mt-2 text-gray-500 ml-2">
                      To this token
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col opacity-30">
                    <TokenDropdown
                      tokens={connections}
                      getToken={getTokenTo}
                      token={tokenTo}
                      oppositToken={tokenFrom}
                      disabled={true}
                      type="To"
                      className="flex justify-between w-[125px] px-[12px] py-2.5 border-1 rounded-full font-semibold items-center "
                    />
                    <span className="text-xs mt-2 text-gray-500 ml-2">
                      To this token
                    </span>
                  </div>
                )}
              </>
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
            inputValue={amountToReceive?.toFixed(4)}
            staticInput={true}
            showMaxButton={false}
            preventFocusOnLabelClick="right"
          >
            <div className="flex flex-col">
              {/* Change to network selector */}
              <NetworkDropdown
                networks={networks}
                getNetwork={getNetworkTo}
                network={networkTo}
                type="On"
                className="flex justify-between w-[125px] rounded-full font-semibold items-center "
              />
              <span className="text-xs text-end mt-2 text-gray-500">
                On this network
              </span>
            </div>
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
