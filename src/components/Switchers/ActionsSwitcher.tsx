import { actions } from "@/constants/Constants";
import React from "react";

type ActionsSwitcherProps = {
  actionSelected: string;
  getActionSelected: (action: string) => void;
};

export default function ActionsSwitcher({
  actionSelected,
  getActionSelected,
}: ActionsSwitcherProps) {
  return (
    <div className="h-[48px] py-[4px] px-[12px] w-[700px] rounded-full grid grid-cols-4 bg-white items-center text-center mt-[86px] shadow-2xl">
      {actions.map((action: string) => {
        return (
          <button
            onClick={() => getActionSelected(action)}
            className={
              action === actionSelected
                ? "bg-black text-white rounded-full py-[8px]"
                : "bg-white"
            }
          >
            {action}
          </button>
        );
      })}
    </div>
  );
}
