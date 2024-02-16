import { importImage } from "../../../../utils/gmx/lib/legacy";
import cx from "classnames";
import Image from "next/image";

function getIconUrlPath(symbol, size: 24 | 40) {
  if (!symbol || !size) return;
  return `ic_${symbol.toLowerCase()}_${size}.svg`;
}

type Props = {
  symbol: string;
  displaySize: number;
  importSize?: 24 | 40;
  className?: string;
};

function TokenIcon({ className, symbol, displaySize, importSize = 24 }: Props) {
  const iconPath = getIconUrlPath(symbol, importSize);
  const classNames = cx("Token-icon", className);

  if (!iconPath) return <></>;
  return (
    <Image
      className={classNames}
      src={importImage(iconPath)}
      alt={symbol}
      width={displaySize}
      height={displaySize}
    />
  );
}

export default TokenIcon;
