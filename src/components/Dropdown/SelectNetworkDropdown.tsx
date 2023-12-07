// React
import { Fragment } from "react";
// Headlessui
import { Menu, Transition } from "@headlessui/react";
// Heroicons
import { ChevronDownIcon } from "@heroicons/react/20/solid";
// Types
import { NetworkType } from "@/types/Types";
// Next
import Image from "next/image";

type NetworkDropdownProps = {
  getNetwork: (id: NetworkType) => void;
  networks: NetworkType[];
  classDropdown: string;
  selectedNetwork?: NetworkType | null;
};

export default function SelectNetworkDropdown({
  getNetwork,
  networks,
  classDropdown,
  selectedNetwork,
}: NetworkDropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className={classDropdown}>
          {selectedNetwork ? (
            <>
              <Image
                width={25}
                height={25}
                alt="Network image"
                src={selectedNetwork.image}
                aria-hidden="true"
              />{" "}
              <ChevronDownIcon
                className="-mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </>
          ) : (
            <>
              Choose Network
              <ChevronDownIcon
                className="-mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-16 origin-top-right rounded-md bg-white shadow-lg ">
          <div className="py-1 flex flex-col px-5 align-start">
            {networks.map((network: NetworkType) => {
              return (
                <Menu.Item key={network.name}>
                  <button onClick={() => getNetwork(network)} className="my-1">
                    <Image
                      width={25}
                      height={25}
                      alt="Network image"
                      src={network.image}
                      aria-hidden="true"
                    />
                  </button>
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
