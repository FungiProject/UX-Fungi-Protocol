// React
import React, { useEffect, useState } from "react";
// Types
import { assetType, NetworkType } from "@/types/Types";
// Axios
import axios from "axios";
// Components
import SearchBar from "../Filters/SearchBar";
import AssetsTable from "../Tables/AssetsTable";
import SortBy from "../Filters/SortBy";
import Spinner from "../Loader/Spinner";
import SelectNetworkDropdown from "../Dropdown/SelectNetworkDropdown";
// Constants
import {
  assetsPolygon,
  assetsArbitrum,
  assetsMainnet,
  assetsPolygonMumbai,
  networks,
} from "@/constants/Constants";
// Heroicons
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
// Wagmi
import { useNetwork } from "wagmi";

export default function Assets() {
  const [assetsArrayCopy, setAssetsArrayCopy] = useState<assetType[]>([]);
  const [initialAssets, setInitialAssets] = useState<assetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType | null>(
    null
  );
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Sort By");
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

  const fetchData = async (sortByNetwork: boolean) => {
    let copy: any[] = [];
    let initials: any[] = [];
    if (!sortByNetwork) {
      if (chain && chain.id === 80001) {
        copy = assetsPolygonMumbai;
        initials = assetsPolygonMumbai;
      } else if (chain && chain.id === 42161) {
        copy = assetsArbitrum;
        initials = assetsArbitrum;
      } else if (chain && chain.id === 1) {
        copy = assetsMainnet;
        initials = assetsMainnet;
      } else if (chain && chain.id === 137) {
        copy = assetsPolygon;
        initials = assetsPolygon;
      }
    } else {
      if (selectedNetwork && selectedNetwork.id === 80001) {
        copy = assetsPolygonMumbai;
        initials = assetsPolygonMumbai;
      } else if (selectedNetwork && selectedNetwork.id === 42161) {
        copy = assetsArbitrum;
        initials = assetsArbitrum;
      } else if (selectedNetwork && selectedNetwork.id === 1) {
        copy = assetsMainnet;
        initials = assetsMainnet;
      } else if (selectedNetwork && selectedNetwork.id === 137) {
        copy = assetsPolygon;
        initials = assetsPolygon;
      }
    }

    const promises = copy.map(async (asset) => {
      try {
        console.log(`Fetching data for ${asset.coingeckoApi}`);
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${asset.coingeckoApi}?x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API}`
        );
        if (response.status === 200) {
          const data = response.data;
          asset.price = data?.market_data.current_price.usd;
          asset.marketCap = data?.market_data.market_cap.usd;
          asset.volumen24 = data?.market_data.total_volume.usd;
        } else {
          console.log("Error");
        }
      } catch (error) {
        asset.price = 0;
        asset.marketCap = 0;
        asset.volumen24 = 0;
      }
    });

    await Promise.all(promises).then(() => {
      setAssetsArrayCopy(copy);
      setCurrentPage(1);
      setInitialAssets(initials);
      setSortBy("Short By");
      setSearch("");
      setLoading(false);
    });
  };

  useEffect(() => {
    return () => {
      fetchData(false);
    };
  }, []);

  useEffect(() => {
    fetchData(false);
  }, [chain]);

  useEffect(() => {
    fetchData(true);
  }, [selectedNetwork]);

  useEffect(() => {
    let copy = [...initialAssets];
    if (search.length !== 0) {
      copy = copy.filter((fund: assetType) =>
        fund.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "Price") {
      copy.sort((a: assetType, b: assetType) => {
        if (a.price !== undefined && b.price !== undefined) {
          return b.price - a.price;
        } else {
          return 0;
        }
      });
    } else if (sortBy === "Market Cap") {
      copy.sort((a, b) => {
        if (a.marketCap !== undefined && b.marketCap !== undefined) {
          return b.marketCap - a.marketCap;
        } else {
          return 0;
        }
      });
    } else if (sortBy === "Volume 24h") {
      copy.sort((a, b) => {
        if (a.volumen24 !== undefined && b.volumen24 !== undefined) {
          return b.volumen24 - a.volumen24;
        } else {
          return 0;
        }
      });
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
        <span className="mx-1" key={index}>
          {pageNumber}
        </span>
      )
    );
  };

  const getNetwork = (network: NetworkType) => {
    setSelectedNetwork(network);
  };

  return (
    <main>
      <div className="flex items-center gap-x-[20px] justify-end mt-20">
        <SearchBar
          getInfo={getInfo}
          query={search}
          classMain="rounded-full text-black px-[22px] items-center w-[270px] shadow-lg outline-none placeholder:text-black bg-white flex"
          placeholder="Search"
        />
        <SortBy
          getSortChange={getSortChange}
          sorts={["Price", "Market Cap", "Volume 24h"]}
          classSquare="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          selection={sortBy}
        />
        <SelectNetworkDropdown
          getNetwork={getNetwork}
          networks={networks}
          selectedNetwork={selectedNetwork}
          classDropdown={`inline-flex ${
            selectedNetwork ? "w-fit py-2" : "w-[270px] py-3"
          } shadow-lg outline-none bg-white items-center justify-between gap-x-1.5 rounded-full px-3  text-sm font-semibold text-gray-900`}
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
