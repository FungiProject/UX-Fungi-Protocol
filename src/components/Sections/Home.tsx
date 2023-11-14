import { homeCards } from "@/constants/Constants";
import { fundType, homeDataType } from "@/types/Types";
import React, { useEffect, useState } from "react";
import HomeCard from "../Cards/Homecard";
import SearchBar from "../Filters/SearchBar";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [funds, setFunds] = useState<fundType[]>([]);
  const [fundsCopy, setFundsCopy] = useState<fundType[]>([]);

  const getInfo = (query: string) => {
    setSearch(query);
  };

  useEffect(() => {
    let copy = [...funds];
    if (search.length !== 0) {
      copy = funds.filter((fund: fundType) =>
        fund.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFundsCopy(copy);
  }, [search]);

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
      <SearchBar getInfo={getInfo} />
    </main>
  );
}
