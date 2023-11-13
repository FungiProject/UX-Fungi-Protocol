import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { navigationType } from "@/types/Types";
import { navigation } from "@/constants/Constants";
import Logo from "../../../public/Logo.svg";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DesktopSideBar() {
  const router = useRouter();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:flex-col h-[700px] w-[160px] my-[25px]">
      <div className="flex justify-center bg-secondBlack h-full w-full rounded-2xl py-[24px]">
        <div className="flex flex-col justify-between items-center">
          <Link href="/" className="text-red-500">
            <Image
              width={62}
              height={68}
              alt="Logo"
              src={Logo.src}
              aria-hidden="true"
            />
          </Link>
          {navigation.map((item: navigationType) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={classNames(
                  item.name.toLowerCase() ===
                    router.route.slice(1, router.route.length) ||
                    router.route === item.name.toLowerCase()
                    ? "text-white"
                    : "text-gray-300",
                  "group flex flex-col items-center gap-x-3 rounded-md text-sm font-medium hover:text-white"
                )}
              >
                <Image
                  width={45}
                  height={45}
                  alt="Navigation Image"
                  src={item.image}
                  className={classNames(
                    router.route === "/" && item.name.toLowerCase() === "home"
                      ? "text-white"
                      : "text-gray-600 group-hover:text-white",
                    `shrink-0`
                  )}
                  aria-hidden="true"
                />
                <span className="mt-2">{item.name}</span>
              </Link>
            </div>
          ))}
          <button className="text-white bg-main px-[18px] py-[12px] rounded-xl text-sm font-medium">
            Create Fund
          </button>
        </div>
      </div>
    </div>
  );
}
