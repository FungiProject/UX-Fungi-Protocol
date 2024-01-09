// React
import React from "react";
// Components
import PageContainer from "../Container/PageContainer";
import AssetsTable from "../Tables/AssetsTable";
import ResultsChart from "../Chart/ResultsChart";

export default function Spot() {
  return (
    <main>
      <PageContainer
        main={<AssetsTable />}
        secondary={<ResultsChart personalBalance={0} />}
      />
    </main>
  );
}
