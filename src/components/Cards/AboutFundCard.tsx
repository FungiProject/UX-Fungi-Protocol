// React
import React from "react";

type AboutFundCardProps = {
  description: string;
};

export default function AboutFundCard({ description }: AboutFundCardProps) {
  return (
    <main className="xl:max-w-[792px] pl-[40px] pr-[104px] py-[40px] bg-white rounded-xl text-xl font-bold shadow-xl">
      {description}
    </main>
  );
}
