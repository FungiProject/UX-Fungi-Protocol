import { Provider } from "@ethersproject/providers";
import { BigNumber, Contract } from "ethers";
import {
  GAS_PRICE_ADJUSTMENT_MAP,
  MAX_GAS_PRICE_MAP,
} from "../../config/chains";
import { bigNumberify } from "../numbers";
import axios from "axios";
import {  AlchemySmartAccountClient  } from "@alchemy/aa-alchemy"

export async function setGasPrice(
  provider: Provider,
  txnOpts: any,
  chainId: number
) {
  let maxGasPrice = MAX_GAS_PRICE_MAP[chainId];
  const premium = GAS_PRICE_ADJUSTMENT_MAP[chainId] || bigNumberify(0);

  const gasPrice = await provider.getGasPrice();

  if (maxGasPrice) {
    if (gasPrice.gt(maxGasPrice)) {
      maxGasPrice = gasPrice.toString();
    }

    const feeData = await provider.getFeeData();

    // the wallet provider might not return maxPriorityFeePerGas in feeData
    // in which case we should fallback to the usual getGasPrice flow handled below
    if (feeData && feeData.maxPriorityFeePerGas && premium) {
      txnOpts.maxFeePerGas = maxGasPrice;
      txnOpts.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.add(premium);
      return;
    }
  }

  txnOpts.gasPrice = gasPrice.add(premium ?? 0);
  return;
}

export async function getGasLimit(
  contract: Contract,
  method,
  params: any[] = [],
  value?: BigNumber | number
) {
  const defaultValue = bigNumberify(0);

  if (!value) {
    value = defaultValue;
  }

  let gasLimit = await contract.estimateGas[method](...params, { value });

  if (gasLimit.lt(22000)) {
    gasLimit = bigNumberify(22000)!;
  }

  return gasLimit.mul(11000).div(10000); // add a 10% buffer
}

export async function getGasLimitApi(
  alchemyProvider:  AlchemySmartAccountClient,
  sender: string
) {
  const response = await axios.post("/api/alchemy/estimateUserOpGas", {
    id: 1,
    jsonrpc: "2.0",
    method: "eth_estimateUserOperationGas",
    params: "eypapi",
  });
}
