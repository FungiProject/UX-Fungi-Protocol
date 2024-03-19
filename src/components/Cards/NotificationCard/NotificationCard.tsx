// React
import React, { ReactNode } from "react";
// Styles
import styles from "./NotificationCard.module.css";
// Images
import Success from "../../../../public/Success.svg";
import Error from "../../../../public/Error.svg";
import SpinnerLoader from "@/components/Loader/SpinnerLoader";

type NotificationProps = {
  message: string | ReactNode;
  color: string;
  type: string;
};

export default function Notification({
  message,
  color,
  type,
}: NotificationProps) {
  return (
    <div
      className={`lg:max-w-[350px] h-fit rounded-xl z-50 my-2 bg-white absolute right-5 top-10 shadow-input `}
    >
      <div className="flex  p-4">
        {type !== "loading" ? (
          <img src={type === "success" ? Success.src : Error.src} />
        ) : (
          <SpinnerLoader />
        )}
        <div className="px-5">
          <h1 className="text-xl font-semibold">
            {type === "success"
              ? "Success"
              : type === "loading"
              ? "Loading..."
              : "Error"}
          </h1>
          <div>{message}</div>
        </div>
      </div>

      {type !== "loading" && (
        <div
          className={`${styles.progress} opacity-80`}
          style={{ backgroundColor: `${color}` }}
        ></div>
      )}
    </div>
  );
}
