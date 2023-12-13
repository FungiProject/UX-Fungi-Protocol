// React
import React, { Fragment, useEffect, useState } from "react";
// Headlessui
import { Dialog, Transition } from "@headlessui/react";
// Components
import SearchBar from "../Filters/SearchBar";
// Types
import { assetType } from "@/types/Types";
// Heroicons
import { XMarkIcon } from "@heroicons/react/24/outline";
import TokenCard from "../Cards/TokenCard";

interface TokensModalProps {
  getOpenModal: (openModal: boolean) => void;
  getToken: (asset: assetType) => void;
  assets: assetType[];
  oppositToken: assetType | null;
}

export default function TokensModal({
  getOpenModal,
  assets,
  getToken,
  oppositToken,
}: TokensModalProps) {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [assetsArrayCopy, setAssetsArrayCopy] = useState<assetType[]>([
    ...assets,
  ]);

  const closeModal = () => {
    setOpen(false);
    getOpenModal(false);
  };

  const getInfo = (query: string) => {
    setSearch(query);
  };

  const selectToken = (token: assetType) => {
    getToken(token);
    closeModal();
  };

  useEffect(() => {
    let copy = [...assets];

    if (search.length !== 0) {
      copy = copy.filter(
        (asset: assetType) =>
          asset.name.toLowerCase().includes(search.toLowerCase()) ||
          asset.address.toLowerCase() === search.toLowerCase()
      );
    }

    setAssetsArrayCopy(copy);
  }, [search]);

  useEffect(() => {
    if (oppositToken) {
      setAssetsArrayCopy((prevTokens: assetType[]) =>
        prevTokens.filter((token) => token.name !== oppositToken.name)
      );
    }
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 " onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 min-w-[727px] min-h-[708px]  bg-white  shadow-input">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white hover:text-gray-700 text-black focus:outline-none"
                    onClick={() => closeModal()}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon
                      className="h-[25px] w-[25px]"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="sm:flex flex-col sm:items-start  mt-[50px]">
                  <div className="w-full border-b-1 px-[64px]">
                    <div className=" text-start sm:mt-0 sm:text-left w-full">
                      <Dialog.Title as="h3" className="text-3xl">
                        Select Token
                      </Dialog.Title>
                    </div>
                    <SearchBar
                      getInfo={getInfo}
                      query={search}
                      classMain="rounded-xl text-black px-[22px] items-center w-full  outline-none placeholder:text-black bg-white flex shadow-searchBar my-[16px] "
                      placeholder="Search token or paste address"
                    />
                  </div>

                  <div className="px-[18px] w-full my-4 overflow-y-auto h-[520px]">
                    {assetsArrayCopy.map((asset: assetType) => {
                      return (
                        <TokenCard
                          asset={asset}
                          getToken={selectToken}
                          key={asset.address}
                        />
                      );
                    })}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
