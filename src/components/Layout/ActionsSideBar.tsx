// React
import React, { ReactElement, useEffect, useState } from "react";
// Components
import LogoutButton from "../Buttons/LogoutButton";
import ChangeNetworkDropdown from "../Dropdown/ChangeNetworkDropdown";
import LoginButton from "../Buttons/LoginButton";
import Home from "../Sections/Home";
// Constants
import { networks, navigation } from "../../../constants/Constants";
// Types
import { navigationType } from "@/types/Types";
// Next
import Image from "next/image";
import Link from "next/link";
// Images
import Logo from "../../../public/Logo.svg";
import User from "../../../public/User.svg";
import SendIcon from "../../../public/SendIcon.svg";
import SettingsIcon from "../../../public/SettingsIcon.svg";
import WithdrawIcon from "../../../public/WithdrawIcon.svg";
import DepositIcon from "../../../public/DepositIcon.svg";
import LogOutIcon from "../../../public/LogOutIcon.svg";
import TransactionIcon from "../../../public/TransactionIcon.svg";

import Spot from "../Sections/Spot";
import History from "../Sections/History";
import { SyntheticsPage } from "../Sections/SyntheticsPage";
import GM from "../Sections/GM";
import { getIsSyntheticsSupported } from "@/utils/gmx/config/features";
import { useChainId } from "@/utils/gmx/lib/chains";
import { SyntheticsFallbackPage } from "../Sections/SyntheticsFallbackPage";
import Credit from "../Sections/Credit";
import Nfts from "../Sections/Nfts";
import useWallet from "@/hooks/useWallet";
import { XMarkIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import ProfileSelectionButton from "../Buttons/ProfileSelectionButton";
import { useRouter } from "next/router";

type ActionsSideBarProps = {
  isHistory: boolean;
};

export default function ActionsSideBar({ isHistory }: ActionsSideBarProps) {
  const { isConnected, scAccount, logout } = useWallet();
  const { chainId } = useChainId();
  const router = useRouter();
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
        setPage(<GM />);
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

  const [page, setPage] = useState<ReactElement>(
    <Home getSelectedAction={getSelectedAction} />
  );

  useEffect(() => {
    getViewComponent();
    setOpenMenu(false);
  }, [actionSelected]);

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

  const logingOut = async () => {
    logout();
    setOpenMenu(false);
    router.push("/");
  };

  const handle = async () => {
    console.log("//TODO Fungi");
  };

  const profileActions = [
    {
      title: "Send",
      image: SendIcon.src,
      status: false,
      onClick: handle,
    },
    {
      title: "Withdraw",
      image: WithdrawIcon.src,
      status: false,
      onClick: handle,
    },
    {
      title: "Transactions",
      image: TransactionIcon.src,
      status: false,
      onClick: handle,
    },
    {
      title: "Deposit",
      image: DepositIcon.src,
      status: false,
      onClick: handle,
    },
    {
      title: "Settings",
      image: SettingsIcon.src,
      status: false,
      onClick: handle,
    },
    {
      title: "Log Out",
      image: LogOutIcon.src,
      status: true,
      onClick: logingOut,
    },
  ];

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
              <div>
                <button onClick={() => setOpenMenu(true)}>
                  <img src={User.src} />
                </button>
                {openMenu && (
                  <div className="bg-white rounded-lg px-4 py-2 absolute top-0 -right-[25px] h-[392px] w-[392px] shadow-input z-50">
                    <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                      <button
                        type="button"
                        className="rounded-md bg-white hover:text-gray-700 text-black focus:outline-none"
                        onClick={() => setOpenMenu(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon
                          className="h-[25px] w-[25px]"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <div className="flex flex-col justify-center p-[36px] text-center">
                      <p className="text-xl mb-[18px]">Your Fungi Account</p>
                      <button
                        className="shadow-input py-1 px-0.5 rounded-lg flex w-fit mx-auto items-center"
                        onClick={() =>
                          navigator.clipboard.writeText(scAccount as string)
                        }
                      >
                        {" "}
                        <UserIcon
                          className="h-[18px] w-[18px]"
                          aria-hidden="true"
                        />
                        <span className="mx-[9px]">
                          {scAccount?.substring(0, 10) + "..."}
                        </span>{" "}
                        <DocumentDuplicateIcon
                          className="h-[18px] w-[18px]"
                          aria-hidden="true"
                        />
                      </button>
                      <div className="grid grid-cols-3 gap-x-[54px] gap-y-[30px] mt-[34px]">
                        {profileActions.map((action) => {
                          return (
                            <ProfileSelectionButton
                              title={action.title}
                              image={action.image}
                              status={action.status}
                              onClick={action.onClick}
                              key={action.title}
                            />
                          );
                        })}
                      </div>
                      {/* <ChangeNetworkDropdown
                      isModal={false}
                      networks={networks}
                    />{" "}
                    <LogoutButton /> */}
                    </div>
                  </div>
                )}
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

      <main>{page}</main>
    </div>
  );
}
