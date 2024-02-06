import { useAlchemyAccountKitContext } from "@/lib/wallets/AlchemyAccountKitProvider";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

export default function useWallet() {
  const { address, isConnected, connector } = useAccount();
  const { scaAddress } = useAlchemyAccountKitContext();
  const { chain } = useNetwork();
  //const { data: signer } = useSigner(); //TODO fungi
  const signer = undefined;
  // scaAddress Ukhezo = 0xeE78B1FaA849923F5A37137b0F5AFc7484376Ea8
  return {
    scAccount: scaAddress,
    account: address,
    active: isConnected,
    connector,
    chainId: chain?.id,
    signer: signer ?? undefined,
  };
}
