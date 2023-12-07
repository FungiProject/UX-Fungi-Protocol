// React
import React from "react";
// Next
import Image from "next/image";
// Heroicons
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
// Types
import { integrationType } from "@/types/Types";

function IntegrationCard({
  protocolImage,
  title,
  description,
  networks,
  status,
}: integrationType) {
  return (
    <div className="mx-auto flex flex-col justify-between text-center items-center shadow-xl w-full max-h-[270px] rounded-lg px-[26px] py-[18px] bg-white mb-[46px]">
      <Image width={50} height={50} alt="Logo" src={protocolImage} />
      <h1 className="my-[13px] text-3xl font-medium">{title}</h1>
      <div className="max-w-[266px] text-sm">
        {description}
        {status ? <></> : <span className="font-semibold"> Coming Soon</span>}
      </div>
      <div className="grid grid-cols-3 items-center w-full justify-between ">
        <div></div>
        <div className="flex justify-center">
          {networks.map((network: string, index: number) => {
            return (
              <Image
                style={{ zIndex: `${index * 10}` }}
                width={35}
                height={35}
                alt="Logo"
                src={network}
                className={index === 1 ? "-mx-2.5" : ""}
                key={network}
              />
            );
          })}
        </div>
        <div className="flex justify-end">
          <ArrowLongRightIcon
            className="h-[50px] w-[50px] "
            aria-hidden="true"
          />
        </div>
      </div>{" "}
    </div>
  );
}

export default IntegrationCard;
