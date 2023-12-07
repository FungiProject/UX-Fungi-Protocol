// React
import React from "react";

type MemberCardProps = {
  address: string;
};

export default function MemberCard({ address }: MemberCardProps) {
  return (
    <main className="shadow-input max-w-[124px] text-center py-2 rounded-xl px-[12px]">
      {address.substring(0, 8) + "..."}
    </main>
  );
}
