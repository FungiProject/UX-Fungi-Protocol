import { PRODUCTION_PREVIEW_KEY } from "./localStorage";

export const UI_VERSION = "1.4";

export const IS_TOUCH = "ontouchstart";

export function isDevelopment() {
  // const isProductionPreview = Boolean(
  //   localStorage.getItem(PRODUCTION_PREVIEW_KEY)
  // );

  // return (
  //   !window.location.host?.includes("gmx.io") &&
  //   !window.location.host?.includes("ipfs.io") &&
  //   !isProductionPreview
  // );
  return false;
}

export function isLocal() {
  if (typeof window !== "undefined") {
    return window.location.host?.includes("localhost");
  }
  return false;
}
