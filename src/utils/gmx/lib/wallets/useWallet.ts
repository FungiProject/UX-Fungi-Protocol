import { useAlchemyAccountKitContext } from "@/lib/wallets/AlchemyAccountKitProvider";
import { useAccount, useNetwork } from "wagmi";

export default function useWallet() {
  const { address, isConnected, connector } = useAccount();
  const {scaAddress} = useAlchemyAccountKitContext()
  const { chain } = useNetwork();
  //const { data: signer } = useSigner(); //TODO fungi
  const signer = undefined

  return {
    scAccount: scaAddress,
    account: address,
    active: isConnected,
    connector,
    chainId: chain?.id,
    signer: signer ?? undefined,
  };
}
