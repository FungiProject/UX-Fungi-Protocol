// React
import React, { Fragment, useState } from "react";
// Headlessui
import { Dialog, Transition } from "@headlessui/react";
// Heroicons
import { XMarkIcon } from "@heroicons/react/24/outline";
// Components
import MemberCard from "../Cards/MemberCard";
// Types
import { memberType } from "@/types/Types";
// Images
import DefaultImage from "../../../public/DefaultImage.svg";

interface MembersModalInterface {
  getOpenModal: (openmodal: boolean) => void;
  members: memberType[];
}

export default function MembersModal({
  getOpenModal,
  members,
}: MembersModalInterface) {
  const [open, setOpen] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [addressList, setAddressList] = useState<memberType[]>(members);

  const closeModal = () => {
    setOpen(false);
    getOpenModal(false);
  };

  const handleInputChange = (e: string) => {
    if (inputValue.slice(0, 2) !== "0x") {
      setErrorMessage("Invalid Address");
      setError(true);
    } else {
      setError(false);
    }
    setInputValue(e);
  };

  const handleRemoveMember = (addressMember: string) => {
    const updatedAddressList = addressList.filter(
      (member) => member.address !== addressMember
    );
    setAddressList(updatedAddressList);
  };

  const handleAddAddress = () => {
    if (inputValue.trim() !== "") {
      const isAddressExists = addressList.some(
        (address) => address.address === inputValue
      );

      if (!isAddressExists) {
        const newAddress: memberType = {
          image: DefaultImage.src,
          address: inputValue,
        };

        setAddressList([...addressList, newAddress]);
        setInputValue("");
      } else {
        setError(true);
        setErrorMessage("Address already in the list. Please enter other.");
        setInputValue("");
      }
    }
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-[862px] sm:p-6">
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
                <div className="sm:flex sm:items-start w-full px-[58px] pb-[68px] pt-[170px] flex flex-col">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full flex items-center flex-col">
                    <h1 className="mb-[12px]">Wallet</h1>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className={`shadow-input w-[450px] h-[40px] rounded-xl px-[10px] outline-none ${
                        error ? "border-1 border-red-500" : ""
                      }`}
                    />
                    {error && (
                      <span className="flex justify-start w-full px-[125px] text-red-500 text-xs mt-[10px]">
                        {errorMessage}
                      </span>
                    )}
                    <div className="mt-[10px]">
                      <button
                        onClick={handleAddAddress}
                        className="rounded-full bg-main px-[35px] py-[8px] text-center text-white mr-[40px] text-xs h-[30px]"
                      >
                        Add Address
                      </button>
                      <button
                        onClick={handleAddAddress}
                        className="rounded-full bg-main px-[35px] py-[8px] text-center text-white text-xs h-[30px]"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-y-[24px] gap-x-[16px] py-[20px] h-[200px] overflow-y-auto px-[20px] mt-[40px]">
                    {addressList.map((member: memberType) => {
                      return (
                        <div key={member.address} className="relative">
                          <button
                            onClick={() => handleRemoveMember(member.address)}
                            className="absolute -top-[10px] left-[105px] font-semibold cursor-pointer"
                          >
                            X
                          </button>
                          <MemberCard address={member.address} />
                        </div>
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
