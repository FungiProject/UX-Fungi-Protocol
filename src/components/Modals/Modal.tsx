// React
import React, { Fragment } from "react";
// Styles
import styles from "./Modal.module.css";
// Headlessui
import { Dialog, Transition } from "@headlessui/react";
// Heroicons
import { XMarkIcon } from "@heroicons/react/24/outline";
// Components
import { useModal } from "../../context/ModalContextProvider";

export default function Modal() {
  const { closeModal, isModalOpen, content, title, isClosing } = useModal();

  return (
    <Transition.Root show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <div
          className={`${styles.overlayBottomModal} ${
            isModalOpen ? `${styles.open}` : ""
          }`}
          onClick={() => closeModal()}
        >
          <Dialog.Panel
            className={`${styles.modalBottomModal} ${
              isClosing ? `${styles.closing}` : ""
            } rounded-lg bg-secondary px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 w-[30vw] sm:p-6 overflow-auto`}
          >
            <h1>{title}</h1>
            <div className="absolute right-0 top-6 pr-4 block">
              <button
                type="button"
                className="rounded-md bg-secondarytext-white"
                onClick={() => closeModal()}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            {content}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
