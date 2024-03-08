// React
import { useState, useEffect } from "react";
// Axios
import axios from "axios";

type useLiFiTokensProps = {
  fromChain: string | undefined;
  toChain: string | undefined;
  fromToken: string | undefined;
};

const useLiFiConnections = ({
  fromChain,
  toChain,
  fromToken,
}: useLiFiTokensProps) => {
  const [connections, setConnections] = useState();

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
    };

    return () => {
      if (
        fromChain !== undefined &&
        toChain !== undefined &&
        fromToken !== undefined
      ) {
        getConnections(fromChain, toChain, fromToken);
      }
    };
  }, []);

  return { connections };
};

export default useLiFiConnections;
