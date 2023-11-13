import { useRouter } from "next/router";

import { useDisconnect, useAccount } from "wagmi";

export default function LogoutButton() {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const router = useRouter();

  const logingOut = async () => {
    disconnect();
    router.push("/");
  };

  return (
    <button
      onClick={() => logingOut()}
      className="bg-main py-[9px] rounded-full font-bold text-white flex w-[160px] items-center justify-center"
    >
      {address ? (
        address.substring(0, 6) + "..." + address.substring(address.length - 4)
      ) : (
        <></>
      )}
    </button>
  );
}
