import { BigNumberish } from "ethers";
import cx from "classnames";
import { bigNumberify } from "../../../../utils/gmx/lib/numbers";

export type Props = {
  share?: BigNumberish;
  total?: BigNumberish;
  warningThreshold?: number; // 0-100
  className?: string;
};

export function ShareBar(p: Props) {
  const { share, total, className, warningThreshold } = p;

  if (!share || !total || bigNumberify(total)!.eq(0)) {
    return null;
  }

  let progress = bigNumberify(share)!.mul(100).div(total).toNumber();
  progress = Math.min(progress, 100);

  return (
    <div
      className={cx(
        "ShareBar",
        className,
        warningThreshold && warningThreshold < progress ? "warning" : null
      )}
    >
      <div className="ShareBar-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}
