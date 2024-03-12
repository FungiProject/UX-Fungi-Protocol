// React
import React, { ChangeEvent, useState, useEffect } from "react";
// Components
import TokenDropdown from "../Dropdown/TokenDropdown";
import Button from "../Gmx/common/Buttons/Button";
import BuyInputSection from "../Gmx/common/BuyInputSection/BuyInputSection";
import { useUserOperations } from "@/hooks/useUserOperations";
import { formatTokenAmount } from "@/utils/gmx/lib/numbers";
// Types
import { TokenInfo } from "@/domain/tokens/types";
import useWallet from "@/hooks/useWallet";
import { useNotification } from "@/context/NotificationContextProvider";

// Custom hook for interacting with Mean Finance for DCA (not provided, needs to be implemented)
import { useDcaTx } from "@/hooks/useDcaTx"

type DCAProps = {
  tokens: TokenInfo[];
  chainId: number;
};

export default function DCA({ tokens, chainId }: DCAProps) {
  const { scAccount } = useWallet();
  const { showNotification } = useNotification();
  const { prepareDcaOperations } = useDcaTx();
  const { sendUserOperations } = useUserOperations();

  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [sellToken, setSellToken] = useState<TokenInfo | undefined>(undefined);
  const [buyToken, setBuyToken] = useState<TokenInfo | undefined>(undefined);
  const [duration, setDuration] = useState(7);
  const [swapInterval, setSwapInterval] = useState('1 day'); // Set default swap interval
  const [amountToReceive, setAmountToReceive] = useState<number | undefined>(
    undefined
  );
  const [scaAddress, setScaAddress] = useState(scAccount);
  const [numberOfSwaps, setNumberOfSwaps] = useState<number>(6);
  const [userDefinedSwaps, setUserDefinedSwaps] = useState('');
  const [endDate, setEndDate] = useState(new Date());


  const swapIntervalsInSeconds = {
    '1 minute': 60,
    '5 minutes': 300,
    '15 minutes': 900,
    '30 minutes': 1800,
    '1 hour': 3600,
    '4 hours': 14400,
    '1 day': 86400,
    '1 week': 604800,
  };

  const calculateEndDate = (interval, swaps, startDate = new Date()) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerWeek = msPerDay * 7;
  
    let msToAdd;
  
    switch (interval) {
      case '1 minute':
        msToAdd = msPerMinute;
        break;
      case '1 hour':
        msToAdd = msPerHour;
        break;
      case '1 day':
        msToAdd = msPerDay;
        break;
      case '1 week':
        msToAdd = msPerWeek;
        break;
      default:
        msToAdd = msPerDay; // default to one day if none match
    }
  
    return new Date(startDate.getTime() + msToAdd * (swaps - 1));
  };

  const handleSelectSellToken = (token: TokenInfo) => {
    setSellToken(token);
  };

  const handleAmountChange = (amount: number) => {
    setAmount(amount);
  };

  // Convert frequency to seconds and set the swap interval state
  const handleSwapIntervalChange = (interval: string) => {
    setSwapInterval(interval);
  };

  // Set the duration state based on user selection
  const handleDurationChange = (weeks: number) => {
    setDuration(weeks * 7); // Convert weeks to days
  };

  const handleSelectBuyToken = (token: TokenInfo) => {
    setBuyToken(token);
  };

  // Update the number of swaps state based on user input
  const handleSwapsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const swaps = e.target.value;
    setUserDefinedSwaps(swaps);

    // Optionally, convert the input to a number and update numberOfSwaps
    // If the input is not a number, setNumberOfSwaps back to the default
    const numberOfSwaps = swaps ? parseInt(swaps, 10) : 6;
    setNumberOfSwaps(!isNaN(numberOfSwaps) ? numberOfSwaps : 6);
  };

  const handleDcaSubmit = async () => {
    if (!sellToken || !buyToken || !amount || !scAccount) {
      showNotification({ message: "Please fill all required fields.", type: "error" });
      return;
    }

    const swapIntervalSeconds = swapIntervalsInSeconds[swapInterval];
    const totalDurationInSeconds = duration * 86400; // Convert duration to seconds
    const amountOfSwaps = Math.floor(totalDurationInSeconds / swapIntervalSeconds);

    try {
      const dcaOperations = await prepareDcaOperations({
        sellToken: sellToken.address,
        buyToken: buyToken.address,
        amount,
        amountOfSwaps,
        swapInterval: swapIntervalSeconds,
        scAccount: scaAddress,
      });

      await sendUserOperations(dcaOperations);
      showNotification({ message: "DCA position opened successfully!", type: "success" });
    } catch (error) {
      console.error(error);
      showNotification({ message: "Failed to open DCA position.", type: "error" });
    }
  };

  // This function will update both the duration and the number of swaps
  const handleDurationAndSwapsChange = (durationWeeks: number) => {
    setDuration(durationWeeks * 7);
    setNumberOfSwaps(Math.ceil(durationWeeks * 7 / (swapInterval === '1 week' ? 7 : 1)));
  };

  function onMaxClick() {
    if (sellToken?.balance) {
      const formattedAmount = formatTokenAmount(
        sellToken?.balance,
        sellToken?.decimals,
        "",
        {
          useCommas: true,
        }
      );

      handleAmountChange(Number(formattedAmount));
    }
  }

  const isNotMatchAvailableBalance = sellToken?.balance?.gt(0);

  useEffect(() => {
    if (sellToken && buyToken && amount) {
      setAmountToReceive(
        (amount * Number(sellToken.priceUSD)) / Number(buyToken.priceUSD)
      );
    } else {
      setAmountToReceive(0);
    }
  }, [amount, sellToken, buyToken]);

  useEffect(() => {
    if (scAccount) {
      setScaAddress(scAccount);
    }
  }, [scAccount]);

  // Add a useEffect to recalculate number of swaps when swapInterval changes
  useEffect(() => {
    handleDurationAndSwapsChange(duration / 7); // trigger recalculation on interval change
  }, [swapInterval]);

  // Whenever swapInterval or numberOfSwaps changes, recalculate the end date
  useEffect(() => {
    setEndDate(calculateEndDate(swapInterval, numberOfSwaps));
  }, [swapInterval, numberOfSwaps]);

  const sellAmountPerSwap = amount ? (amount / numberOfSwaps) : 0;
  const nextSwapDate = new Date(); // assuming immediate start for simplicity

  const buttonStyle = {
    padding: '8px 16px',
    margin: '0 4px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    background: 'transparent',
    cursor: 'pointer',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: '#ffffff',
  };


  const swapDetailTextStyle = {
    color: '#333333', // dark text color for readability
    marginBottom: '8px', // space between text elements
    fontSize: '16px', // adjust the font size as needed
  };

  const swapDetailsStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '16px 0',
  };

  return (
    <main className="mt-[12px]">
        <div className="relative">
            <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px]">
              <BuyInputSection
                  topLeftLabel="Pay"
                  topLeftValue={
                    amount !== 0 &&
                    amount !== undefined &&
                    sellToken !== undefined
                      ? `$${(amount * Number(buyToken?.priceUSD)).toFixed(2)}`
                      : ""
                  }
                  topRightLabel={`Balance`}
                  topRightValue={formatTokenAmount(
                    sellToken?.balance,
                    sellToken?.decimals,
                    "",
                    {
                      useCommas: true,
                    }
                  )}
                  inputValue={amount}
                  onInputValueChange={(e: any) => handleAmountChange(e.target.value)}
                  showPercentSelector={true}
                  onClickTopRightLabel={onMaxClick}
                  showMaxButton={isNotMatchAvailableBalance}
                  onClickMax={onMaxClick}
              >
                  <TokenDropdown
                      tokens={tokens}
                      getToken={handleSelectSellToken}
                      token={sellToken}
                      oppositToken={buyToken}
                      type="From"
                      className="flex justify-between w-[125px] px-[12px] py-2.5 border-1 rounded-full font-semibold items-center "
                  />
              </BuyInputSection>
            </div>
            <div className="flex items-start justify-between w-full shadow-input rounded-2xl pl-[11px] pr-[25px] py-[24px] text-black font-medium h-[120px] mt-[24px]">
                <BuyInputSection
                  topLeftLabel="Receive"
                  topLeftValue={
                    amountToReceive !== 0 &&
                    amountToReceive !== undefined &&
                    sellToken !== undefined
                      ? `$${(amountToReceive * Number(buyToken?.priceUSD)).toFixed(2)}`
                      : ""
                  }
                  topRightLabel={`Balance`}
                  topRightValue={formatTokenAmount(
                    buyToken?.balance,
                    buyToken?.decimals,
                    "",
                    {
                      useCommas: true,
                    }
                  )}
                  inputValue={amountToReceive?.toFixed(amountToReceive === 0 ? 2 : 5)}
                  showPercentSelector={true}
                  // onPercentChange={(percentage) => {/* Logic for setting percentage of total investable amount */}}
                  showMaxButton={true}
                  onClickMax={() => {/* Logic for setting max amount based on balance */}}
              >
                  <TokenDropdown
                      tokens={tokens}
                      getToken={handleSelectBuyToken} // Corrected to use the appropriate setter function
                      token={buyToken}
                      oppositToken={sellToken}
                      type="To"
                      className="flex justify-between w-[125px] px-[12px] py-2.5 border-1 rounded-full font-semibold items-center "
                  />
                </BuyInputSection>
            </div>
            <div className="flex flex-col items-center w-full p-4 shadow rounded-xl bg-white my-4">
        <div className="flex justify-between w-full mb-2">
          <label className="text-gray-600">Every:</label>
          <select
            value={swapInterval}
            onChange={(e) => handleSwapIntervalChange(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {/* Adjust these options based on your swap intervals */}
            <option value="1 minute">Minute</option>
            <option value="1 day">Day</option>
            <option value="1 week">Week</option>
          </select>
        </div>

        <div className="flex justify-between w-full mb-4">
          <label className="text-gray-600">Over:</label>
          <input
            type="number"
            value={numberOfSwaps}
            onChange={(e) => setNumberOfSwaps(e.target.valueAsNumber)}
            className="border border-gray-300 rounded px-2 py-1 w-20 text-center"
            min={1}
          />
          <span className="text-gray-600">orders</span>
        </div>

        {/* DCA Summary */}
        <div className="w-full bg-gray-100 p-4 rounded-xl my-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Sell total:</span>
            <span>{amount} {sellToken?.symbol}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Sell per order:</span>
            <span>{sellAmountPerSwap.toFixed(2)} {sellToken?.symbol}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Receive:</span>
            <span>{buyToken?.symbol}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Order interval:</span>
            <span>{swapInterval}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Start date:</span>
            <span>Immediate</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Estimated end date:</span>
            <span>{endDate.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Start DCA Button */}
        <button
          onClick={handleDcaSubmit}
          disabled={!amount || !sellToken || !buyToken}
          className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold"
        >
          Start DCA
        </button>
      </div>
    </div>
  </main>
);
}
