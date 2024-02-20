// React
import React, { useEffect, useState } from "react";
// Components
import PageContainer from "../Container/PageContainer";
import HomeTable from "../Tables/HomeTable";

import ResultsChart from "../Chart/ResultsChart";
import SpinnerLoader from "../Loader/SpinnerLoader";
import useScAccountPositions from "@/domain/position/useScAccountPositions";

import useScAccountSpotPosition from "@/domain/position/useScAccountSpotPosition";

type HomeProps = {
  getSelectedAction: (action: string) => void;
};

export default function Home({ getSelectedAction }: HomeProps) {
  const { positions, totalBalance } = useScAccountPositions();
  const { totalCash } = useScAccountSpotPosition();
  const [positionsLoaded, setPositionsLoaded] = useState(false);

  useEffect(() => {
    positions.length !== 0 &&
      totalCash !== undefined &&
      totalBalance !== undefined &&
      setPositionsLoaded(true);
  }, [positions]);

  return (
    <main>
      <PageContainer
        main={
          <>
            {!positionsLoaded ? (
              <div className="w-full h-full flex justify-center items-center">
                {" "}
                <SpinnerLoader />
              </div>
            ) : (
              <HomeTable
                positions={positions}
                getSelectedAction={getSelectedAction}
                balance={totalBalance}
                cash={totalCash}
              />
            )}
          </>
        }
        secondary={<ResultsChart personalBalance={0} />}
        page="Home Section"
      />
    </main>
  );
}
