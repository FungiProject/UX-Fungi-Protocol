import { memberType } from "@/types/Types";
import React from "react";
import MemberTableCard from "../Cards/MemberTableCard";

type MembersTableProps = {
  members: memberType[];
};

export default function MembersTable({ members }: MembersTableProps) {
  return (
    <main className="mt-[20px] w-full h-[574px] px-[20px] bg-white rounded-lg overflow-hidden">
      {members.map((member: memberType) => {
        return <MemberTableCard member={member} key={member.address} />;
      })}
    </main>
  );
}
