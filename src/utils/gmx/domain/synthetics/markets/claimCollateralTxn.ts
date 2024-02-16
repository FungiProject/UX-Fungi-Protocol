import { getContract } from "../../../config/contracts";
import ExchangeRouter from "../../../../../../abis/ExchangeRouter.json";
import { Signer, ethers } from "ethers";
import { callContract } from "../../../lib/contracts/callContract";

type Params = {
  account: string;
  fundingFees: {
    marketAddresses: string[];
    tokenAddresses: string[];
  };
  setPendingTxns: (txns: any) => void;
};

export function claimCollateralTxn(chainId: number, signer: Signer, p: Params) {
  const { setPendingTxns, fundingFees, account } = p;

  const contract = new ethers.Contract(
    getContract(chainId, "ExchangeRouter"),
    ExchangeRouter.abi,
    signer
  );

  return callContract(
    chainId,
    contract,
    "claimFundingFees",
    [fundingFees.marketAddresses, fundingFees.tokenAddresses, account],
    {
      sentMsg: `Funding Claimed`,
      successMsg: `Success claimings`,
      failMsg: `Claiming failed`,
      hideSuccessMsg: true,
      setPendingTxns,
    }
  );
}
