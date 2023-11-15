import React, { useState } from "react";
import DefaultImage from "../../../public/DefaultImage.svg";
import Image from "next/image";

export default function CreateFundForm() {
  const [fundName, setFundName] = useState<string | undefined>();
  const [managementFee, setManagementFee] = useState<number | undefined>();
  const [performanceFee, setPerformanceFee] = useState<number | undefined>();
  const [initialDeposit, setInitialDeposit] = useState<number | undefined>();
  const [aboutFund, setAboutFund] = useState<string | undefined>();
  const [profileImage, setProfileImage] = useState<any>();

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

  const clickUploader = () => {
    const myElement = document.querySelector(".file-uploader");

    if (myElement) {
      // Realizar el casting a HTMLElement
      const myElementCasted = myElement as HTMLElement;

      // Ahora, puedes usar la propiedad 'click'
      myElementCasted.click();
    }
  };

  return (
    <div className="grid grid-cols-2 px-[170px] py-[60px] items-center">
      <div onClick={() => clickUploader()} className="hover:cursor-pointer">
        <span className="">Fund Profile Pic</span>
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
      <div className="text-center">
        <div className="grid grid-cols-2 py-[15px] items-center">
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
            className="shadow-input rounded-lg w-[300px] h-[40px] px-5 outline-none"
            placeholder="Fungi Panas"
          />
        </div>
        {/* Change to selector */}
        <div className="grid grid-cols-2 py-[15px] items-center">
          <span className="mx-[12px]">Choose Networks</span>
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
            className="shadow-input rounded-lg w-[300px] h-[40px] px-5 outline-none"
            placeholder="Fungi Panas"
          />
        </div>{" "}
        {/* Change to selector */}
        <div className="grid grid-cols-2 py-[15px] items-center">
          <span className="mx-[12px]">Type of Fund</span>
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
            className="shadow-input rounded-lg w-[300px] h-[40px] px-5 outline-none"
            placeholder="Fungi Panas"
          />
        </div>
        <div className="grid grid-cols-2 py-[15px] items-center">
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
            className="shadow-input rounded-lg w-[300px] h-[40px] px-5 outline-none"
            placeholder="2 %"
          />
        </div>{" "}
        <div className="grid grid-cols-2 py-[15px] items-center">
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
            className="shadow-input rounded-lg w-[300px] h-[40px] px-5  outline-none"
            placeholder="20 %"
          />
        </div>
        <div className="grid grid-cols-2 py-[15px] items-center">
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
            className="shadow-input rounded-lg w-[300px] h-[40px] px-5  outline-none"
            placeholder="$1000 USDC"
          />
        </div>
        <div className="grid grid-cols-2 py-[15px] items-center">
          <span className="mx-[12px]">Socials</span>
          <div className="flex">
            <div>Telegram</div>
            <div>Twitter</div>
          </div>
        </div>{" "}
        <div className="grid grid-cols-2 py-[15px] items-center">
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
            className="shadow-input rounded-lg w-[300px]  px-5 py-[16px] outline-none"
            placeholder="We make money..."
          />
        </div>
      </div>
    </div>
  );
}
