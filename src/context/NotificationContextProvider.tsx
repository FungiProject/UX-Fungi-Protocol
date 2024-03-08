// React
import React, { ReactNode, createContext, useContext, useState } from "react";
// Components
import Notification from "../components/Cards/NotificationCard/NotificationCard";
// Config
import {
  NOTIFICATION_ERROR_COLOR,
  NOTIFICATION_INFO_COLOR,
  NOTIFICATION_SUCCESS_COLOR,
  NOTIFICATION_WARNING_COLOR,
} from "@/config/uiConfig";
// Types
import {
  NotificationType,
  NotificationContextType,
  ProviderProps,
} from "./types";

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export function NotificationContextProvider({ children }: ProviderProps) {
  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const showNotification = (notification: NotificationType) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setNotification(notification);

    timeoutId = setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          color={getColorForType(notification.type)}
          type={notification.type}
        />
      )}
    </NotificationContext.Provider>
  );
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function getColorForType(type: NotificationType["type"]): string {
  switch (type) {
    case "success":
      return NOTIFICATION_SUCCESS_COLOR;
    case "error":
      return NOTIFICATION_ERROR_COLOR;
    case "warning":
      return NOTIFICATION_WARNING_COLOR;
    case "info":
      return NOTIFICATION_INFO_COLOR;
    default:
      return NOTIFICATION_INFO_COLOR;
  }
}
