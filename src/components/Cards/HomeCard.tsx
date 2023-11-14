import { homeDataType } from "@/types/Types";
import Image from "next/image";
import React from "react";

export default function HomeCard({
  title,
  imageHeight,
  imageWidth,
  imageSrc,
  amount,
}: homeDataType) {
  return (
    <div className="flex flex-row justify-between w-[270px] rounded-lg bg-white items-center px-[20px] py-[23px] shadow-lg">
      <div className="font-medium ">
        <h1 className="text-4xl">{title}</h1>{" "}
        <h2 className="text-2xl">{amount}</h2>
      </div>
      <Image
        height={imageHeight}
        width={imageWidth}
        alt={`${title} image`}
        src={imageSrc}
      />
    </div>
  );
}
