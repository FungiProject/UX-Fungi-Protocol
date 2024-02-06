// React
import React, { useState } from "react";
// Components
import PageContainer from "../Container/PageContainer";
import SpotTable from "../Tables/SpotTable";
import Swapper from "../Cards/Swapper";
import ActionsSwitcher from "../Switchers/ActionsSwitcher";
import DWCActionCard from "../Cards/DWCActionCard";
// Hooks
import useLiFiTokens from "@/hooks/useLiFiTokens";

export default function Spot() {
  const [actionSelected, setActionSelected] = useState("Swap");
  const tokens = useLiFiTokens({ chain: "POL" });

  const getActionSelected = (action: string) => {
    setActionSelected(action);
  };
  return (
    <main>
      <PageContainer
        main={<SpotTable tokens={tokens} />}
        secondary={
          <div className="px-[32px] pt-[24px]">
            <ActionsSwitcher
              actions={["Swap", "Deposit", "Bridge"]}
              actionSelected={actionSelected}
              getActionSelected={getActionSelected}
              className="h-[40px] p-[4px] w-full rounded-full grid grid-cols-3 bg-white items-center text-center shadow-input text-sm mb-4 font-semibold"
              paddingButton="py-[5px]"
            />
            {actionSelected === "Deposit" ? <DWCActionCard /> : <Swapper />}
          </div>
        }
      />
    </main>
  );
}
