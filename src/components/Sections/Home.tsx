import { homeCards } from "@/constants/Constants";
import { fundType, homeDataType } from "@/types/Types";
import React, { useEffect, useState } from "react";
import HomeCard from "../Cards/Homecard";
import SearchBar from "../Filters/SearchBar";
import FundsTable from "../Tables/FundsTable";
import { funds } from "@/constants/Constants";
import ShortBy from "../Filters/ShortBy";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Home() {
  const [fundsArrayCopy, setFundsArrayCopy] = useState<fundType[]>(funds);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 5;
  const totalItems = fundsArrayCopy.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getInfo = (query: string) => {
    setSearch(query);
  };

  const getSortChange = (option: string) => {
    setSortBy(option);
  };

  const handleClickNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleClickPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    let copy = [...funds];
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
  }, [search, sortBy]);

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

    return pageNumbers.map((pageNumber, index) => (
      <button
        key={index}
        className={pageNumber === currentPage ? "font-bold" : ""}
        onClick={() => handlePageChange(Number(pageNumber))}
      >
        {pageNumber}
      </button>
    ));
  };

  return (
    <main>
      <div className="flex flex-row mt-[22px] gap-x-[20px] mb-[25px]">
        {homeCards.map((infoCard: homeDataType, index: number) => {
          return (
            <HomeCard
              title={infoCard.title}
              amount={index === 0 ? 1000 : 1000000}
              imageHeight={infoCard.imageHeight}
              imageWidth={infoCard.imageWidth}
              imageSrc={infoCard.imageSrc}
              key={infoCard.title}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-x-[20px]">
        <SearchBar getInfo={getInfo} query={search} />
        <ShortBy getSortChange={getSortChange} />
      </div>

      <FundsTable
        funds={fundsArrayCopy}
        startIndex={startIndex}
        endIndex={endIndex}
      />
      <div className="flex justify-center mt-4 space-x-2 ">
        {currentPage !== 1 && (
          <button className="mr-2" onClick={() => handleClickPrevious()}>
            <ChevronLeftIcon
              className=" w-[45px] h-[36px] text-black"
              aria-hidden="true"
            />
          </button>
        )}
        {renderPageNumbers()}{" "}
        {currentPage !== fundsArrayCopy.length / 5 && (
          <button className="ml-2" onClick={() => handleClickNext()}>
            <ChevronRightIcon
              className=" w-[45px] h-[36px] text-black"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </main>
  );
}
