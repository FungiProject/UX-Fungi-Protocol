import React, { ReactElement, useEffect, useState } from "react";

import LogoutButton from "../Buttons/LogOutButton";
import { useAccount } from "wagmi";
import LoginButton from "../Buttons/LoginButton";

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
      <div className="flex shrink-0 items-center gap-x-4  sticky top-0 z-50 mt-[40px]">
        <div className="flex flex-1 gap-x-1 self-stretch lg:gap-x-3 z-50">
          <div className="relative flex flex-1 justify-end items-center gap-x-4">
            {connectedWallet ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </div>

      <main className="pl-[20px]">{page}</main>
    </div>
  );
}
