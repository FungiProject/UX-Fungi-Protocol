import Actions from "@/components/Sections/Actions";
import ErrorPage from "@/components/Sections/ErrorPage";
import ActionsSwitcher from "@/components/Switchers/ActionsSwitcher";
import useWindowSize from "@/hooks/useWindowSize";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export default function ActionsPage() {
  const [actionSelected, setActionSelected] = useState("Swap");
  const size = useWindowSize();

  const getActionSelected = (action: string) => {
    setActionSelected(action);
  };

  if (size.width && size.width < 1024) {
    return <ErrorPage />;
  }
  return (
    <main className="flex flex-col items-center relative">
      <XMarkIcon className="w-[30px] h-[32px] absolute right-0 top-[30px]" />
      <ActionsSwitcher
        actionSelected={actionSelected}
        getActionSelected={getActionSelected}
      />
      <Actions actionSelected={actionSelected} />
    </main>
  );
}
