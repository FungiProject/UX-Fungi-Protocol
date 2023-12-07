// React
import React from "react";
// Next
import Image from "next/image";
// Images
import Logo from "../../../public/Logo.svg";

export default function ErrorPage() {
  return (
    <main className="flex flex-col justify-center items-center h-screen text-center">
      <h1 className="hidden sm:block text-2xl font-semibold">
        We are currently desktop-only.<br></br> Tablet coming soon!
      </h1>
      <h1 className="sm:hidden block text-2xl font-semibold">
        We are currently desktop-only.<br></br> Mobile coming soon!
      </h1>
      <Image
        width={200}
        height={200}
        alt="Logo Fungi"
        src={Logo.src}
        aria-hidden="true"
        className="mt-[20px]"
      />
    </main>
  );
}
