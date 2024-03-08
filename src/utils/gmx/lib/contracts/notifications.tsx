import ExternalLink from "../../../../components/Gmx/common/ExternalLink/ExternalLink";
import { getExplorerUrl } from "../../config/chains";
import { ethers } from "ethers";

const notifications: { [id: string]: boolean } = {};

export function pushSuccessNotification(
  chainId: number,
  message: string,
  e: { transactionHash: string }
) {
  const { transactionHash } = e;

  const id = ethers.utils.id(message + transactionHash);
  if (notifications[id]) {
    return;
  }

  notifications[id] = true;
}

export function pushErrorNotification(
  chainId: number,
  message: string,
  e: { transactionHash: string }
) {
  const { transactionHash } = e;
  const id = ethers.utils.id(message + transactionHash);
  if (notifications[id]) {
    return;
  }

  notifications[id] = true;
}
