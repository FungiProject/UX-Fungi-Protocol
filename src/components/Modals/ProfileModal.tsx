// React
import React, { Fragment, useState } from "react";
// Headlessui
import { Dialog, Transition } from "@headlessui/react";

import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import ProfileSelectionButton from "../Buttons/ProfileSelectionButton";
import { useRouter } from "next/router";

import SendIcon from "../../../public/profile/SendIcon.svg";
import SettingsIcon from "../../../public/profile/SettingsIcon.svg";
import WithdrawIcon from "../../../public/profile/WithdrawIcon.svg";
import DepositIcon from "../../../public/profile/DepositIcon.svg";
import LogOutIcon from "../../../public/profile/LogOutIcon.svg";
import TransactionIcon from "../../../public/profile/TransactionIcon.svg";
import useWallet from "@/hooks/useWallet";
import { useNotification } from "@/context/NotificationContextProvider";
import SendModal from "../Modals/SendModal";

interface ProfileModalProps {
  getOpenModal: (openModal: boolean) => void;
}

export default function ProfileModal({ getOpenModal }: ProfileModalProps) {
  const { scAccount, logout } = useWallet();
  const [open, setOpen] = useState(true);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const closeModal = () => {
    setOpen(false);
    getOpenModal(false);
  };

  const logingOut = async () => {
    logout();
    getOpenModal(false);
    router.push("/");
  };

  const openSendModal = async () => {
    setIsSendModalOpen(true);
  };

  const handle = async () => {
    console.log("//TODO Fungi");
  };

  const profileActions = [
    {
      title: "Send",
      image: SendIcon.src,
      status: false,
      onClick: openSendModal,
    },
    {
      title: "Withdraw",
      image: WithdrawIcon.src,
      status: false,
      onClick: handle,
    },
    {
      title: "Transactions",
      image: TransactionIcon.src,
      status: false,
      onClick: handle,
    },
    {
      title: "Deposit",
      image: DepositIcon.src,
      status: false,
      onClick: handle,
    },
    {
      title: "Settings",
      image: SettingsIcon.src,
      status: false,
      onClick: handle,
    },
    {
      title: "Log Out",
      image: LogOutIcon.src,
      status: true,
      onClick: logingOut,
    },
  ];

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10 " onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="relative">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="absolute transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-fit top-0 right-10">
                <div className="bg-white rounded-lg px-4 py-2 shadow-input z-50">
                  <div className="flex flex-col justify-center p-[36px] text-center">
                    <p className="text-xl mb-[18px]">Your Fungi Account</p>
                    <button
                      className="shadow-input py-1 px-0.5 rounded-lg flex w-fit mx-auto items-center"
                      onClick={() => {
                        navigator.clipboard.writeText(scAccount as string);
                        showNotification({
                          message: "Link copied to clipboard.",
                          type: "success",
                        });
                      }}
                    >
                      <UserIcon
                        className="h-[18px] w-[18px]"
                        aria-hidden="true"
                      />
                      <span className="mx-[9px]">
                        {scAccount?.substring(0, 10) + "..."}
                      </span>{" "}
                      <DocumentDuplicateIcon
                        className="h-[18px] w-[18px]"
                        aria-hidden="true"
                      />
                    </button>
                    <div className="grid grid-cols-3 gap-x-[54px] gap-y-[30px] mt-[34px]">
                      {profileActions.map((action) => {
                        return (
                          <ProfileSelectionButton
                            title={action.title}
                            image={action.image}
                            status={action.status}
                            onClick={action.onClick}
                            key={action.title}
                          />
                        );
                      })}
                      {isSendModalOpen && <SendModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} />}
                    </div>{" "}
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
