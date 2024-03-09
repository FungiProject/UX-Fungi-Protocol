import { useState, useCallback, useEffect } from "react";
import { useLiFiTx } from "../../components/Cards/useLiFiTx";
import { ethers } from "ethers";
import { UserOperation } from "@/lib/userOperations/types";

type DCAStatus = {
  loading: boolean;
  error: string | null;
  success: string | null;
};

type DCASettings = {
  fromToken: string;
  toToken: string;
  amount: string;
  fromChain: string;
  toChain: string;
  interval: number; // The DCA interval in days, can be a float
};

export const useDCA = () => {
  const [isDCAActive, setIsDCAActive] = useState(false);
  const [dcaSettings, setDCASettings] = useState({
    fromToken: '',
    toToken: '',
    amount: '',
    fromChain: '',
    toChain: '',
    interval: 0, // The DCA interval in minutes
  });
  const [status, setStatus] = useState<DCAStatus>({
    loading: false,
    error: null,
    success: null
  });
  const [userOps, setUserOps] = useState<UserOperation[]>([]);

  // Using useLiFiTx for executing swaps
  const [, sendLiFiTx] = useLiFiTx(
    "Swap", 
    dcaSettings.fromChain, 
    dcaSettings.amount, 
    dcaSettings.fromToken, 
    dcaSettings.toChain, 
    dcaSettings.toToken, 
    ethers.constants.AddressZero, // Assume fromAddress is the zero address for simplicity in this example
    dcaSettings.fromToken, // Assume fromToken symbol is used for fromSymbol
    ethers.constants.AddressZero, // Assume toAddress is the zero address for simplicity in this example
    "0.1" // Slippage
  );

  const setupDCA = useCallback((settings) => {
    setIsDCAActive(true);
    setDCASettings(settings);
  }, []);

  const performSwap = useCallback(async () => {
    if (!isDCAActive) return;

    setStatus({ loading: true, error: null, success: null });

    try {
      await sendLiFiTx(); // Execute the swap
      setStatus({ loading: false, error: null, success: 'DCA Swap executed successfully!' });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, error: 'DCA Swap failed. Please try again.', success: null });
    }
  }, [isDCAActive, sendLiFiTx]);

  // Call this method at the interval you want to perform DCA
  const executeDCA = useCallback(() => {
    if (!isDCAActive || userOps.length === 0) {
      console.log("DCA is not active or no operations to perform.");
      return;
    }
    performSwap();
  }, [isDCAActive, userOps, performSwap]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isDCAActive && dcaSettings.interval > 0) {
      // Convert interval from days to milliseconds (1 day = 86400000 milliseconds)
      const intervalMs = dcaSettings.interval * 86400000;
      intervalId = setInterval(() => {
        performSwap();
      }, intervalMs);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isDCAActive, dcaSettings, performSwap]);

  // Call this method to stop the DCA
  const stopDCA = useCallback(() => {
    setIsDCAActive(false);
  }, []);

  return { setupDCA, executeDCA: performSwap, stopDCA, isDCAActive, status };
};

export default useDCA;
