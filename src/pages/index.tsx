import Home from "@/components/Sections/Home";
import SideBar from "@/components/Layout/SideBar";
import React from "react";
import useWindowSize from "@/hooks/useWindowSize";
import ErrorPage from "@/components/Sections/ErrorPage";

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
