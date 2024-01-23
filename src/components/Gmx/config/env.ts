import { PRODUCTION_PREVIEW_KEY } from "./localStorage";

export const UI_VERSION = "1.4";
//export const IS_TOUCH = "ontouchstart" in window;

//export const IS_TOUCH = "ontouchstart" in window;

/*export function isDevelopment() { //TODO fungi
  const isProductionPreview = Boolean(localStorage.getItem(PRODUCTION_PREVIEW_KEY));

  return (
    !window.location.host?.includes("gmx.io") && !window.location.host?.includes("ipfs.io") && !isProductionPreview
  );
}
export function isLocal() {
  return window.location.host?.includes("localhost");
}*/

//Next
export function isDevelopment() {
  if (typeof window !== "undefined") {
    const isProductionPreview = Boolean(localStorage.getItem(PRODUCTION_PREVIEW_KEY));

    return (
      !window.location.host?.includes("gmx.io") &&
      !window.location.host?.includes("ipfs.io") &&
      !isProductionPreview
    );
  }

  return false;
}


export function isLocal() {
  if (typeof window !== "undefined") {
    return window.location.host?.includes("localhost");
  }

  return false;
}
