import SideBar from "@/components/Layout/SideBar";
import Portfolio from "@/components/Sections/Portfolio";
import React from "react";

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
