import { useEffect, useState } from "react";

const VISIBILITY_STATE_SUPPORTED = "visibilityState";

function isWindowVisible() {
  if (!VISIBILITY_STATE_SUPPORTED) {
    return true;
  }
  if (typeof document !== "undefined") {
    return document.visibilityState === "visible";
  }
  return false;
}

export default function useIsWindowVisible() {
  const [isVisible, setIsVisible] = useState(isWindowVisible());

  useEffect(() => {
    if (!VISIBILITY_STATE_SUPPORTED) return undefined;

    const handleVisibilityChange = () => {
      setIsVisible(isWindowVisible());
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setIsVisible]);

  return isVisible;
}
