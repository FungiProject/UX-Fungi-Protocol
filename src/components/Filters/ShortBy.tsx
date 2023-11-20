import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { NetworkType } from "@/types/Types";
import Image from "next/image";
import { useNetwork, useSwitchNetwork } from "wagmi";

type NetworkDropdownProps = {
  getSortChange: (short: string) => void;
  shorts: string[];
  classSquare: string;
};

export default function ChangeNetworkDropdown({
  getSortChange,
  shorts,
  classSquare,
}: NetworkDropdownProps) {
  const [selection, setSelection] = useState<string>("Short By");

  return (
    <Menu as="div" className="relative inline-block text-left ">
      <div>
        <Menu.Button className="inline-flex items-center justify-between gap-x-1.5 rounded-full text-black px-[22px] py-[9px] w-[270px] shadow-lg outline-none bg-white">
          {selection}
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
        <Menu.Items className={classSquare}>
          <div className="py-1 flex flex-col px-5">
            {shorts.map((short: string) => {
              return (
                <Menu.Item key={short}>
                  <button
                    onClick={() => {
                      getSortChange(short);
                      setSelection(short);
                    }}
                    className="my-1 text-start justify-end align-end  items-center"
                  >
                    <span className="col-span-2 text-start">{short}</span>
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
