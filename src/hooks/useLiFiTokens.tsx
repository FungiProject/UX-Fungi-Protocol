// React
import { useState, useEffect } from "react";
// Axios
import axios from "axios";

type useLiFiTokensProps = {
  chain: string;
};

const useLiFiTokens = ({ chain }: useLiFiTokensProps) => {
  const [tokens, setTokens] = useState();

  useEffect(() => {
    const getToken = async (chain: string) => {
      const result = await axios.get(
        `https://li.quest/v1/tokens?chains=${chain}`
      );
      let key = Object.keys(result.data.tokens)[0];

      setTokens(result.data.tokens[key]);
    };

    return () => {
      getToken(chain);
    };
  }, []);

  return tokens;
};

export default useLiFiTokens;
