// React
import React, { useEffect, useState } from "react";
// Constants
import { homeCards, funds } from "../../../constants/Constants";
// Types
import { fundType, homeDataType } from "@/types/Types";
// Components
import PageContainer from "../Container/PageContainer";
import FundsTable from "../Tables/FundsTable";
import SortBy from "../Filters/SortBy";
// Heroicons
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Home() {
  const [fundsArrayCopy, setFundsArrayCopy] = useState<fundType[]>([...funds]);
  const [originalFunds, setOriginalFunds] = useState([...funds]);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Sort By");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 5;
  const totalItems = fundsArrayCopy.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

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
    let copy = [...originalFunds];

    if (search.length !== 0) {
      copy = copy.filter((fund: fundType) =>
        fund.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "Aum") {
      copy.sort((a, b) => b.aum - a.aum);
    } else if (sortBy === "Members") {
      copy.sort((a, b) => b.members - a.members);
    } else if (sortBy === "All Time") {
      copy.sort((a, b) => b.allTime - a.allTime);
    }

    setFundsArrayCopy(copy);
  }, [search, sortBy, originalFunds]);

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

  return (
    <main>
      <PageContainer
        main={
          <div>
            <FundsTable
              funds={fundsArrayCopy}
              startIndex={startIndex}
              endIndex={endIndex}
              isPortfolio={false}
            />
            <div className="flex items-center mt-4 relative">
              <span>
                Showing {startIndex + 1}-{endIndex} out of{" "}
                {fundsArrayCopy.length}
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
          </div>
        }
        secondary={<div>Pepe</div>}
      />
    </main>
  );
}
