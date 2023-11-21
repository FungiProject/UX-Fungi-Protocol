import ErrorPage from "@/components/Sections/ErrorPage";
import useWindowSize from "@/hooks/useWindowSize";
import React from "react";

export default function ActionsPage() {
  const size = useWindowSize();

  if (size.width && size.width < 1024) {
    return <ErrorPage />;
  }
  return <div>[address]</div>;
}
