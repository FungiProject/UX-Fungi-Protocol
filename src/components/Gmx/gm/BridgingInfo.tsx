import Tooltip from "../common/Tooltip/Tooltip";
import { getBridgingOptionsForToken } from "../../../utils/gmx/config/bridging";
import { getChainName } from "../../../utils/gmx/config/chains";
import Link from "next/link";

type Props = {
  chainId: number;
  tokenSymbol?: string;
};

export default function BridgingInfo(props: Props) {
  const { chainId, tokenSymbol } = props;
  const chainName = getChainName(chainId);
  const bridgingOptions = getBridgingOptionsForToken(tokenSymbol);

  if (!tokenSymbol || !bridgingOptions) return null;

  return (
    <Tooltip
      handle="Bridging instructions"
      position="right-bottom"
      renderContent={() => (
        <>
          Bridge {tokenSymbol} to {chainName} using any of the options below:
          <br />
          <br />
          {bridgingOptions.map((option) => {
            const bridgeLink = option.generateLink(chainId);
            return <Link href={bridgeLink}>{option?.name}</Link>;
          })}
        </>
      )}
    />
  );
}
