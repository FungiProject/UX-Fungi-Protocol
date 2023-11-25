import { fundViews } from "@/constants/Constants";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ActionsButton from "../Buttons/ActionsButton";
import UserInfo from "../Cards/UserInfo";
import ActivityView from "../FundViews/ActivityView";
import MembersView from "../FundViews/MembersView";
import OverviewView from "../FundViews/OverviewView";
import PortfolioView from "../FundViews/PortfolioView";
import ActionsSwitcher from "../Switchers/ActionsSwitcher";

export default function FundDetails() {
  const [actionSelected, setActionSelected] = useState("Overview");
  const [view, setView] = useState<ReactElement | null>(null);
  const { address } = useAccount();
  const router = useRouter();

  const getActionSelected = (action: string) => {
    setActionSelected(action);
  };
  const getViewComponent = () => {
    switch (actionSelected) {
      case "Overview":
        setView(<OverviewView />);
        break;
      case "Activity":
        setView(<ActivityView />);
        break;
      case "Portfolio":
        setView(<PortfolioView />);
        break;
      case "Members":
        setView(<MembersView />);
        break;
      default:
        setView(<OverviewView />);
        break;
    }
  };

  useEffect(() => {
    getViewComponent();
  }, []);

  useEffect(() => {
    getViewComponent();
  }, [actionSelected, router]);

  return (
    <main>
      <UserInfo
        address={router.query.address as `0x${string}`}
        isUser={false}
      />
      <div className="flex flex-col items-end">
        {/* isOwner in function of fund owner */}
        <ActionsButton fund={router.query.address as string} isOwner={true} />
        <ActionsSwitcher
          actions={fundViews}
          actionSelected={actionSelected}
          getActionSelected={getActionSelected}
          className="h-[40px] p-[4px] w-[600px] rounded-full grid grid-cols-4 bg-white items-center text-center mt-[17px] shadow-2xl"
          paddingButton="py-[4px]"
        />
      </div>
      {view && view}
    </main>
  );
}
