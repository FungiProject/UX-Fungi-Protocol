import React, { useState, useEffect } from "react";
import DefaultImage from "../../../public/DefaultImage.svg";
import Image from "next/image";
import { PencilSquareIcon } from "@heroicons/react/20/solid";
import EditUserInfoModal from "../Modals/EditUserInfoModal";
import EditFundInfoModal from "../Modals/EditFundInfoModal";

import Telegram from "../../../public/Telegram.svg";
import X from "../../../public/X.svg";
import formatTimestampToDate from "@/utils/formatTimestampToDate";

type UserInfoProps = { address: `0x${string}` | undefined; isUser: boolean };

export default function UserInfo({ address, isUser }: UserInfoProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formatAddress, setFormatAddress] = useState<string | null>(null);
  const getOpenModal = (status: boolean) => {
    setOpenModal(status);
  };
  const date = 1700559927000;

  useEffect(() => {
    if (address) {
      setFormatAddress(address.substring(0, 10) + "...");
    }
  }, [address]);

  return (
    <main className="flex items-center">
      <Image
        height={125}
        width={118}
        alt="User Image"
        src={DefaultImage.src}
        className="mr-4"
      />
      <div className="flex flex-col">
        <div className="flex items-center">
          {" "}
          <span> {formatAddress ? <span>{formatAddress}</span> : <></>}</span>
          <button onClick={() => setOpenModal(true)}>
            <PencilSquareIcon
              className="ml-2 h-[20px] w-[20px] text-black"
              aria-hidden="true"
            />
          </button>
        </div>
        <span>Joined {formatTimestampToDate(date)}</span>{" "}
        {!isUser && (
          <div className="flex">
            <Image
              height={25}
              width={25}
              alt="User Image"
              src={DefaultImage.src}
              className="mr-[8px]"
            />{" "}
            <Image
              height={25}
              width={25}
              alt="User Image"
              src={DefaultImage.src}
              className="mr-[8px]"
            />
            <Image
              height={20}
              width={20}
              alt="User Image"
              src={X.src}
              className="mr-[8px]"
            />
            <Image
              height={20}
              width={20}
              alt="User Image"
              src={Telegram.src}
              className="mr-[8px]"
            />
          </div>
        )}
      </div>{" "}
      {openModal &&
        (isUser ? (
          <EditUserInfoModal getOpenModal={getOpenModal} address={address} />
        ) : (
          <EditFundInfoModal getOpenModal={getOpenModal} address={address} />
        ))}
    </main>
  );
}
