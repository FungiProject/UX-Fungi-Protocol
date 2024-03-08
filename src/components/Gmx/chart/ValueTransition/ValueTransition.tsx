import { ReactNode } from "react";
import { BsArrowRight } from "react-icons/bs";

type Props = {
  from?: ReactNode;
  to?: ReactNode;
};

export function ValueTransition(p: Props) {
  if (!p.to || p.to === p.from) return <>{p.from}</>;
  if (!p.from) return <>{p.to}</>;

  return (
    <>
      <div className="flex items-center">
        <span>{p.from}</span>
        <BsArrowRight className="mx-2" /> {p.to}
      </div>
    </>
  );
}
