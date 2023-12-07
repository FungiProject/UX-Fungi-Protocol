// React
import React from "react";
// Components
import SideBar from "@/components/Layout/SideBar";
import ErrorPage from "@/components/Sections/ErrorPage";
import Portfolio from "@/components/Sections/Portfolio";
// Hooks
import useWindowSize from "@/hooks/useWindowSize";

export default function PortfolioPage() {
  const size = useWindowSize();

  if (size.width && size.width < 1024) {
    return <ErrorPage />;
  }
  return (
    <div>
      <SideBar page={<Portfolio />} />
    </div>
  );
}
