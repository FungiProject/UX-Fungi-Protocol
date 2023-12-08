// React
import React, { useState } from "react";
// Components
import DefaultImage from "../../../public/DefaultImage.svg";
// Next
import Image from "next/image";
import TxButton from "../Buttons/TxButton";

type EditUserFormProps = {
  address: `0x${string}` | undefined;
};

export default function EditUserForm({ address }: EditUserFormProps) {
  const [userName, setUserName] = useState<string | undefined>();
  const [profileImage, setProfileImage] = useState<any>();

  const handleFundName = (e: string) => {
    setUserName(e);
  };

  const clickUploader = () => {
    const myElement = document.querySelector(".file-uploader");

    if (myElement) {
      const myElementCasted = myElement as HTMLElement;
      myElementCasted.click();
    }
  };

  return (
    <div className="grid grid-cols-3 px-[80px] py-[60px] items-center w-full">
      <div
        onClick={() => clickUploader()}
        className="hover:cursor-pointer max-w-[300px] text-center"
      >
        <span className="mr-[24px]">Fund Profile Pic</span>
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
      <div className="text-center max-w-[400px]">
        <div className="grid grid-cols-2 py-[15px] items-center">
          <span className="mx-[12px]">User Name</span>
          <input
            value={userName}
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
            name="userName"
            id="userName"
            className="shadow-input rounded-lg w-[400px] h-[40px] px-5 outline-none text-sm"
            placeholder={address}
          />
        </div>
      </div>{" "}
      <div className="flex justify-center w-full col-span-3">
        {" "}
        <TxButton className="bg-main w-[125px] mt-[34px] text-xs rounded-full py-[8px] px-[16px] text-white tracking-wider hover:bg-mainHover ">
          <span>Save Changes</span>
        </TxButton>
      </div>
    </div>
  );
}
