import TokenIcon from "./TokenIcon";

type Props = {
  displaySize: number;
  symbol?: string;
  className?: string;
  importSize?: 24 | 40;
};

export default function TokenWithIcon({
  symbol,
  className,
  importSize,
  displaySize,
}: Props) {
  if (!symbol) return <></>;
  return (
    <span className="flex">
      <TokenIcon
        className="mr-xs mx-2"
        symbol={symbol}
        importSize={importSize}
        displaySize={displaySize}
      />
      {symbol}
    </span>
  );
}
