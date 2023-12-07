// React
import React, { ReactElement, useEffect, useState } from "react";
// Next
import { useRouter } from "next/router";
// Constants
import { fundViews } from "@/constants/Constants";
// Wagmi
import { useAccount } from "wagmi";
// Components
import ActionsButton from "../Buttons/ActionsButton";
import UserInfo from "../Cards/UserInfo";
import ActivityView from "../FundViews/ActivityView";
import MembersView from "../FundViews/MembersView";
import OverviewView from "../FundViews/OverviewView";
import PortfolioView from "../FundViews/PortfolioView";
import MembersModal from "../Modals/MembersModal";
import ActionsSwitcher from "../Switchers/ActionsSwitcher";
// Images
import DefaultImage from "../../../public/DefaultImage.svg";

export default function FundDetails() {
  const [actionSelected, setActionSelected] = useState<string>("Overview");
  const [typeMember, setTypeMember] = useState<string>("Members");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [ownerLoaded, setOwnerLoaded] = useState<boolean>(false);
  const [view, setView] = useState<ReactElement | null>(null);
  const { address } = useAccount();
  const router = useRouter();

  const owner = "0xF70c1cEa8909563619547128A92dd7CC965F9657";
  const typesMembersTable = ["Members", "Whitelisted"];

  const members = [
    {
      address: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
      image: DefaultImage.src,
    },
    {
      address: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
      image: DefaultImage.src,
    },
    {
      address: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
      image: DefaultImage.src,
    },
    {
      address: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
      image: DefaultImage.src,
    },
    {
      address: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
      image: DefaultImage.src,
    },
    {
      address: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
      image: DefaultImage.src,
    },
    {
      address: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
      image: DefaultImage.src,
    },
    {
      address: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
      image: DefaultImage.src,
    },
    {
      address: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
      image: DefaultImage.src,
    },
    {
      address: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
      image: DefaultImage.src,
    },
    {
      address: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
      image: DefaultImage.src,
    },
    {
      address: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
      image: DefaultImage.src,
    },
  ];

  const getActionSelected = (action: string) => {
    setActionSelected(action);
  };

  const getTypeMember = (action: string) => {
    setTypeMember(action);
  };

  const getOpenModal = (status: boolean) => {
    setOpenModal(status);
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
        setView(
          <MembersView
            typeMember={typeMember}
            members={members}
            isOwner={owner === address}
          />
        );
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
    setOwnerLoaded(true);
  }, [address]);

  useEffect(() => {
    getViewComponent();
  }, [actionSelected, router, typeMember]);

  return (
    <main>
      {ownerLoaded ? (
        <>
          {" "}
          <UserInfo
            address={router.query.address as `0x${string}`}
            isUser={false}
            isOwner={owner === address}
          />
          <div className="flex flex-col items-end mb-[12px]">
            <ActionsButton
              fund={router.query.address as string}
              isOwner={owner === address}
            />

            <div
              className={`flex items-center w-full ${
                owner === address && actionSelected === "Members"
                  ? "justify-between"
                  : "justify-end"
              }`}
            >
              {actionSelected === "Members" && owner === address && (
                <div className="flex items-center mt-[17px]">
                  <>
                    <button
                      className="rounded-full bg-main px-[35px] py-[8px] text-center text-white mr-[13px] text-xs h-[40px]"
                      onClick={() => setOpenModal(true)}
                    >
                      Add Wallet
                    </button>
                    {openModal && (
                      <MembersModal
                        getOpenModal={getOpenModal}
                        members={members}
                      />
                    )}
                    <ActionsSwitcher
                      actions={typesMembersTable}
                      actionSelected={typeMember}
                      getActionSelected={getTypeMember}
                      className="h-[40px] p-[4px] w-[300px] rounded-full grid grid-cols-2 bg-white items-center text-center shadow-xl text-sm"
                      paddingButton="py-[6px]"
                    />
                  </>
                </div>
              )}
              <ActionsSwitcher
                actions={fundViews}
                actionSelected={actionSelected}
                getActionSelected={getActionSelected}
                className="h-[40px] p-[4px] w-[600px] rounded-full grid grid-cols-4 bg-white items-center text-center mt-[17px] shadow-xl text-sm"
                paddingButton="py-[6px]"
              />
            </div>
          </div>
          {view && view}
        </>
      ) : (
        <></>
      )}
    </main>
  );
}
