import React, { ReactElement, useEffect, useState } from "react";

interface ActionsSideBarProps {
  page: ReactElement;
}

export default function ActionsSideBar({ page }: ActionsSideBarProps) {
  return (
    <div className="lg:pl-[187px] ">
      <div className="flex shrink-0 items-center gap-x-4  sticky top-0 z-50 mt-[40px]">
        <div className="flex flex-1 gap-x-1 self-stretch lg:gap-x-3 z-50">
          <div className="relative flex flex-1 justify-end items-center gap-x-4">
            Button
          </div>
        </div>
      </div>

      <main className="pl-[20px]">{page}</main>
    </div>
  );
}
