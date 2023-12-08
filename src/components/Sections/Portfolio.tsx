// React
import React, { useEffect, useState } from "react";
// Constants
import { funds } from "@/constants/Constants";
// Types
import { fundType } from "@/types/Types";
// Heroicons
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
// Wagmi
import { useAccount } from "wagmi";
// Components
import UserInfo from "../Cards/UserInfo";
import ResultsChart from "../Chart/ResultsChart";
import ActionsSwitcher from "../Switchers/ActionsSwitcher";
import FundsTable from "../Tables/FundsTable";

export default function Portfolio() {
  const [actionSelected, setActionSelected] = useState("Invested");
  const [fundsArrayCopy, setFundsArrayCopy] = useState<fundType[]>([...funds]);
  const [originalFunds, setOriginalFunds] = useState<fundType[]>([...funds]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 5;
  const totalItems = fundsArrayCopy.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const { address } = useAccount();
  const personalBalance = 8974.31;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleClickNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleClickPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
    let copy = [...originalFunds];

    if (actionSelected === "Invested") {
      copy = copy.slice(0, copy.length / 2);
    } else {
      copy = copy.slice(3, 14);
    }

    setFundsArrayCopy(copy);
  }, [actionSelected, originalFunds]);

  useEffect(() => {
    setOriginalFunds([...funds]);
  }, [funds]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === currentPage ||
        i === currentPage - 1 ||
        i === currentPage + 1 ||
        i === totalPages
      ) {
        pageNumbers.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push("...");
      }
    }

    return pageNumbers.map((pageNumber, index) =>
      pageNumber.toString() !== "..." ? (
        <button
          key={index}
          className={
            pageNumber === currentPage
              ? "bg-main py-0.5 px-2 rounded-lg text-white"
              : "mx-2.5"
          }
          onClick={() => handlePageChange(Number(pageNumber))}
        >
          {pageNumber}
        </button>
      ) : (
        <span className="mx-1" key={index}>
          {pageNumber}
        </span>
      )
    );
  };

  const getActionSelected = (action: string) => {
    setActionSelected(action);
  };

  return (
    <main>
      <UserInfo address={address} isUser={true} isOwner={true} />
      <div className="mt-[25px]">
        <ResultsChart personalBalance={personalBalance} />
      </div>
      <div className="flex justify-end">
        <ActionsSwitcher
          actions={["Invested", "Created"]}
          actionSelected={actionSelected}
          getActionSelected={getActionSelected}
          className="h-[40px] p-[4px] w-[300px] rounded-full grid grid-cols-2 bg-white items-center text-center mt-[90px] shadow-xl text-sm"
          paddingButton="py-[6px]"
        />
      </div>
      <FundsTable
        funds={fundsArrayCopy}
        startIndex={startIndex}
        endIndex={endIndex}
        isPortfolio={true}
      />
      <div className="flex items-center mt-4 relative">
        <span>
          Showing {startIndex + 1}-{endIndex} out of {fundsArrayCopy.length}
        </span>
        <div className="flex justify-center items-center absolute inset-x-0 bottom-0 top-3">
          {currentPage !== 1 && (
            <button onClick={() => handleClickPrevious()}>
              <ChevronLeftIcon
                className=" w-[45px] h-[36px] text-black"
                aria-hidden="true"
              />
            </button>
          )}
          {renderPageNumbers()}{" "}
          {currentPage < fundsArrayCopy.length / 5 && (
            <button onClick={() => handleClickNext()}>
              <ChevronRightIcon
                className=" w-[45px] h-[36px] text-black"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
