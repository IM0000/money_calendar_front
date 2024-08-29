type FilterButtonProps = {
  type: string;
  selectedList: string[];
  toggleSelection: (
    selection: string[],
    setSelection: (selection: string[]) => void,
    value: string,
  ) => void;
  setSelected: (selection: string[]) => void;
};

export default function FilterButton({
  type,
  selectedList,
  toggleSelection,
  setSelected,
}: FilterButtonProps) {
  return (
    <button
      onClick={() => toggleSelection(selectedList, setSelected, type)}
      className={`rounded-sm px-4 py-2 text-xs font-semibold focus:outline-none ${
        selectedList.includes(type)
          ? 'bg-blue-400 text-white'
          : 'bg-gray-200 text-black'
      }`}
    >
      {type}
    </button>
  );
}
