// React
import React, { useState } from "react";
// Components
import PageContainer from "../Container/PageContainer";
import { SyntheticsPage } from "../Gmx/chartComponents/SyntheticsPage";

export default function Spot() {
  return (
    <main>
      <PageContainer
        main={<SyntheticsPage />}
        secondary={<div className="px-[32px] pt-[24px]">Pepe</div>}
      />
    </main>
  );
}
