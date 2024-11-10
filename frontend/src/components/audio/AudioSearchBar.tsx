interface SearchBarProps {
  searchQuery: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({ searchQuery, onSearch }: SearchBarProps) => {
  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="Search audio files..."
        value={searchQuery}
        onChange={onSearch}
        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};