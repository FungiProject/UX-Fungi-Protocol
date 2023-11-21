import { useRouter } from "next/router";
import React from "react";
import { useAccount } from "wagmi";
import UserInfo from "../Cards/UserInfo";

export default function FundDetails() {
  const { address } = useAccount();
  const router = useRouter();

  return (
    <main>
      <UserInfo
        address={router.query.address as `0x${string}`}
        isUser={false}
      />
    </main>
  );
}
