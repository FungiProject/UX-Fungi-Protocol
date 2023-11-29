import React from "react";
import AboutFundCard from "../Cards/AboutFundCard";
import Image from "next/image";
import Polygon from "../../../public/Polygon.svg";
import Mainnet from "../../../public/Mainnet.svg";
import Arbitrum from "../../../public/Arbitrum.svg";
import SearchIcon from "../../../public/SearchIcon.svg";

export default function OverviewView() {
  const description =
    "This fund invests in low market cap alternative coins that have the potential to increase 100 times during the next bull market. Decentralized Finance (DeFi) is a truly revolutionary force in the financial industry. While traditional banks narrowly avoided a systemic bank run and centralized exchanges (CEX) collapsed spectacularly, DeFi continued to operate seamlessly, providing trustless financial services to people around the globe. It is clear that DeFi is the future of finance and will continue to shape the industry in unprecedented ways.";
  const networks = [Mainnet.src, Arbitrum.src, Polygon.src];
  return (
    <main>
      <h1 className="ml-[40px] text-6xl">About</h1>
      <div className="flex h-[316px] mt-[22px]">
        <AboutFundCard description={description} />
        <div className="flex flex-col ml-[22px] ">
          <div className="h-[136px] bg-white rounded-xl w-[426px] px-[20px] pt-[20px] pb-[10px] shadow-xl">
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
          <div className="my-[20px] h-[70px] bg-white rounded-xl w-[426px] items-center flex justify-between px-[20px] py-[20px] shadow-xl">
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
          <div className="h-[70px] bg-white rounded-xl w-[426px] items-center flex justify-between px-[20px] py-[20px] shadow-xl">
            <span className="text-xl">Networks</span>
            <div className="flex items-center text-lg">
              <span className="mr-[15px]">0x345asfdd</span>
              <Image width={25} height={25} alt="Logo" src={SearchIcon.src} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
