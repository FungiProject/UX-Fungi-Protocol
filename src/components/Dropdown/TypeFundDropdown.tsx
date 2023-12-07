// React
import { Fragment } from "react";
// Headlessui
import { Menu, Transition } from "@headlessui/react";
// Heroicons
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type TypeFundDropdownProps = {
  getType: (type: string) => void;
  types: string[];
  classDropdown: string;
  typeSelected: string;
};

export default function TypeFundDropdown({
  getType,
  types,
  classDropdown,
  typeSelected,
}: TypeFundDropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left mr-8 ">
      <div>
        <Menu.Button className={classDropdown}>
          {typeSelected}
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
        <Menu.Items
          className={`absolute ${
            typeSelected === "Choose Type" ? "-right-36" : "right-16"
          } z-10 mt-2 w-20 origin-top-right rounded-md bg-white shadow-lg`}
        >
          <div className="py-1 flex flex-col px-5 align-start">
            {types.map((type: string) => {
              return (
                <Menu.Item key={type}>
                  <button
                    onClick={() => getType(type)}
                    className="my-1"
                    key={type}
                  >
                    {type}
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
