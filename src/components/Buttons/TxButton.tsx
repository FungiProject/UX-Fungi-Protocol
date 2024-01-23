// React
import React, { ReactElement, useEffect, useState } from "react";
// Wagmi
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
// Viem
import { polygonMumbai } from "viem/chains";
import NotificationsCard from "../Cards/NotificationsCard";

type TxButtonProps = {
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args: any[];
  children: ReactElement;
  getTxStatus: (status: string, name: string) => void;
  className: string;
};

export default function TxButton({
  address,
  abi,
  functionName,
  args,
  getTxStatus,
  children,
  className,
}: TxButtonProps) {
  const { config: txContractConfig } = usePrepareContractWrite({
    address: address,
    abi: abi,
    functionName: functionName,
    args: args,
  });

  const { writeAsync: contractTx, data: dataTx } =
    useContractWrite(txContractConfig);

  const {
    isSuccess: txSuccessWagmi,
    isLoading: txLoadingWagmi,
    isError: txErrorWagmi,
  } = useWaitForTransaction({
    confirmations: 5,
    hash: dataTx?.hash,
  });

  const onWagmiClick = async () => {
    try {
      await contractTx?.();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (txLoadingWagmi) {
      getTxStatus("loading", functionName);
    } else if (txErrorWagmi) {
      getTxStatus("error", functionName);
    } else if (txSuccessWagmi) {
      getTxStatus("success", functionName);
    }
  }, [txSuccessWagmi, txLoadingWagmi, txErrorWagmi]);

  return (
    <>
      <button className={className} onClick={() => onWagmiClick()}>
        {children}
      </button>
    </>
  );
}
