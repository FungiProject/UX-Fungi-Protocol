//React
import React, { ReactElement } from "react";
// Next
import Image from "next/image";
// Utils
import useWallet from "@/utils/gmx/lib/wallets/useWallet";
// Images
import Logo from "../../../public/profile/Logo.svg";

type PageContainerProps = {
  main: ReactElement;
  secondary: ReactElement;
  page: string;
  keepWorkingMessage?: string;
};

export default function PageContainer({
  main,
  secondary,
  page,
  keepWorkingMessage,
}: PageContainerProps) {
  const { scAccount } = useWallet();

  return (
    <>
      {" "}
      {scAccount === undefined || keepWorkingMessage ? (
        <main className="grid grid-cols-3 mt-[20px] w-full h-[740px] bg-white rounded-lg overflow-hidden">
          <div className="col-span-3 flex items-center justify-center flex-col">
            <h1 className="text-4xl">
              {keepWorkingMessage
                ? `${keepWorkingMessage}`
                : `Log in or sign up to access the ${page}!`}
            </h1>
            <Image
              width={210}
              height={218}
              alt="Logo"
              src={Logo.src}
              aria-hidden="true"
            />
          </div>
        </main>
      ) : (
        <main className="grid grid-cols-3 mt-[20px] w-full h-[77vh] bg-white rounded-lg overflow-hidden">
          <div className="col-span-2">{main}</div>
          <div className="border-l-1">{secondary}</div>
        </main>
      )}
    </>
  );
}
