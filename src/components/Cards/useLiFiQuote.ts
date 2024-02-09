import { useState } from "react";
import axios from "axios";

// Define the type for the parameters accepted by the getLiFiQuote function
export type LiFiQuoteParams = {
  fromChain?: string;
  toChain?: string;
  fromToken?: string;
  toToken?: string;
  fromAmount?: string;
  fromAddress?: string;
  toAddress?: string;
  order?: string;
  slippage?: string;
  integrator?: string;
  fee?: string;
  referrer?: string;
  allowBridges?: string[];
  allowExchanges?: string[];
  denyBridges?: string[];
  denyExchanges?: string[];
  preferBridges?: string[];
  preferExchanges?: string[];
};

export const useLiFiQuote = () => {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = async (params: LiFiQuoteParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("https://li.quest/v1/quote", { params });

      setQuote(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch quote");
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  return { quote, loading, error, getQuote };
};
