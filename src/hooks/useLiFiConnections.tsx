import axios from "axios";
import { getChainIdLifi } from "@/lib/lifi/getChainIdLifi";
import { from } from "@apollo/client";

type useLiFiTokensProps = {
  fromChainId: number;
  toChainId: number;
  fromToken: string;
};

export const useLiFiConnections = async ({
  fromChainId,
  toChainId,
  fromToken,
}: useLiFiTokensProps) => {

  try {
    const fromChainLifi = getChainIdLifi(fromChainId);
    const toChainLifi = getChainIdLifi(toChainId);

    console.log(fromChainLifi);
    console.log(toChainLifi);
    console.log(fromToken);

    const result = await axios.get("https://li.quest/v1/connections", {
      params: {
        fromChain: fromChainLifi,
        toChain: toChainLifi,
        fromToken,
      },
    });

    return result.data.connections[0].toTokens

  } catch (error) {
    console.log(error);
    console.log("Error getting connections from lifi")
  }

};

