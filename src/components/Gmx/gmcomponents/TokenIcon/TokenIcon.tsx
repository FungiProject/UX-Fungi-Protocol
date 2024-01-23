import { importImage } from "../../lib/legacy";
import Image from "next/image";
//import "./TokenIcon.scss";

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
  if (!iconPath) return <></>;
  return <Image src={importImage(iconPath)} alt={symbol} width={displaySize} />;
}

export default TokenIcon;
