// React
import { Fragment } from "react";
// Headlessui
import { Menu, Transition } from "@headlessui/react";
// Heroicons
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type SortByProps = {
  getSortChange: (sort: string) => void;
  sorts: string[];
  classSquare: string;
  selection: string;
};

export default function SortBy({
  getSortChange,
  sorts,
  classSquare,
  selection,
}: SortByProps) {
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
            {sorts.map((sort: string) => {
              return (
                <Menu.Item key={sort}>
                  <button
                    onClick={() => {
                      getSortChange(sort);
                    }}
                    className="my-1 text-start justify-end align-end  items-center"
                  >
                    <span className="col-span-2 text-start">{sort}</span>
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
