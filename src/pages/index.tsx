// React
import React from "react";
// Hooks
import useWindowSize from "@/hooks/useWindowSize";
// Components
import ErrorPage from "@/components/Sections/ErrorPage";
import ActionsSideBar from "@/components/Layout/ActionsSideBar";

export default function HomePage() {
  const size = useWindowSize();

  if (size.width && size.width < 1024) {
    return <ErrorPage />;
  }

  return (
    <div>
      <ActionsSideBar isHistory={false} />
    </div>
  );
}
