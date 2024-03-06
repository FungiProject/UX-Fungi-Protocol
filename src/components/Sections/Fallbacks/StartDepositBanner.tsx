import React from "react";
import ActionsButton from "../../Buttons/ActionsButton";
// Next
import Image from "next/image";
// Images
import Logo from "../../../../public/profile/Logo.svg";

export default function StartDepositBanner() {
  return (
    <div className="flex flex-col justify-center items-center h-full text-center">
      <h1 className="hidden sm:block text-4xl">Start deposit tokens</h1>
      <Image
        width={200}
        height={200}
        alt="Logo Fungi"
        src={Logo.src}
        aria-hidden="true"
        className="my-[20px]"
      />
      <ActionsButton />
    </div>
  );
}
