// React
import React, { useEffect, useState } from "react";
// Components
import SpotTableCard from "../Cards/SpotTableCard";
import ActionsSwitcher from "../Switchers/ActionsSwitcher";
// Constants
import Loader from "../Loader/SpinnerLoader";
import { TokenData, TokenInfo } from "@/domain/tokens/types";
import { useTokenMarketData } from "@/hooks/useTokenMarketData";
import StartDepositBanner from "../Cards/StartDepositBanner";

type SpotTableProps = {
  tokens: TokenInfo[];
  startIndex: number;
  endIndex: number;
  getLength: (length: number) => void;
  handlePageChange: (page: number) => void;
};

export default function SpotTable({
  tokens,
  startIndex,
  endIndex,
  getLength,
  handlePageChange,
}: SpotTableProps) {
  const typesMembersTable = ["Portfolio", "All"];
  const [typeMember, setTypeMember] = useState<string>("Portfolio");
  const [loading, setLoading] = useState(false);
  const { tokenMarketsData, fetchData } = useTokenMarketData([]);
  const [portfolioEmpty, setPortfolioEmpty] = useState(false);

  const checkTokens = () => {
    if (tokens && typeMember === "All") {
      setLoading(true);
      setPortfolioEmpty(false);
      fetchData(tokens.slice(startIndex, endIndex));
      getLength(tokens.length);
    } else if (tokens && typeMember === "Portfolio") {
      setLoading(true);
      const tokensWithBalance = tokens.filter((tokenData: any) => {
        return Number(tokenData.balance) !== 0;
      });
      if (tokensWithBalance.length !== 0) {
        setPortfolioEmpty(false);
        fetchData(tokensWithBalance.slice(startIndex, endIndex));
      } else {
        setPortfolioEmpty(true);
      }
      getLength(tokensWithBalance.length);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkTokens();
  }, [tokens]);

  useEffect(() => {
    checkTokens();
    handlePageChange(1);
  }, [typeMember]);

  useEffect(() => {
    checkTokens();
  }, [startIndex, endIndex]);

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
          className="h-[34px] p-[4px] w-[160px] rounded-full grid grid-cols-2 bg-white items-center text-center shadow-input text-xs"
          paddingButton="py-[5px]"
        />
      </div>
      {loading ? (
        <div className="w-full h-[500px] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="overflow-auto h-[590px]">
          {portfolioEmpty ? (
            <StartDepositBanner />
          ) : (
            <>
              {tokenMarketsData &&
                tokenMarketsData.length > 0 &&
                tokenMarketsData.map((token: TokenData, index: number) => (
                  <SpotTableCard
                    asset={token}
                    key={token.token.coinKey}
                    index={index}
                  />
                ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
