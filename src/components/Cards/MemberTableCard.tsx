// React
import React, { useEffect, useState } from "react";
// Next
import Image from "next/image";
// Types
import { memberType } from "@/types/Types";
// Utils
import getEns from "@/utils/getEns";

type MemberTableCardProps = {
  member: memberType;
  typeMember: string;
  isOwner: boolean;
};

export default function MemberTableCard({
  member,
  typeMember,
  isOwner,
}: MemberTableCardProps) {
  const [ensName, setEnsName] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEns();
  }, []);

  const fetchEns = async () => {
    let ens;
    try {
      ens = await getEns(member.address);
    } catch {
      ens = undefined;
    }

    setEnsName(ens);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center py-[30px] px-[48px] border-b-1">
      {!isLoading ? (
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center">
            <Image
              width={35}
              height={35}
              alt="Member Image"
              src={member.image}
              className="rounded-full mr-[30px]"
            />
            <span>{ensName !== undefined ? ensName : member.address}</span>{" "}
          </div>

          {isOwner && typeMember === "Whitelisted" && (
            <button className="rounded-full bg-main px-[20px] py-[5px] text-center text-white mr-[15px] hover:bg-mainHover">
              Remove
            </button>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
