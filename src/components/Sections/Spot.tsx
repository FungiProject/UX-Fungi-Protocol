// React
import React, { useState } from "react";
// Components
import PageContainer from "../Container/PageContainer";
import AssetsTable from "../Tables/AssetsTable";
import Swapper from "../Cards/Swapper";
import ActionsSwitcher from "../Switchers/ActionsSwitcher";
import DWCActionCard from "../Cards/DWCActionCard";

export default function Spot() {
  const [actionSelected, setActionSelected] = useState("Swap");

  const getActionSelected = (action: string) => {
    setActionSelected(action);
  };
  return (
    <main>
      <PageContainer
        main={<AssetsTable />}
        secondary={
          <div className="px-[32px] pt-[24px]">
            <ActionsSwitcher
              actions={["Swap", "Deposit", "Bridge"]}
              actionSelected={actionSelected}
              getActionSelected={getActionSelected}
              className="h-[30px] p-[4px] w-full rounded-full grid grid-cols-3 bg-white items-center text-center shadow-input text-xs"
              paddingButton="py-[3px]"
            />
            {actionSelected === "Deposit" ? <DWCActionCard /> : <Swapper />}
          </div>
        }
      />
    </main>
  );
}
