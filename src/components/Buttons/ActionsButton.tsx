// React
import React, { useState } from "react";
// Next
import Link from "next/link";
// Components
import DepositWitdrawModal from "../Modals/DepositWitdrawModal";

type ActionsButtonProps = {
  fund: string;
  isOwner: boolean;
};

export default function ActionsButton({ fund, isOwner }: ActionsButtonProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");

  const getOpenModal = (status: boolean) => {
    setOpenModal(status);
  };

  const chooseModal = (modal: string) => {
    setModalType(modal);
    setOpenModal(true);
  };

  return (
    <main className="mr-[35px]">
      {isOwner ? (
        <Link href={`/actions/${fund}`}>
          <button className="bg-main text-white rounded-lg px-16 py-3.5 text-sm hover:bg-mainHover">
            Actions
          </button>
        </Link>
      ) : (
        <div className="flex gap-x-[22px]">
          <button
            className="bg-main text-white rounded-lg px-16 py-3.5 text-sm hover:bg-mainHover"
            onClick={() => chooseModal("Deposit")}
          >
            Deposit
          </button>
          <button
            className="bg-main text-white rounded-lg px-16 py-3.5 text-sm hover:bg-mainHover"
            onClick={() => chooseModal("Withdraw")}
          >
            Withdraw
          </button>
          {openModal && (
            <DepositWitdrawModal
              getOpenModal={getOpenModal}
              modalType={modalType}
            />
          )}
        </div>
      )}
    </main>
  );
}
