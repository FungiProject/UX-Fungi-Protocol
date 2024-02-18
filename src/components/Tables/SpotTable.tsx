// React
import React, { useEffect, useState } from "react";
// Components
import SpotTableCard from "../Cards/SpotTableCard";
import ActionsSwitcher from "../Switchers/ActionsSwitcher";
// Types
import { NetworkType, assetType } from "@/types/Types";
// Wagmi
import { useNetwork } from "wagmi";
// Constants
import Loader from "../Loader/SpinnerLoader";
import { TokenData, TokenInfo } from "@/domain/tokens/types";
import { useTokenMarketData } from "@/hooks/useTokenMarketData";

type SpotTableProps = {
  tokens: TokenInfo[]
};

export default function SpotTable({tokens}: SpotTableProps) {
  const typesMembersTable = ["Portfolio", "All"];
  const [typeMember, setTypeMember] = useState<string>("Portfolio");
  const [loading, setLoading] = useState(false);
  const [tokensToQueryData, setTokensToQueryData] = useState<TokenInfo[]>()
  const { tokenMarketsData, fetchData }= useTokenMarketData([])

  useEffect(()=>{
    if(tokensToQueryData && tokensToQueryData.length>0){
      fetchData(tokensToQueryData)
    }
  },[tokensToQueryData])

  useEffect(()=>{
    if(tokens && tokens.length>0){
      fetchData(tokens.slice(0,10))
    }
  },[tokens])

  const getTypeMember = (action: string) => {
    setTypeMember(action);
  };

  return (
    <div className="mt-[20px] w-full h-[574px] pt-[24px] bg-white rounded-lg">
      <div className="grid grid-cols-7 pb-[26px] text-xl font-medium pr-[14px] border-b-1 border-gray-300 flex items-center">
        <div className="text-center col-span-2">Name</div>{" "}
        <div className="text-center">Price</div>{" "}
        <div className="text-center">Market Cap</div>{" "}
        <div className="text-center">Volume (24h)</div>{" "}
        <div className="text-center">Networks</div>
        <ActionsSwitcher
          actions={typesMembersTable}
          actionSelected={typeMember}
          getActionSelected={getTypeMember}
          className="h-[30px] p-[4px] w-[130px] rounded-full grid grid-cols-2 bg-white items-center text-center shadow-input text-xs"
          paddingButton="py-[3px]"
        />
      </div>
      {loading ? (
        <div className="w-full h-[500px] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="overflow-auto h-[590px]">
          {tokenMarketsData && tokenMarketsData.length>0 && tokenMarketsData.map((token: TokenData, index: number) => (
            <SpotTableCard asset={token} key={token.token.coinKey} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
