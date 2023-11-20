import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

type SearchBar = {
  getInfo: (query: string) => void;
  query: string;
};

export default function SearchBar({ getInfo, query }: SearchBar) {
  const handleSearchChange = (e: any) => {
    let query = e.currentTarget.value;
    getInfo(query.toLowerCase());
  };

  return (
    <div className="rounded-full text-black px-[22px] items-center w-[270px] shadow-lg outline-none placeholder:text-black bg-white flex">
      {!query ? <MagnifyingGlassIcon className="h-6 w-6 mr-4" /> : <></>}
      <input
        type="text"
        placeholder="Search"
        className="rounded-full text-black outline-none placeholder:text-black py-[9px]"
        onChange={(e) => handleSearchChange(e)}
      />
    </div>
  );
}
