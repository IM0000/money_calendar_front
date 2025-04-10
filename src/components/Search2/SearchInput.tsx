import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

type SearchInputProps = {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function SearchInput({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: SearchInputProps) {
  return (
    <form onSubmit={onSearchSubmit} className="mb-4 flex justify-center">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchQuery}
        onChange={onSearchChange}
        className="w-3/5 rounded-l-lg border border-gray-300 p-2 shadow-md"
      />
      <button
        type="submit"
        className="rounded-r-lg border border-gray-300 bg-gray-200 p-2 text-gray-500 shadow-md"
      >
        <AiOutlineSearch size={20} />
      </button>
    </form>
  );
}
