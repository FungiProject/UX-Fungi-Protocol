// React
import { Fragment, useState } from "react";
// Headlessui
import { Menu, Transition } from "@headlessui/react";
// Heroicons
import { ChevronDownIcon } from "@heroicons/react/20/solid";
// Types
import { NetworkType } from "@/types/Types";
// Next
import Image from "next/image";
import NetworkModal from "../Modals/NetworkModal";

type NetworkDropdownProps = {
  getNetwork: (symbol: NetworkType) => void;
  networks: NetworkType[];
  network: NetworkType | undefined;
  className: string;
  selectedNetwork?: NetworkType | null;
  type: string;
};

export default function SelectNetworkDropdown({
  getNetwork,
  networks,
  network,
  className,
  type,
  selectedNetwork,
}: NetworkDropdownProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const getOpenModal = (status: boolean) => {
    setOpenModal(status);
  };

  return (
    <div className="flex justify-end">
      {network ? (
        <button
          className={"w-fit flex justify-end items-center"}
          onClick={() => setOpenModal(true)}
        >
          <img
            height={25}
            width={25}
            alt={network.symbol}
            src={network.image}
          />{" "}
          <ChevronDownIcon className=" h-5 w-5 text-black" aria-hidden="true" />
        </button>
      ) : (
        <button
          className="flex justify-between border-1 rounded-full font-semibold px-[8px] py-2.5 items-center w-[120px]"
          onClick={() => setOpenModal(true)}
        >
          <span className="pl-2">{type}</span>
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      )}
      {openModal && (
        <NetworkModal
          networks={networks}
          getNetwork={getNetwork}
          getOpenModal={getOpenModal}
        />
      )}
    </div>
  );
}
