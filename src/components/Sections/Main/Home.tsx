// React
import React, { useEffect, useState } from "react";
// Components
import PageContainer from "../../Container/PageContainer";
import HomeTable from "../../Tables/HomeTable";

import ResultsChart from "../../Chart/ResultsChart";
import SpinnerLoader from "../../Loader/SpinnerLoader";
import useScAccountPositions from "@/domain/position/useScAccountPositions";
import useScAccountSpotPosition from "@/domain/position/useScAccountSpotPosition";
import StartDepositBanner from "../Fallbacks/StartDepositBanner";

type HomeProps = {
  getSelectedAction: (action: string) => void;
};

export default function Home({ getSelectedAction }: HomeProps) {
  const { positions, totalBalance } = useScAccountPositions();
  const { totalCash } = useScAccountSpotPosition();
  const [positionsLoaded, setPositionsLoaded] = useState(false);

  useEffect(() => {
    totalCash !== undefined &&
      totalBalance !== undefined &&
      setPositionsLoaded(true);
  }, [positions, totalCash, totalBalance]);

  return (
    <main>
      <PageContainer
        main={
          <>
            {!positionsLoaded ? (
              <div className="w-full h-full flex justify-center items-center">
                <SpinnerLoader />
              </div>
            ) : (
              <>
                {positions.length !== 0 ? (
                  <HomeTable
                    positions={positions}
                    getSelectedAction={getSelectedAction}
                    balance={totalBalance}
                    cash={totalCash}
                  />
                ) : (
                  <StartDepositBanner />
                )}
              </>
            )}
          </>
        }
        secondary={
          <>{totalBalance && <ResultsChart personalBalance={totalBalance} />}</>
        }
        page="Home Section"
      />
    </main>
  );
}
