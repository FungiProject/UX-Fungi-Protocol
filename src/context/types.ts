// React
import { ReactNode } from "react";
// Alchemy
import { Alchemy } from "alchemy-sdk";
import { type Address } from "@alchemy/aa-core";

// Modal types

export type ModalContextType = {
  isModalOpen: boolean;
  content: ReactNode | null;
  title: string;
  isClosing: boolean;
  setTitle: (title: string) => void;
  setIsModalOpen: (open: boolean) => void;
  openModal: () => void;
  closeModal: () => void;
  setContent: (content: ReactNode) => void;
};

export type ModalType = {
  content: ReactNode;
  title: string;
};

// Notification types

export type NotificationType = {
  message: string | ReactNode;
  type: "success" | "error" | "warning" | "info";
};

export type NotificationContextType = {
  showNotification: (notification: NotificationType) => void;
};

// Fungi Context

export type FungiContextType = {
  alchemyClient?: Alchemy;
  alchemyScaProvider: any | undefined;
  scaAddress?: Address;
  chain: number;
  switchNetwork: (number) => void;
  isConnected: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

// General types

export type ProviderProps = {
  children: ReactNode;
};
