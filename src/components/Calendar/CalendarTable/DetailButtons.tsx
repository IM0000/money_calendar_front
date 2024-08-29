import { FaSearch, FaPlus } from 'react-icons/fa';

export default function DetailButtons() {
  return (
    <div className="flex space-x-2">
      <button className="rounded bg-gray-700 p-1.5 text-white">
        <FaSearch />
      </button>
      <button className="rounded bg-gray-500 p-1.5 text-white">
        <FaPlus />
      </button>
    </div>
  );
}
