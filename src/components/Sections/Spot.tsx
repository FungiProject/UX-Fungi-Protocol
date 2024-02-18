// React
import React, { useState } from "react";
// Components
import PageContainer from "../Container/PageContainer";
import SpotTable from "../Tables/SpotTable";
import Swapper from "../Cards/Swapper";
import ActionsSwitcher from "../Switchers/ActionsSwitcher";
import Bridge from "../Cards/Bridge";
import Rebalancer from "../Cards/Rebalancer";
// Hooks
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
import { useTokensInfo } from "@/hooks/useTokensInfo";

export default function Spot() {
  const { chainId } = useWallet();
  const [actionSelected, setActionSelected] = useState("Swap");
  const {tokens} = useTokensInfo()

  const getActionSelected = (action: string) => {
    setActionSelected(action);
  };
  return (
    <main>
      <PageContainer
        main={<SpotTable tokens={tokens}/>}
        secondary={
          <div className="px-[32px] pt-[24px]">
            {tokens !== undefined && chainId !== undefined && (
              <>
                <ActionsSwitcher
                  actions={["Swap", "Bridge", "Rebalance"]}
                  actionSelected={actionSelected}
                  getActionSelected={getActionSelected}
                  className="h-[40px] p-[4px] w-full rounded-full grid grid-cols-3 bg-white items-center text-center shadow-input text-sm mb-4 font-semibold"
                  paddingButton="py-[5px]"
                />
                {actionSelected === "Rebalance" ? (
                  <Rebalancer tokens={tokens}/>
                ) : actionSelected === "Bridge" ? (
                  <Bridge tokens={tokens} chainId={chainId} />
                ) : (
                  <Swapper tokens={tokens} chainId={chainId} />
                )}
              </>
            )}
          </div>
        }
      />
    </main>
  );
}
