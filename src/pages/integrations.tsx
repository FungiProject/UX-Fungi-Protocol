// React
import React from "react";
// Hooks
import useWindowSize from "@/hooks/useWindowSize";
// Components
import SideBar from "@/components/Layout/SideBar";
import ErrorPage from "@/components/Sections/ErrorPage";
import Integrations from "@/components/Sections/Integrations";

export default function IntegrationsPages() {
  const size = useWindowSize();

  if (size.width && size.width < 1024) {
    return <ErrorPage />;
  }
  return (
    <div>
      <SideBar page={<Integrations />} />
    </div>
  );
}
