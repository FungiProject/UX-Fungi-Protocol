type SearchBar = {
  getInfo: (query: string) => void;
};

export default function SearchBar({ getInfo }: SearchBar) {
  const handleSearchChange = (e: any) => {
    let query = e.currentTarget.value;
    getInfo(query.toLowerCase());
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        className="rounded-full text-black px-[22px] py-[9px] w-[270px] shadow-lg outline-none"
        onChange={(e) => handleSearchChange(e)}
      />
    </div>
  );
}
