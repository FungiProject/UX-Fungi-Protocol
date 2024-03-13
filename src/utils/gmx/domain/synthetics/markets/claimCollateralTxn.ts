import { getContract } from "../../../config/contracts";
import ExchangeRouter from "../../../../../../abis/ExchangeRouter.json";
import { Signer, ethers } from "ethers";
import { callContract } from "../../../lib/contracts/callContract";

type Params = {
  scAccount: string;
  fundingFees: {
    marketAddresses: string[];
    tokenAddresses: string[];
  };
  setPendingTxns: (txns: any) => void;
};

export function claimCollateralTxn(chainId: number, p: Params) {
  const { setPendingTxns, fundingFees, scAccount } = p;

  const contract = new ethers.Contract(
    getContract(chainId, "ExchangeRouter"),
    ExchangeRouter.abi
  );

  return callContract(
    chainId,
    contract,
    "claimFundingFees",
    [fundingFees.marketAddresses, fundingFees.tokenAddresses, scAccount],
    {
      sentMsg: `Funding Claimed`,
      successMsg: `Success claimings`,
      failMsg: `Claiming failed`,
      hideSuccessMsg: true,
      setPendingTxns,
    }
  );
}
