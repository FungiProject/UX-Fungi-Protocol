// React
import { ReactElement } from "react";
// Components
import ActionsSideBar from "./ActionsSideBar";
import DesktopSideBar from "./DesktopSideBar";

interface SideBarProps {
  page: ReactElement;
}

export default function SideBar({ page }: SideBarProps) {
  return (
    <div className="z-50">
      <DesktopSideBar />
      <ActionsSideBar page={page} />
    </div>
  );
}
