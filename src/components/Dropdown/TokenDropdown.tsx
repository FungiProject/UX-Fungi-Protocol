// React
import { useState } from "react";
// Heroicons
import { ChevronDownIcon } from "@heroicons/react/20/solid";
// Types
import { assetType } from "@/types/Types";
// Next
import Image from "next/image";
// Components
import TokensModal from "../Modals/TokensModal";

type TokenDropdownProps = {
  getToken: (token: assetType) => void;
  assets: assetType[];
  token: assetType | null;
  oppositToken: assetType | null;
  type: string;
};

export default function TokenDropdown({
  getToken,
  assets,
  token,
  oppositToken,
  type,
}: TokenDropdownProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const getOpenModal = (status: boolean) => {
    setOpenModal(status);
  };

  return (
    <div>
      {token ? (
        <button
          className="flex justify-between w-full shadow-input rounded-full font-semibold px-[12px] py-2.5 items-center"
          onClick={() => setOpenModal(true)}
        >
          <span>{token.symbol}</span>
          <Image
            height={25}
            width={25}
            alt="USDC"
            src={token.image}
            className="ml-5"
          />
        </button>
      ) : (
        <button
          className="flex justify-between shadow-input rounded-full font-semibold px-[8px] py-2.5 items-center w-[175px]"
          onClick={() => setOpenModal(true)}
        >
          {type}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      )}
      {openModal && (
        <TokensModal
          assets={assets}
          getToken={getToken}
          getOpenModal={getOpenModal}
          oppositToken={oppositToken}
        />
      )}
    </div>
  );
}
