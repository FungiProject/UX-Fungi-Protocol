import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useSwitchNetwork, useNetwork } from "wagmi";
import DangerIcon from "../../../public/DangerIcon.svg";
import Image from "next/image";

import Spinner from "../Loader/Spinner";

interface SwitchNetworkModalInterface {
  getOpenModal: (openModal: boolean) => void;
}

export default function SwitchNetworkModal({
  getOpenModal,
}: SwitchNetworkModalInterface) {
  const [open, setOpen] = useState(true);
  const { chain } = useNetwork();
  const { isLoading, switchNetwork, pendingChainId } = useSwitchNetwork();

  const closeModal = () => {
    switchNetwork?.(80001);
  };

  const keepOpen = () => {
    setOpen(true);
    getOpenModal(true);
  };

  useEffect(() => {
    if (
      (chain && chain.id === 80001) ||
      (chain && chain.id === 42161) ||
      (chain && chain.id === 1)
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

        <div className="fixed top-20 right-4 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-3xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:m-8 max-w-[300px] sm:p-6 shadow-input">
                <div className="items-end w-full flex flex-row text-center max-w-[300px]">
                  <Image
                    height={60}
                    width={60}
                    alt="User Image"
                    src={DangerIcon.src}
                    className="mr-4"
                  />
                  <div className="mt-3 sm:mt-0 sm:text-left w-[150px] mr-[70px]">
                    <Dialog.Title
                      as="h3"
                      className="font-medium leading-6 text-gray-900 text-lg"
                    >
                      Wrong Network
                    </Dialog.Title>
                    <p className="text-xs font-medium">
                      Your wallet is not on the correct network!
                    </p>
                    {/* Change to network selector */}
                    <button
                      disabled={!switchNetwork || 80001 === chain?.id}
                      key={80001}
                      onClick={() => closeModal()}
                      // className="bg-main px-[24px] py-[10px] rounded-lg font-medium text-white tracking-wide text-base flex mx-auto mt-4 items-center"
                    >
                      {isLoading && pendingChainId === 80001 && <Spinner />}
                      {isLoading && pendingChainId === 80001
                        ? "Switching Network"
                        : "Switch Network"}
                    </button>
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
