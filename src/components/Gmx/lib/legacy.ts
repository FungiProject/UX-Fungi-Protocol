import { ethers } from "ethers";
import { expandDecimals } from "./numbers";
import { t } from "@lingui/macro";
import { isLocal } from "../config/env";

export const USD_DECIMALS = 30;
export const PRECISION = expandDecimals(1, 30);
export const DUST_BNB = "2000000000000000";

export function isAddressZero(value) {
  return value === ethers.constants.AddressZero;
}

export function getPageTitle(data) {
  const title = t`Decentralized Perpetual Exchange | GMX`;
  return `${data} | ${title}`;
}

export function getHomeUrl() {
  if (isLocal()) {
    return "http://localhost:3010";
  }

  return "https://gmx.io";
}

export function getRootShareApiUrl() {
  if (isLocal()) {
    return "https://gmxs.vercel.app";
  }

  return "https://share.gmx.io";
}

export function getTwitterIntentURL(text, url = "", hashtag = "") {
  let finalURL = "https://twitter.com/intent/tweet?text=";
  if (text.length > 0) {
    finalURL += Array.isArray(text)
      ? text.map((t) => encodeURIComponent(t)).join("%0a%0a")
      : encodeURIComponent(text);
    if (hashtag.length > 0) {
      finalURL += "&hashtags=" + encodeURIComponent(hashtag.replace(/#/g, ""));
    }
    if (url.length > 0) {
      finalURL += "&url=" + encodeURIComponent(url);
    }
  }
  return finalURL;
}

export function importImage(name) {
  let tokenImage = "";

  try {
    tokenImage = require("src/img/" + name); //TODO fungi
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return tokenImage;
}

export const CHART_PERIODS = {
  "1m": 60,
  "5m": 60 * 5,
  "15m": 60 * 15,
  "1h": 60 * 60,
  "4h": 60 * 60 * 4,
  "1d": 60 * 60 * 24,
};
