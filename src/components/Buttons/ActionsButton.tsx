import Link from "next/link";
import React from "react";

type ActionsButtonProps = {
  fund: string;
  isOwner: boolean;
};

export default function ActionsButton({ fund, isOwner }: ActionsButtonProps) {
  return (
    <main className="mr-[35px]">
      {isOwner ? (
        <Link href={`/actions/${fund}`}>
          <button className="bg-main text-white rounded-lg px-16 py-3.5 text-sm">
            Actions
          </button>
        </Link>
      ) : (
        <div className="flex gap-x-[22px]">
          {" "}
          <button className="bg-main text-white rounded-lg px-16 py-3.5 text-sm">
            Deposit
          </button>
          <button className="bg-main text-white rounded-lg px-16 py-3.5 text-sm">
            Withdraw
          </button>{" "}
        </div>
      )}
    </main>
  );
}
