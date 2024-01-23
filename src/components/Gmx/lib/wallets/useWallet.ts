import { useAccount, useNetwork } from "wagmi";

export default function useWallet() {
  const { address, isConnected, connector } = useAccount();
  const { chain } = useNetwork();
  //const { data: signer } = useSigner(); //TODO fungi
  const signer = undefined

  return {
    account: address,
    active: isConnected,
    connector,
    chainId: chain?.id,
    signer: signer ?? undefined,
  };
}
