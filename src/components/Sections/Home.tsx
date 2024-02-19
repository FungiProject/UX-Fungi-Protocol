// React
import React from "react";
// Components
import PageContainer from "../Container/PageContainer";
import HomeTable from "../Tables/HomeTable";

import ResultsChart from "../Chart/ResultsChart";

type HomeProps = {
  getSelectedAction: (action: string) => void;
};

export default function Home({ getSelectedAction }: HomeProps) {
  const positions = [
    {
      type: "Spot",
      number: 19,
      totalValue: 1829499.29,
      unPnL: -12343.43,
    },
    {
      type: "Perps",
      number: 19,
      totalValue: 1829499.29,
      unPnL: -12343.43,
    },
  ];
  return (
    <main>
      <PageContainer
        main={
          <HomeTable
            positions={positions}
            getSelectedAction={getSelectedAction}
          />
        }
        secondary={<ResultsChart personalBalance={0} />}
        page="Home Section"
      />
    </main>
  );
}
