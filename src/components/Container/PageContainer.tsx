//React
import React, { ReactElement } from "react";

type PageContainerProps = {
  main: ReactElement;
  secondary: ReactElement;
};

export default function PageContainer({ main, secondary }: PageContainerProps) {
  return (
    <main className="grid grid-cols-3 mt-[20px] w-full h-[730px] bg-white rounded-lg overflow-hidden">
      <div className="col-span-2">{main}</div>
      <div className="border-l-1">{secondary}</div>
    </main>
  );
}
