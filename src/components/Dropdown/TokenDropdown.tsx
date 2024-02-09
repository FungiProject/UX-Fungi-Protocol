// React
import { useState } from "react";
// Heroicons
import { ChevronDownIcon } from "@heroicons/react/20/solid";
// Types
import { tokenType } from "@/types/Types";
// Next
import Image from "next/image";
// Components
import TokensModal from "../Modals/TokensModal";

type TokenDropdownProps = {
  getToken: (token: tokenType) => void;
  tokens: tokenType[];
  token: tokenType | undefined;
  oppositToken: tokenType | undefined;
  type: string;
  className: string;
};

export default function TokenDropdown({
  getToken,
  tokens,
  token,
  oppositToken,
  type,
  className,
}: TokenDropdownProps) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const getOpenModal = (status: boolean) => {
    setOpenModal(status);
  };

  return (
    <div>
      {token ? (
        <button className={className} onClick={() => setOpenModal(true)}>
          <img height={25} width={25} alt={token.coinKey} src={token.logoURI} />{" "}
          <span>{token.symbol}</span>{" "}
          <ChevronDownIcon className=" h-5 w-5 text-black" aria-hidden="true" />
        </button>
      ) : (
        <button
          className="flex justify-between border-1 rounded-full font-semibold px-[8px] py-2.5 items-center w-[120px]"
          onClick={() => setOpenModal(true)}
        >
          <span className="pl-2">{type}</span>
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </button>
      )}
      {openModal && (
        <TokensModal
          tokens={tokens}
          getToken={getToken}
          getOpenModal={getOpenModal}
          oppositToken={oppositToken}
        />
      )}
    </div>
  );
}
