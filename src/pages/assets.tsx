// React
import React from "react";
// Components
import SideBar from "@/components/Layout/SideBar";
import Assets from "@/components/Sections/Assets";
import ErrorPage from "@/components/Sections/ErrorPage";
// Hooks
import useWindowSize from "@/hooks/useWindowSize";

export default function AssetsPage() {
  const size = useWindowSize();

  if (size.width && size.width < 1024) {
    return <ErrorPage />;
  }
  return (
    <div>
      <SideBar page={<Assets />} />
    </div>
  );
}
