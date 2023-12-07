// React
import React from "react";

type ActionsSwitcherProps = {
  actionSelected: string;
  getActionSelected: (action: string) => void;
  actions: string[];
  className: string;
  paddingButton: string;
};

export default function ActionsSwitcher({
  actionSelected,
  getActionSelected,
  actions,
  className,
  paddingButton,
}: ActionsSwitcherProps) {
  return (
    <div className={className}>
      {actions.map((action: string) => {
        return (
          <button
            key={action}
            onClick={() => getActionSelected(action)}
            className={
              action === actionSelected
                ? `bg-black text-white rounded-full ${paddingButton}`
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
