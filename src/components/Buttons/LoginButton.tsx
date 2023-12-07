// React
import React from "react";
// Wagmi
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function LoginButton() {
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }
    await connectAsync();
  };

  return (
    <button
      onClick={onLoginClick}
      className="bg-main py-[9px] rounded-full font-bold text-white flex w-[160px] items-center justify-center"
    >
      <span className="ml-2">Connect</span>
    </button>
  );
}
