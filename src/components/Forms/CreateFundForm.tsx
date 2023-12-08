// React
import React, { useState } from "react";
// Images
import DefaultImage from "../../../public/DefaultImage.svg";
import Telegram from "../../../public/Telegram.svg";
import X from "../../../public/X.svg";
// Next
import Image from "next/image";
// Components
import SelectNetworkDropdown from "../Dropdown/SelectNetworkDropdown";
import TypeFundDropdown from "../Dropdown/TypeFundDropdown";
// Types
import { NetworkType } from "@/types/Types";
// Constants
import { networks } from "@/constants/Constants";
import TxButton from "../Buttons/TxButton";

export default function CreateFundForm() {
  const [fundName, setFundName] = useState<string | undefined>();
  const [managementFee, setManagementFee] = useState<number | undefined>();
  const [performanceFee, setPerformanceFee] = useState<number | undefined>();
  const [initialDeposit, setInitialDeposit] = useState<number | undefined>();
  const [aboutFund, setAboutFund] = useState<string | undefined>();
  const [typeSelected, setTypeSelected] = useState<string>("Choose Type");
  const [profileImage, setProfileImage] = useState<any>();
  const [networksSelected, setNetworksSelected] = useState<NetworkType[]>([]);

  const handleFundName = (e: string) => {
    setFundName(e);
  };

  const handleManagementFee = (e: number) => {
    setManagementFee(e);
  };

  const handlePerformanceFee = (e: number) => {
    setPerformanceFee(e);
  };

  const handleInitialDeposit = (e: number) => {
    setInitialDeposit(e);
  };

  const handleAboutFund = (e: string) => {
    setAboutFund(e);
  };

  const handleRemoveNetwork = (networkToRemove: NetworkType) => {
    const updatedNetworksSelected = networksSelected.filter(
      (network) => network.id !== networkToRemove.id
    );
    setNetworksSelected(updatedNetworksSelected);
  };

  const clickUploader = () => {
    const myElement = document.querySelector(".file-uploader");

    if (myElement) {
      const myElementCasted = myElement as HTMLElement;
      myElementCasted.click();
    }
  };

  const getNetwork = (network: NetworkType) => {
    if (!networksSelected.some((selected) => selected.id === network.id)) {
      setNetworksSelected([...networksSelected, network]);
    }
  };

  const getType = (type: string) => {
    setTypeSelected(type);
  };

  return (
    <div className="grid grid-cols-5 pl-[140px] py-[30px] items-center">
      <div onClick={() => clickUploader()} className="hover:cursor-pointer">
        <span className="ml-[50px]">Fund Profile Pic</span>
        {/* Resolve conexion to the backend */}
        <div>
          <input
            value={profileImage}
            type="file"
            id="profilePic"
            name="profilePic"
            className="file-uploader"
            onChange={(e) => {
              if (e.target.files) {
                setProfileImage(URL.createObjectURL(e.target.files[0]));
              }
            }}
            hidden
          />
          {profileImage ? (
            <Image
              width={200}
              height={200}
              alt="DefaultImage"
              src={profileImage.src}
              aria-hidden="true"
            />
          ) : (
            <Image
              width={200}
              height={200}
              alt="DefaultImage"
              src={DefaultImage.src}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
      <div className="text-center col-span-3">
        <div className="grid grid-cols-3 py-[15px] items-center">
          <span className="mx-[12px]">Fund Name</span>
          <input
            value={fundName}
            onChange={(e) => handleFundName(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            type="text"
            name="fundName"
            id="fundName"
            className="shadow-input rounded-lg w-[300px] h-[40px] px-5 outline-none col-span-2"
            placeholder="Fungi Panas"
          />
        </div>
        <div className="grid grid-cols-3 py-[15px] items-center">
          <span className="mx-[12px]">Choose Networks</span>
          <div className="flex w-screen">
            {networksSelected.length !== 3 && (
              <SelectNetworkDropdown
                getNetwork={getNetwork}
                networks={networks}
                classDropdown="shadow-input inline-flex w-[300px] items-center justify-between gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 col-span-2"
              />
            )}
            {networksSelected.map((network: NetworkType) => {
              return (
                <div key={network.id} className="relative">
                  <button
                    onClick={() => handleRemoveNetwork(network)}
                    className="absolute -top-3.5 left-8 p-1 font-semibold cursor-pointer"
                  >
                    X
                  </button>
                  <Image
                    width={35}
                    height={35}
                    alt="Network Image"
                    src={network.image}
                    aria-hidden="true"
                    className="ml-5"
                  />
                </div>
              );
            })}
          </div>
        </div>{" "}
        <div className="grid grid-cols-3 py-[15px] items-center">
          <span className="mx-[12px]">Type of Fund</span>
          <TypeFundDropdown
            getType={getType}
            types={["Private", "Public"]}
            typeSelected={typeSelected}
            classDropdown={
              typeSelected === "Choose Type"
                ? "shadow-input inline-flex w-[300px] items-center justify-between gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 col-span-2"
                : "shadow-input inline-flex w-fit items-center justify-between gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 col-span-2"
            }
          />
        </div>
        <div className="grid grid-cols-3 py-[15px] items-center">
          <span className="mx-[12px]">Management Fee (%)</span>
          <input
            value={managementFee}
            onChange={(e) => handleManagementFee(Number(e.target.value))}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            type="number"
            min={0}
            step={0.1}
            name="managementFee"
            id="managementFee"
            className="shadow-input rounded-lg w-[300px] h-[40px] px-5 outline-none col-span-2"
            placeholder="2 %"
          />
        </div>{" "}
        <div className="grid grid-cols-3 py-[15px] items-center">
          <span className="mx-[12px]">Performance Fee (%)</span>
          <input
            value={performanceFee}
            onChange={(e) => handlePerformanceFee(Number(e.target.value))}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            type="number"
            min={0}
            step={0.1}
            name="performanceFee"
            id="performanceFee"
            className="shadow-input rounded-lg w-[300px] h-[40px] px-5  outline-none col-span-2"
            placeholder="20 %"
          />
        </div>
        <div className="grid grid-cols-3 py-[15px] items-center">
          <span className="mx-[12px]">Initial Deposit</span>
          <input
            value={initialDeposit}
            onChange={(e) => handleInitialDeposit(Number(e.target.value))}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            type="number"
            min={0}
            step={0.1}
            name="initialDeposit"
            id="initialDeposit"
            className="shadow-input rounded-lg w-[300px] h-[40px] px-5  outline-none col-span-2"
            placeholder="$1000 USDC"
          />
        </div>
        <div className="grid grid-cols-3 py-[15px] items-center">
          <span className="mx-[12px]">Socials</span>
          <div className="flex col-span-2">
            <Image
              width={42}
              height={42}
              alt="Network Image"
              src={Telegram.src}
              aria-hidden="true"
              className="mx-2"
            />
            <Image
              width={42}
              height={42}
              alt="Network Image"
              src={X.src}
              aria-hidden="true"
              className="mx-2"
            />
          </div>
        </div>{" "}
        <div className="grid grid-cols-3 py-[15px] items-center">
          <span className="mx-[12px]">About Fund</span>
          <textarea
            value={aboutFund}
            onChange={(e) => handleAboutFund(e.target.value)}
            onFocus={(e) =>
              e.target.addEventListener(
                "wheel",
                function (e) {
                  e.preventDefault();
                },
                { passive: false }
              )
            }
            name="aboutFund"
            id="aboutFund"
            className="shadow-input rounded-lg w-[600px] h-[241px] px-5 py-[16px] outline-none col-span-2"
            placeholder="We make money..."
          />
        </div>{" "}
        <div className="grid grid-cols-3">
          <span></span>
          <TxButton className="bg-main w-[125px] mt-[34px] text-xs rounded-full py-[8px] px-[24px] text-white tracking-wider hover:bg-mainHover col-span-2">
            <span>Create Fund</span>
          </TxButton>
        </div>
      </div>
    </div>
  );
}
