import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { NetworkType } from "@/types/Types";
import Image from "next/image";
import { useNetwork, useSwitchNetwork } from "wagmi";

type NetworkDropdownProps = {
  title: string;
  networks: NetworkType[];
};

export default function ChangeNetworkDropdown({
  title,
  networks,
}: NetworkDropdownProps) {
  const [chainSelected, setChainSelected] = useState<NetworkType>();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (chain) {
      const chainSelected = networks.filter(
        (network: NetworkType) => network.id === chain.id
      );
      setChainSelected(chainSelected[0]);
    }
  }, [chain]);

  return (
    <Menu as="div" className="relative inline-block text-left mr-8">
      <div>
        <Menu.Button className="inline-flex w-fit items-center justify-center gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-lg">
          {chainSelected && (
            <Image
              width={25}
              height={25}
              alt="Network image"
              src={chainSelected.image}
              aria-hidden="true"
            />
          )}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1 flex flex-col px-5">
            {networks.map((network: NetworkType) => {
              return (
                <Menu.Item key={network.name}>
                  <button
                    onClick={() => switchNetwork?.(network.id)}
                    className="my-1 grid grid-cols-3 justify-end align-end  items-center"
                  >
                    <span className="col-span-2 text-start">
                      {network.name}
                    </span>
                    <Image
                      width={25}
                      height={25}
                      alt="Network image"
                      src={network.image}
                      aria-hidden="true"
                      className="ml-10"
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
