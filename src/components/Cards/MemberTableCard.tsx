import { memberType } from "@/types/Types";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import getEns from "@/utils/getEns";

type MemberTableCardProps = {
  member: memberType;
};

export default function MemberTableCard({ member }: MemberTableCardProps) {
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
        <>
          <Image
            width={35}
            height={35}
            alt="Member Image"
            src={member.image}
            className="rounded-full mr-[30px]"
          />
          <span>{ensName !== undefined ? ensName : member.address}</span>{" "}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
