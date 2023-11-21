import React from "react";
import Image from "next/image";

import Logo from "../../../public/Logo.svg";

export default function Loader() {
  return (
    <Image
      width={120}
      height={120}
      alt="Logo Loader"
      src={Logo.src}
      aria-hidden="true"
      className="loader-scale"
    />
  );
}
