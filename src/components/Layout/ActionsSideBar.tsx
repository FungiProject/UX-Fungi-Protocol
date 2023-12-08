// React
import React, { ReactElement, useEffect, useState } from "react";
// Components
import LogoutButton from "../Buttons/LogoutButton";
import ChangeNetworkDropdown from "../Dropdown/ChangeNetworkDropdown";
import LoginButton from "../Buttons/LoginButton";
// Wagmi
import { useAccount, useNetwork } from "wagmi";
// Components
import { networks } from "@/constants/Constants";
// Types
import { NetworkType } from "@/types/Types";

interface ActionsSideBarProps {
  page: ReactElement;
}

export default function ActionsSideBar({ page }: ActionsSideBarProps) {
  const { isConnected } = useAccount();
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [previousNetwork, setPreviousNetwork] = useState<NetworkType>();

  const { chain } = useNetwork();

  useEffect(() => {
    isConnected ? setConnectedWallet(true) : setConnectedWallet(false);
  }, [isConnected]);

  useEffect(() => {
    if (
      chain &&
      (chain.id === 42161 ||
        chain.id === 80001 ||
        chain.id === 1 ||
        chain.id === 137)
    ) {
      const prev = networks.filter((network) => network.name === chain?.name);

      setPreviousNetwork(prev[0]);
    }
  }, [chain]);

  return (
    <div className="lg:pl-[187px] ">
      <div className="flex shrink-0 items-center gap-x-4 z-50 mt-[40px]">
        <div className="flex flex-1 gap-x-1 self-stretch lg:gap-x-3 z-50">
          <div className="relative flex flex-1 justify-end items-center gap-x-4">
            {connectedWallet && previousNetwork ? (
              <div className="flex items-center">
                <ChangeNetworkDropdown
                  isModal={false}
                  networks={networks}
                  previousNetwork={previousNetwork}
                />{" "}
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
