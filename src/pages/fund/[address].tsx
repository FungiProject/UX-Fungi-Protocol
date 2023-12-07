// React
import React from "react";
// Hooks
import useWindowSize from "@/hooks/useWindowSize";
// Components
import SideBar from "@/components/Layout/SideBar";
import ErrorPage from "@/components/Sections/ErrorPage";
import FundDetails from "@/components/Sections/FundDetails";

export default function FundPage() {
  const size = useWindowSize();

  if (size.width && size.width < 1024) {
    return <ErrorPage />;
  }
  return (
    <div>
      <SideBar page={<FundDetails />} />
    </div>
  );
}
