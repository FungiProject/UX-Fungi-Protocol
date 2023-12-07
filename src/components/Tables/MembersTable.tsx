// Types
import { memberType } from "@/types/Types";
// React
import React from "react";
// Components
import MemberTableCard from "../Cards/MemberTableCard";

type MembersTableProps = {
  members: memberType[];
  typeMember: string;
  isOwner: boolean;
  startIndex: number;
  endIndex: number;
};

export default function MembersTable({
  members,
  typeMember,
  isOwner,
  startIndex,
  endIndex,
}: MembersTableProps) {
  return (
    <main className="mt-[20px] w-full h-[574px] px-[20px] bg-white rounded-lg overflow-hidden">
      {members.slice(startIndex, endIndex).map((member: memberType) => {
        return (
          <MemberTableCard
            member={member}
            key={member.address}
            typeMember={typeMember}
            isOwner={isOwner}
          />
        );
      })}
    </main>
  );
}
