import React, { ReactElement, useEffect, useState } from "react";

import LogoutButton from "../Buttons/LogOutButton";
import { useAccount } from "wagmi";
import LoginButton from "../Buttons/LoginButton";
import ChangeNetworkDropdown from "../Dropdown/ChangeNetworkDropdown";
import { networks } from "@/constants/Constants";

interface ActionsSideBarProps {
  page: ReactElement;
}

export default function ActionsSideBar({ page }: ActionsSideBarProps) {
  const { isConnected } = useAccount();
  const [connectedWallet, setConnectedWallet] = useState(false);

  useEffect(() => {
    isConnected ? setConnectedWallet(true) : setConnectedWallet(false);
  }, [isConnected]);

  return (
    <div className="lg:pl-[187px] ">
      <div className="flex shrink-0 items-center gap-x-4 z-50 mt-[40px]">
        <div className="flex flex-1 gap-x-1 self-stretch lg:gap-x-3 z-50">
          <div className="relative flex flex-1 justify-end items-center gap-x-4">
            {connectedWallet ? (
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

      <main className="pl-[20px]">{page}</main>
    </div>
  );
}
