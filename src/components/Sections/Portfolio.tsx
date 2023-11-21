import React from "react";
import { useAccount } from "wagmi";
import UserInfo from "../Cards/UserInfo";

export default function Portfolio() {
  const { address } = useAccount();
  return (
    <main>
      <UserInfo address={address} isUser={true} />
    </main>
  );
}
