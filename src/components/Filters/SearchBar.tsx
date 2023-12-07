// React
import React from "react";
// Heroicons
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

type SearchBar = {
  getInfo: (query: string) => void;
  query: string;
  classMain: string;
  placeholder: string;
};

export default function SearchBar({
  getInfo,
  query,
  classMain,
  placeholder,
}: SearchBar) {
  const handleSearchChange = (e: any) => {
    let query = e.currentTarget.value;
    getInfo(query.toLowerCase());
  };

  return (
    <div className={classMain}>
      {!query ? <MagnifyingGlassIcon className="h-6 w-6 mr-4" /> : <></>}
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        className="rounded-full text-black outline-none placeholder:text-black py-[9px] w-full"
        onChange={(e) => handleSearchChange(e)}
      />
    </div>
  );
}
