import { useGlobalContext } from "@/context/FungiGlobalContext";

export default function useWallet() {
  const {
    login,
    scaAddress,
    switchNetwork,
    chain,
    logout,
    isLoading,
    isConnected,
  } = useGlobalContext();

  return {
    scAccount: scaAddress,
    login,
    logout,
    isConnected,
    isLoading,
    switchNetwork,
    chainId: chain,
  };
}
