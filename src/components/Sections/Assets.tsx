import { assetType } from "@/types/Types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SearchBar from "../Filters/SearchBar";
import AssetsTable from "../Tables/AssetsTable";
import {
  assetsPolygon,
  assetsArbitrum,
  assetsMainnet,
} from "@/constants/Constants";
import ShortBy from "../Filters/ShortBy";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useNetwork } from "wagmi";
import Spinner from "../Loader/Spinner";

export default function Assets() {
  const [assetsArrayCopy, setAssetsArrayCopy] = useState<assetType[]>([]);
  const [initialAssets, setInitialAssets] = useState<assetType[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { chain } = useNetwork();

  const ITEMS_PER_PAGE = 5;
  const totalItems = assetsArrayCopy.length;
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
    const fetchData = async () => {
      let copy: any[] = [];
      let initials: any[] = [];
      if (chain && chain.id === 80001) {
        copy = assetsPolygon;
        initials = assetsPolygon;
      } else if (chain && chain.id === 42161) {
        copy = assetsArbitrum;
        initials = assetsArbitrum;
      } else if (chain && chain.id === 1) {
        copy = assetsMainnet;
        initials = assetsMainnet;
      }

      const promises = copy.map(async (asset) => {
        try {
          const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${asset.coingeckoApi}`
          );

          const data = response.data;
          asset.price = data?.market_data.current_price.usd;
          asset.marketCap = data?.market_data.market_cap.usd;
          asset.volumen24 = data?.market_data.total_volume.usd;
        } catch (error) {
          console.log(error);
        }
      });

      await Promise.all(promises);
      setAssetsArrayCopy(copy);
      setInitialAssets(initials);
      setLoading(false);
    };

    fetchData();
  }, [chain]);

  useEffect(() => {
    let copy = [...initialAssets];
    if (search.length !== 0) {
      copy = copy.filter((fund: assetType) =>
        fund.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "Price") {
      copy.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Market Cap") {
      copy.sort((a, b) => b.marketCap - a.marketCap);
    } else if (sortBy === "Volume 24h") {
      copy.sort((a, b) => b.volumen24 - a.volumen24);
    }

    setAssetsArrayCopy(copy);
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
        <span className="mx-1">{pageNumber}</span>
      )
    );
  };

  return (
    <main>
      <div className="flex items-center gap-x-[20px] justify-end mt-20">
        <SearchBar getInfo={getInfo} query={search} />
        <ShortBy
          getSortChange={getSortChange}
          shorts={["Price", "Market Cap", "Volume 24h"]}
          classSquare="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="w-full h-[574px] pt-[23px] px-[20px] bg-white rounded-lg flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <AssetsTable
          assets={assetsArrayCopy}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      )}

      <div className="flex items-center mt-4 relative">
        <span>
          Showing {startIndex + 1}-{endIndex} out of {assetsArrayCopy.length}
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
          {currentPage < assetsArrayCopy.length / 5 && (
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
