// React
import React, { ReactNode, useEffect } from "react";
// Wagmi
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
// Viem
import { polygonMumbai } from "viem/chains";

type TxButtonProps = {
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args: any[];
  children: ReactNode;
  getTxStatus: (status: string, name: string) => void;
  className: string;
};

export default function TxButton({
  address,
  abi,
  functionName,
  args,
  children,
  getTxStatus,
  className,
}: TxButtonProps) {
  const { config: txContractConfig } = usePrepareContractWrite({
    address: address,
    abi: abi,
    functionName: functionName,
    args: args,
    chainId: polygonMumbai.id,
    onError() {
      getTxStatus("error", functionName);
    },
  });

  const { writeAsync: contractTx, data: dataTx } =
    useContractWrite(txContractConfig);

  const {
    isSuccess: txSuccessWagmi,
    isLoading: txLoadingWagmi,
    isError: txErrorWagmi,
  } = useWaitForTransaction({
    confirmations: 3,
    hash: dataTx?.hash,
    onSuccess() {
      getTxStatus("success", functionName);
    },
    onError() {
      getTxStatus("error", functionName);
    },
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
    }
  }, [txSuccessWagmi, txLoadingWagmi, txErrorWagmi]);

  return (
    <button className={className} onClick={() => onWagmiClick()}>
      {children}
    </button>
  );
}
