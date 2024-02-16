// React
import React, { ReactElement, useEffect, useState } from "react";
// Components
import LogoutButton from "../Buttons/LogoutButton";
import ChangeNetworkDropdown from "../Dropdown/ChangeNetworkDropdown";
import LoginButton from "../Buttons/LoginButton";
import Home from "../Sections/Home";
// Wagmi
import { useAccount } from "wagmi";
// Constants
import { networks, navigation } from "../../../constants/Constants";
// Types
import { navigationType } from "@/types/Types";
// Next
import Image from "next/image";
import Link from "next/link";
// Images
import Logo from "../../../public/Logo.svg";
import Spot from "../Sections/Spot";
import History from "../Sections/History";
import { SyntheticsPage } from "../Sections/SyntheticsPage";
import GM from "../Sections/GM";
import { getIsSyntheticsSupported } from "@/utils/gmx/config/features";
import { useChainId } from "@/utils/gmx/lib/chains";
import { SyntheticsFallbackPage } from "../Sections/SyntheticsFallbackPage";

type ActionsSideBarProps = {
  isHistory: boolean;
};

export default function ActionsSideBar({ isHistory }: ActionsSideBarProps) {
  const { isConnected } = useAccount();
  const { chainId } = useChainId();
  const [actionSelected, setActionSelected] = useState<string>("Home");
  const [connected, setConnected] = useState(false);

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
      case "Transaction History":
        setPage(<History />);
        break;
      case "Yield":
        setPage(<GM />);
        break;
      default:
        setPage(<Home getSelectedAction={getSelectedAction} />);
        break;
    }
  };

  const [page, setPage] = useState<ReactElement>(
    <Home getSelectedAction={getSelectedAction} />
  );

  useEffect(() => {
    getViewComponent();
  }, [actionSelected]);

  useEffect(() => {
    isHistory && setActionSelected("Transaction History");
  }, [isHistory]);

  useEffect(() => {
    isConnected && setConnected(true);
  }, [isConnected]);

  // useEffect(() => {
  //   if (
  //     chain &&
  //     (chain.id === arbitrum.id ||
  //       chain.id === polygonMumbai.id ||
  //       chain.id === mainnet.id ||
  //       chain.id === polygon.id ||
  //       chain.id === arbitrumGoerli.id ||
  //       chain.id === sepolia.id)
  //   ) {
  //     const prev = networks.filter((network) => network.id === chain?.id);

  //     setPreviousNetwork(prev[0]);
  //   }
  // }, [chain]);

  return (
    <div>
      <div className="flex shrink-0 items-center gap-x-4 z-50 mt-[40px]">
        <div className="flex flex-1 gap-x-1 self-stretch lg:gap-x-3 z-5 ml-[75px] mr-[25px]">
          <Link href="/" className="flex items-center">
            <Image
              width={62}
              height={68}
              alt="Logo"
              src={Logo.src}
              aria-hidden="true"
            />
            <h1 className="text-4xl font-bold ml-[20px]">{actionSelected}</h1>
          </Link>

          <div className="relative flex flex-1 justify-end items-center gap-x-4">
            {connected ? (
              <div className="flex items-center">
                <ChangeNetworkDropdown isModal={false} networks={networks} />{" "}
                <LogoutButton />
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
      {!isHistory && (
        <div className="h-[44px] p-[4px] w-[800px] rounded-full grid grid-cols-6 bg-white items-center text-center shadow-xl text-sm mt-[24px]">
          {navigation.map((link: navigationType) => {
            return (
              <button
                key={link.href}
                onClick={() => setActionSelected(link.name)}
                className={
                  link.name === actionSelected
                    ? `bg-black text-white rounded-full py-[8px] flex items-center justify-center`
                    : "bg-white flex items-center justify-center hover:bg-gray-100 hover:rounded-full hover:py-[8px]"
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

      <main>{page}</main>
    </div>
  );
}
