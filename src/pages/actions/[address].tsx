// React
import React, { useState } from "react";
// Next
import Link from "next/link";
import { useRouter } from "next/router";
// Components
import Actions from "@/components/Sections/Actions";
import ErrorPage from "@/components/Sections/ErrorPage";
import ActionsSwitcher from "@/components/Switchers/ActionsSwitcher";
// Constants
import { actions } from "@/constants/Constants";
// Hooks
import useWindowSize from "@/hooks/useWindowSize";
// Heroicons
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ActionsPage() {
  const [actionSelected, setActionSelected] = useState("Swap");
  const size = useWindowSize();
  const router = useRouter();
  const getActionSelected = (action: string) => {
    setActionSelected(action);
  };

  if (size.width && size.width < 1024) {
    return <ErrorPage />;
  }
  return (
    <main className="flex flex-col items-center relative">
      <Link href={`/fund/${router.query.address}`}>
        <XMarkIcon className="w-[30px] h-[32px] absolute right-0 top-[30px]" />
      </Link>

      <ActionsSwitcher
        actionSelected={actionSelected}
        getActionSelected={getActionSelected}
        actions={actions}
        className="h-[48px] p-[4px] w-[700px] rounded-full grid grid-cols-4 bg-white items-center text-center mt-[86px] shadow-2xl text-sm"
        paddingButton="py-[8px]"
      />
      <Actions actionSelected={actionSelected} />
    </main>
  );
}
