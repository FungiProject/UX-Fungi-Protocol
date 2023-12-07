// Images
import React from "react";
// Next
import Image from "next/image";
// Images
import SearchIcon from "../../../public/SearchIcon.svg";

type FeesFundCardsProps = {
  networks: string[];
};

export default function FeesFundCards({ networks }: FeesFundCardsProps) {
  return (
    <main className="flex xl:flex-col xl:ml-[22px] mt-[22px] xl:mt-0">
      <div className="xl:h-[136px] bg-white rounded-xl xl:w-[426px] w-full px-[20px] pt-[20px] pb-[10px] shadow-xl">
        <span className="text-3xl">Fees</span>
        <div className="flex flex-col text-xl">
          <div className="flex justify-between my-[5px]">
            <span>Management</span> <span>2%</span>
          </div>
          <div className="flex justify-between">
            <span>Performance</span> <span>20%</span>
          </div>
        </div>
      </div>
      <div>
        <div className="ml-[22px] mb-[22px] xl:ml-0 xl:my-[20px] h-[70px] bg-white rounded-xl xl:w-[426px] items-center flex justify-between px-[20px] py-[20px] shadow-xl">
          <span className="text-xl">Networks</span>
          <div className="flex justify-center">
            {networks.map((network: string, index: number) => {
              return (
                <Image
                  style={{ zIndex: `${index * 10}` }}
                  width={35}
                  height={35}
                  alt="Logo"
                  src={network}
                  className={index === 1 ? "-mx-2.5" : ""}
                  key={network}
                />
              );
            })}
          </div>
        </div>
        <div className="ml-[22px] xl:ml-0 h-[70px] bg-white rounded-xl w-[426px] items-center flex justify-between px-[20px] py-[20px] shadow-xl">
          <span className="text-xl">Networks</span>
          <div className="flex items-center text-lg">
            <span className="mr-[15px]">0x345asfdd</span>
            <Image width={25} height={25} alt="Logo" src={SearchIcon.src} />
          </div>
        </div>
      </div>
    </main>
  );
}
