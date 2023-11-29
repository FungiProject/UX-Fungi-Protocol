import React from "react";
import AboutFundCard from "../Cards/AboutFundCard";
import Polygon from "../../../public/Polygon.svg";
import Mainnet from "../../../public/Mainnet.svg";
import Arbitrum from "../../../public/Arbitrum.svg";
import FeesFundCards from "../Cards/FeesFundCards";

export default function OverviewView() {
  const description =
    "This fund invests in low market cap alternative coins that have the potential to increase 100 times during the next bull market. Decentralized Finance (DeFi) is a truly revolutionary force in the financial industry. While traditional banks narrowly avoided a systemic bank run and centralized exchanges (CEX) collapsed spectacularly, DeFi continued to operate seamlessly, providing trustless financial services to people around the globe. It is clear that DeFi is the future of finance and will continue to shape the industry in unprecedented ways.";
  const networks = [Mainnet.src, Arbitrum.src, Polygon.src];
  return (
    <main>
      <h1 className="ml-[40px] text-6xl">About</h1>
      <div className="flex h-[316px] mt-[22px]">
        <AboutFundCard description={description} />
        <FeesFundCards networks={networks} />
      </div>
    </main>
  );
}
