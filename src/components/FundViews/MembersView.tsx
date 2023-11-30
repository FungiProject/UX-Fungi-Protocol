import React from "react";
import MembersTable from "../Tables/MembersTable";
import Polygon from "../../../public/Polygon.svg";

export default function MembersView() {
  const members = [
    {
      address: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
      image: Polygon.src,
    },
    {
      address: "0xF70c1cEa8909563619547128A92dd7CC965F9657",
      image: Polygon.src,
    },
  ];

  return (
    <main>
      <MembersTable members={members} />
    </main>
  );
}
