// React
import React, { ReactElement, useEffect, useState } from "react";
// Components
import LoginButton from "../Buttons/LoginButton";
import Home from "../Sections/Main/Home";
// Constants
import { navigation } from "../../../constants/Constants";
// Types
import { navigationType } from "@/types/Types";
// Next
import Image from "next/image";
// Images
import Logo from "../../../public/profile/Logo.svg";
import User from "../../../public/profile/User.svg";

import Spot from "../Sections/Main/Spot";
import History from "../Sections/Main/History";
import { SyntheticsPage } from "../Sections/Main/SyntheticsPage";
import GM from "../Sections/Main/GM";
import { getIsSyntheticsSupported } from "@/utils/gmx/config/features";
import { useChainId } from "@/utils/gmx/lib/chains";
import { SyntheticsFallbackPage } from "../Sections/Fallbacks/SyntheticsFallbackPage";
import Credit from "../Sections/Main/Credit";
import Nfts from "../Sections/Main/Nfts";
import useWallet from "@/hooks/useWallet";
import { networks } from "../../../constants/Constants";
import ProfileModal from "../Modals/ProfileModal";
import ChangeNetworkDropdown from "../Dropdown/ChangeNetworkDropdown";

type ActionsSideBarProps = {
  isHistory: boolean;
};

export default function ActionsSideBar({ isHistory }: ActionsSideBarProps) {
  const { isConnected, chainId } = useWallet();
  const [actionSelected, setActionSelected] = useState<string>("Home");
  const [connected, setConnected] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const getSelectedAction = (action: string) => {
    setActionSelected(action);
  };

  const getViewComponent = () => {
    switch (actionSelected) {
      case "Home":
        setPage(<Home getSelectedAction={getSelectedAction} />);
        break;
      case "Spot":
        setPage(<Spot />);
        break;

      case "Perps":
        {
          getIsSyntheticsSupported(chainId)
            ? setPage(<SyntheticsPage />)
            : setPage(<SyntheticsFallbackPage />);
        }
        break;
      case "Credit":
        setPage(<Credit />);
        break;
      case "Yield":
        {
          getIsSyntheticsSupported(chainId)
            ? setPage(<GM />)
            : setPage(<SyntheticsFallbackPage />);
        }
        break;
      case "NFTs":
        setPage(<Nfts />);
        break;
      case "Transaction History":
        setPage(<History />);
        break;
      default:
        setPage(<Home getSelectedAction={getSelectedAction} />);
        break;
    }
  };

  const getOpenModal = (status: boolean) => {
    setOpenMenu(status);
  };

  const [page, setPage] = useState<ReactElement>(
    <Home getSelectedAction={getSelectedAction} />
  );

  useEffect(() => {
    getViewComponent();
    setOpenMenu(false);
  }, [actionSelected, chainId]);

  useEffect(() => {
    isHistory && setActionSelected("Transaction History");
  }, [isHistory]);

  useEffect(() => {
    if (isConnected) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [isConnected]);

  return (
    <div className="overflow-auto">
      <div className="flex shrink-0 items-center gap-x-4 z-50 mt-[20px] mb-16">
        <div className="flex flex-1 gap-x-1 self-stretch lg:gap-x-3 z-5 ml-[75px] mr-[25px] items-center justify-between">
          <div className="flex items-center">
            <Image
              width={62}
              height={68}
              alt="Logo"
              src={Logo.src}
              aria-hidden="true"
            />
          </div>
          {!isHistory && (
            <div className="h-[44px] p-[4px] w-[800px] rounded-full grid grid-cols-6 bg-white items-center text-center shadow-xl text-sm">
              {navigation.map((link: navigationType) => {
                return (
                  <button
                    key={link.href}
                    onClick={() => setActionSelected(link.name)}
                    className={
                      link.name === actionSelected
                        ? `bg-black text-white rounded-full py-[8px] flex items-center justify-center mx-1`
                        : "bg-white flex items-center justify-center hover:bg-gray-100 hover:rounded-full hover:py-[8px] mx-1"
                    }
                  >
                    <Image
                      width={20}
                      height={20}
                      alt="Logo"
                      src={
                        link.name === actionSelected
                          ? link.imageActive
                          : link.imageDesactive
                      }
                      aria-hidden="true"
                      className="mr-3 "
                    />
                    {link.name}
                  </button>
                );
              })}
            </div>
          )}
          <div className="relative flex items-center">
            {connected ? (
              <div className="flex flex-row items-center">
                <ChangeNetworkDropdown networks={networks} />
                <div>
                  <button onClick={() => setOpenMenu(true)}>
                    <img src={User.src} />
                  </button>
                  {openMenu && <ProfileModal getOpenModal={getOpenModal} />}
                </div>
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>

      <main>{page}</main>
    </div>
  );
}
