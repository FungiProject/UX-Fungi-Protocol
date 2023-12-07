// React
import React, { useState } from "react";
// Next
import Image from "next/image";
import { useRouter } from "next/router";
// Wagmi
import { useDisconnect, useAccount } from "wagmi";
// Images
import Chain from "../../../public/Chain.svg";

export default function LogoutButton() {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const router = useRouter();

  const logingOut = async () => {
    disconnect();
    router.push("/");
  };

  return (
    <button
      onClick={() => logingOut()}
      className="bg-white py-[9px] rounded-full text-black flex w-[160px] items-center justify-center shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered ? (
        <>{address ? address.substring(0, 10) + "..." : <></>}</>
      ) : (
        <>
          <span>Disconnect</span>{" "}
          <Image
            width={25}
            height={25}
            alt="Logo"
            src={Chain.src}
            className="ml-2"
          />
        </>
      )}
    </button>
  );
}
