import { homeCards } from "@/constants/Constants";
import { fundType, homeDataType } from "@/types/Types";
import React, { useEffect, useState } from "react";
import HomeCard from "../Cards/Homecard";
import SearchBar from "../Filters/SearchBar";
import FundsTable from "../Tables/FundsTable";
import { funds } from "@/constants/Constants";
import ShortBy from "../Filters/ShortBy";

export default function Home() {
  const [fundsArrayCopy, setFundsArrayCopy] = useState<fundType[]>(funds);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  const getInfo = (query: string) => {
    setSearch(query);
  };

  const getSortChange = (option: string) => {
    setSortBy(option);
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

      <FundsTable funds={fundsArrayCopy} />
      <div className="flex">
        <div>1</div> <div>2</div> <div>3</div> <div>4</div> <div>5</div>
      </div>
    </main>
  );
}
