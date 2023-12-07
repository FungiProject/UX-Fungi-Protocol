// React
import React, { Fragment, useEffect, useState } from "react";
// Headlessui
import { Dialog, Transition } from "@headlessui/react";
// Wagmi
import { useSwitchNetwork, useNetwork } from "wagmi";
// Next
import Image from "next/image";
// Types
import { NetworkType } from "@/types/Types";

interface SwitchNetworkModalInterface {
  getOpenModal: (openModal: boolean) => void;
  restOfNetworks: NetworkType[];
  previousNetwork: NetworkType;
}

export default function SwitchNetworkModal({
  getOpenModal,
  restOfNetworks,
  previousNetwork,
}: SwitchNetworkModalInterface) {
  const [open, setOpen] = useState(true);
  const { chain } = useNetwork();
  const { isLoading, switchNetwork, pendingChainId } = useSwitchNetwork();

  const closeModal = (id: number) => {
    switchNetwork?.(id);
  };

  const keepOpen = () => {
    setOpen(true);
    getOpenModal(true);
  };

  useEffect(() => {
    if (
      (chain && chain.id === 80001) ||
      (chain && chain.id === 42161) ||
      (chain && chain.id === 1) ||
      (chain && chain.id === 137)
    ) {
      setOpen(false);
      getOpenModal(false);
    }
  }, [chain]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={keepOpen}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start w-full flex flex-col items-center text-center">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-center font-semibold leading-6 text-gray-900"
                    >
                      Please, change your network to Polygon or Mumbai
                    </Dialog.Title>
                  </div>
                  <button
                    disabled={
                      !switchNetwork || previousNetwork.id === chain?.id
                    }
                    key={previousNetwork.id}
                    onClick={() => closeModal(previousNetwork.id)}
                    className="bg-gray-400 px-[24px] py-[16px] rounded-lg font-medium tracking-wide text-base flex mx-auto mt-4 items-center w-full"
                  >
                    <div className="flex justify-between pl-[25px] pr-[12px] w-full">
                      <div className="flex">
                        <Image
                          width={20}
                          height={20}
                          alt="Previou Network Image"
                          src={previousNetwork.image}
                          aria-hidden="true"
                          className="mr-2"
                        />
                        <span>{previousNetwork.name}</span>
                      </div>
                      {isLoading && pendingChainId === previousNetwork.id ? (
                        <span>Connecting...</span>
                      ) : (
                        <span>Connected</span>
                      )}
                    </div>
                  </button>
                  {restOfNetworks.map((network: NetworkType) => {
                    return (
                      <button
                        disabled={!switchNetwork || network.id === chain?.id}
                        key={network.id}
                        onClick={() => closeModal(network.id)}
                        className="bg-gray-200 px-[24px] py-[16px] rounded-lg font-medium tracking-wide text-base flex mx-auto mt-4 items-center w-full"
                      >
                        <div className="flex justify-between pl-[25px] pr-[12px] w-full">
                          <div className="flex">
                            <Image
                              width={20}
                              height={20}
                              alt="Network Image"
                              src={network.image}
                              aria-hidden="true"
                              className="mr-2"
                            />
                            <span>{network.name}</span>
                          </div>

                          {isLoading && pendingChainId === network.id ? (
                            <span>Switching...</span>
                          ) : (
                            <span>Switch</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
