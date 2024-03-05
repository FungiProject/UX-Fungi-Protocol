// React
import React, { ReactNode } from "react";
// Styles
import styles from "./NotificationCard.module.css";

type NotificationProps = {
  message: string | ReactNode;
  color: string;
};

export default function Notification({ message, color }: NotificationProps) {
  return (
    <div
      className={`lg:max-w-[350px] h-fit rounded-xl z-50 my-2 bg-white absolute right-5 top-10`}
      style={{
        border: `1px solid ${color}`,
      }}
    >
      <div className="px-4 pt-4 mb-2">{message}</div>
      <div
        className={`${styles.progress} opacity-80`}
        style={{ backgroundColor: `${color}` }}
      ></div>
    </div>
  );
}
