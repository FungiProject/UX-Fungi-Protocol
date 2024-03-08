import axios from "axios";

export async function getLiFiSwapQuote(
  fromChain: string,
  fromAmount: string,
  fromToken: string,
  toChain: string,
  toToken: string,
  fromAddress: string
) {
  const result = await axios.get("https://li.quest/v1/quote", {
    params: {
      fromChain,
      fromAmount,
      fromToken,
      toChain,
      toToken,
      fromAddress,
    },
  });
  return result.data;
}
