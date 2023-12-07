// React
import React from "react";
// Next
import Image from "next/image";

type NotificationsCardProps = {
  image: string;
  title: string;
  txDescription: string;
};

export default function NotificationsCard({
  image,
  title,
  txDescription,
}: NotificationsCardProps) {
  return (
    <div className="absolute top-20 right-4 z-10">
      <div className="relative transform overflow-hidden rounded-3xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:m-8 max-w-[300px] sm:p-6 shadow-input">
        <div className="items-end w-full flex flex-row text-center max-w-[300px]">
          <Image
            height={60}
            width={60}
            alt="User Image"
            src={image}
            className="mr-4"
          />
          <div className="mt-3 sm:mt-0 sm:text-left w-[150px] mr-[70px]">
            <h3 className="font-medium leading-6 text-gray-900 text-lg">
              {title}
            </h3>
            <p className="text-xs font-medium">{txDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
