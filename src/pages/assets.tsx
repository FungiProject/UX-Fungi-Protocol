import SideBar from "@/components/Layout/SideBar";
import Assets from "@/components/Sections/Assets";
import React from "react";

export default function AssetsPage() {
  return (
    <div>
      <SideBar page={<Assets />} />
    </div>
  );
}
