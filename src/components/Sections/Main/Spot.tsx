// React
import React, { useState } from "react";
// Components
import PageContainer from "../../Container/PageContainer";
import SpotTable from "../../Tables/SpotTable";
import Swapper from "../../Cards/Swapper";
import ActionsSwitcher from "../../Switchers/ActionsSwitcher";
import Bridge from "../../Cards/Bridge";
import Rebalancer from "../../Cards/Rebalancer";
import Loader from "../../Loader/SpinnerLoader";
import DCA from "../../Cards/DCA"; // Added DCA import
// Hooks
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { useTokensInfo } from "@/hooks/useTokensInfo";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Spot() {
  const { chainId } = useWallet();
  const { tokens } = useTokensInfo();
  const [actionSelected, setActionSelected] = useState("Swap");

  const [length, setLength] = useState(tokens.length);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 6;

  const totalPages = Math.ceil(length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, length);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleClickNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleClickPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const getActionSelected = (action: string) => {
    setActionSelected(action);
  };

  const getLength = (length: number) => {
    setLength(length);
  };

  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
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
              ? "bg-main px-2 rounded-lg text-white"
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

  return (
    <main>
      <PageContainer
        main={
          <>
            {tokens.length > 0 ? (
              <div className="flex flex-col items-center mt-4 relative h-full">
                <SpotTable
                  tokens={tokens}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  getLength={getLength}
                  handlePageChange={handlePageChange}
                />{" "}
                <div className="flex justify-center items-center absolute inset-x-0 bottom-6 mx-10">
                  {length !== 0 && (
                    <span className="absolute inset-x-0 bottom-2">
                      Showing {startIndex + 1}-{endIndex} out of {length}
                    </span>
                  )}
                  <div className="absolute bottom-2">
                    {currentPage !== 1 && (
                      <button
                        onClick={() => handleClickPrevious()}
                        className="absolute top-0 -left-6"
                      >
                        <ChevronLeftIcon
                          className=" w-[24px] h-[24px] text-black"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                    {renderPageNumbers()}{" "}
                    {currentPage < length / ITEMS_PER_PAGE && (
                      <button
                        onClick={() => handleClickNext()}
                        className="absolute top-0 -right-6"
                      >
                        <ChevronRightIcon
                          className=" w-[24px] h-[24px] text-black"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                {" "}
                <Loader />
              </div>
            )}
          </>
        }
        secondary={
          <div className="px-[32px] pt-[24px]">
            {tokens.length > 0 && chainId !== undefined && (
              <>
                <ActionsSwitcher
                  actions={["Swap", "Bridge", "Rebalance", "DCA"]} // Added "DCA" action
                  actionSelected={actionSelected}
                  getActionSelected={getActionSelected}
                  className="h-[40px] p-[4px] w-full rounded-full grid grid-cols-4 bg-white items-center text-center shadow-input text-sm mb-4 font-semibold" // Changed grid-cols-3 to grid-cols-4
                  paddingButton="py-[5px]"
                />
                {actionSelected === "Rebalance" ? (
                  <Rebalancer tokens={tokens} />
                ) : actionSelected === "Bridge" ? (
                  <Bridge tokens={tokens} chainId={chainId} />
                ) : actionSelected === "Swap" ? (
                  <Swapper tokens={tokens} chainId={chainId} />
                ) : actionSelected === "DCA" ? ( // Conditional rendering for DCA
                  <DCA tokens={tokens} chainId={chainId}/>
                ) : null}
              </>
            )}
          </div>
        }
        page="Spot Section"
      />
    </main>
  );
}
