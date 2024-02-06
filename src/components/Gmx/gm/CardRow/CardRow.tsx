import { ReactNode } from "react";

type Props = {
  label: ReactNode;
  value: ReactNode;
};

export function CardRow(p: Props) {
  return (
    <div className="grid grid-cols-2 my-[16px] z-10">
      <div className="label">{p.label}</div>
      <div className="value">{p.value}</div>
    </div>
  );
}
