// React
import React, { useState } from "react";
// Next
import Link from "next/link";
// Components
import DepositWitdrawModal from "../Modals/DepositWitdrawModal";

export default function ActionsButton() {
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
    <main>
      <div>
        <button
          className="bg-main text-white rounded-xl px-16 py-3 text-sm opacity-50"
          onClick={() => chooseModal("Deposit")}
          disabled={true}
        >
          Deposit
        </button>
        {openModal && (
          <DepositWitdrawModal
            getOpenModal={getOpenModal}
            modalType={modalType}
          />
        )}
      </div>
    </main>
  );
}
