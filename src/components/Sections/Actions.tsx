import React from "react";
import DWCActionCard from "../Cards/DWCActionCard";

type ActionsProps = {
  actionSelected: string;
};

export default function Actions({ actionSelected }: ActionsProps) {
  return (
    <main className="w-[727px] min-h-[528px] mt-[48px] shadow-input rounded-3xl px-[115px] bg-white">
      {actionSelected !== "Swap" ? (
        <DWCActionCard actionSelected={actionSelected} />
      ) : (
        <div>Swapper</div>
      )}
    </main>
  );
}
