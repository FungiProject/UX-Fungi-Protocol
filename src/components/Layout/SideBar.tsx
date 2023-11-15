import { ReactElement, useEffect, useState } from "react";

import ActionsSideBar from "./ActionsSideBar";
import DesktopSideBar from "./DesktopSideBar";
import SwitchNetworkModal from "../Modals/SwitchNetworkModal";

import { useNetwork } from "wagmi";

interface SideBarProps {
  page: ReactElement;
}

export default function SideBar({ page }: SideBarProps) {
  const [needSwitch, setNeedSwitch] = useState<boolean>(false);
  const { chain } = useNetwork();

  const getSwitchModal = (modalState: boolean) => {
    setNeedSwitch(modalState);
  };

  useEffect(() => {
    if (chain && chain.id !== 137 && chain.id !== 80001) {
      setNeedSwitch(true);
    }
  }, []);

  useEffect(() => {
    if (chain && chain.id !== 137 && chain.id !== 80001) {
      setNeedSwitch(true);
    }
  }, [chain]);

  return (
    <>
      <div className="z-50">
        {needSwitch && <SwitchNetworkModal getOpenModal={getSwitchModal} />}
        <DesktopSideBar />
        <ActionsSideBar page={page} />
      </div>
    </>
  );
}
