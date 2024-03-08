// React
import React, { ReactNode, createContext, useContext, useState } from "react";
// Types
import { ModalContextType, ProviderProps } from "./types";
// Components
import Modal from "../components/Modals/Modal";

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalContextProvider = ({ children }: ProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [title, setTitle] = useState<string>("");

  const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 800);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        content,
        title,
        setIsModalOpen,
        isClosing,
        setTitle,
        openModal,
        closeModal,
        setContent,
      }}
    >
      {children}
      {isModalOpen && <Modal />}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
