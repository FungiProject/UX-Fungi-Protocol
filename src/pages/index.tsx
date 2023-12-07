// React
import React from "react";
// Hooks
import useWindowSize from "@/hooks/useWindowSize";
// Components
import ErrorPage from "@/components/Sections/ErrorPage";
import Home from "@/components/Sections/Home";
import SideBar from "@/components/Layout/SideBar";

export default function HomePage() {
  const size = useWindowSize();

  if (size.width && size.width < 1024) {
    return <ErrorPage />;
  }

  return (
    <div>
      <SideBar page={<Home />} />
    </div>
  );
}
