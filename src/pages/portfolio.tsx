import SideBar from "@/components/Layout/SideBar";
import Portfolio from "@/components/Sections/Portfolio";
import React from "react";

export default function PortfolioPage() {
  return (
    <div>
      <SideBar page={<Portfolio />} />
    </div>
  );
}
