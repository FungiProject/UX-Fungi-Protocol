import useWalletFungi from "@/hooks/useWallet";

export default function useWallet() {

  const { chainId, scAccount, isConnected } = useWalletFungi();

  return {
    scAccount,
    account: "", //TODO remove
    active: isConnected,
    chainId,
  };
}
