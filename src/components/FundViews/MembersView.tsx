import { memberType } from "@/types/Types";
import React from "react";
import MembersTable from "../Tables/MembersTable";

type MembersViewProps = {
  typeMember: string;
  members: memberType[];
};

export default function MembersView({ typeMember, members }: MembersViewProps) {
  return (
    <main>
      <MembersTable members={members} />
    </main>
  );
}
