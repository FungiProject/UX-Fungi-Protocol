import React from "react";
import { useAlchemyAccountKitContext } from "@/lib/wallets/AlchemyAccountKitProvider";

export default function LoginButton() {
  const { login, isLoading, isIdle } = useAlchemyAccountKitContext();

  return (
    <>
      <button
        onClick={() => login()}
        className="bg-main py-[9px] rounded-full font-bold text-white flex w-[160px] items-center justify-center"
      >
        {isLoading ? "Loading..." : isIdle ? "Connect" : "Connecting..."}
      </button>
    </>
  );
}
