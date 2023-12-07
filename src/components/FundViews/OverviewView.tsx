// React
import React from "react";
// Components
import AboutFundCard from "../Cards/AboutFundCard";
import FeesFundCards from "../Cards/FeesFundCards";
import ResultsChart from "../Chart/ResultsChart";
// Images
import Polygon from "../../../public/MainnetTokens/Polygon.svg";
import Mainnet from "../../../public/MainnetTokens/Mainnet.svg";
import Arbitrum from "../../../public/ArbitrumTokens/Arbitrum.svg";

export default function OverviewView() {
  const description =
    "This fund invests in low market cap alternative coins that have the potential to increase 100 times during the next bull market. Decentralized Finance (DeFi) is a truly revolutionary force in the financial industry. While traditional banks narrowly avoided a systemic bank run and centralized exchanges (CEX) collapsed spectacularly, DeFi continued to operate seamlessly, providing trustless financial services to people around the globe. It is clear that DeFi is the future of finance and will continue to shape the industry in unprecedented ways.";
  const networks = [Mainnet.src, Arbitrum.src, Polygon.src];
  const performance = 12;
  const aum = 748332343.32;
  const personalBalance = 8974.31;
  return (
    <main>
      <ResultsChart
        personalBalance={personalBalance}
        aum={aum}
        performance={performance}
      />
      <h1 className="mt-[110px] ml-[40px] text-6xl">About</h1>
      <div className="flex min-h-[316px] mt-[22px] flex-col xl:flex-row">
        <AboutFundCard description={description} />
        <FeesFundCards networks={networks} />
      </div>
    </main>
  );
}
