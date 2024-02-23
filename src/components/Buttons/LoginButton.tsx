import React from "react";
import useWallet from "@/hooks/useWallet";

export default function LoginButton() {
  const {login, isConnected, isLoading} = useWallet()

  return (
    <>
      <button
        onClick={() => login()}
        className="bg-main py-[9px] rounded-full font-bold text-white flex w-[160px] items-center justify-center"
      >
         {isLoading ? "Loading..." : isConnected ? "Connecting..." : "Connect"}
      </button>
    </>
  );
}
