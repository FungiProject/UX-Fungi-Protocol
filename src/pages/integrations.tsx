import SideBar from "@/components/Layout/SideBar";
import Integrations from "@/components/Sections/Integrations";
import React from "react";

export default function IntegrationsPages() {
  return (
    <div>
      <SideBar page={<Integrations />} />
    </div>
  );
}
