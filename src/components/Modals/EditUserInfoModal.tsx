// React
import React, { Fragment, useState } from "react";
// Headlessui
import { Dialog, Transition } from "@headlessui/react";
// Heroicons
import { XMarkIcon } from "@heroicons/react/24/outline";
// Components
import EditUserForm from "../Forms/EditUserForm";

interface TokensModalInterface {
  getOpenModal: (openmodal: boolean) => void;
  address: `0x${string}` | undefined;
}

export default function EditUserInfoModal({
  getOpenModal,
  address,
}: TokensModalInterface) {
  const [open, setOpen] = useState(true);

  const closeModal = () => {
    setOpen(false);
    getOpenModal(false);
  };

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[900px] sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-700 hover:text-black focus:outline-none "
                    onClick={() => closeModal()}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start w-full ">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <EditUserForm address={address} />
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
