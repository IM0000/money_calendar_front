import create from 'zustand';

interface FilterInfo {
  selectedImportances: string[];
  selectedEventTypes: string[];
  setSelectedImportances: (importances: string[]) => void;
  setSelectedEventTypes: (eventTypes: string[]) => void;
}

const useFilterInfoStore = create<FilterInfo>((set) => ({
  selectedImportances: [],
  selectedEventTypes: [],
  setSelectedImportances: (importances: string[]) =>
    set({ selectedImportances: importances }),
  setSelectedEventTypes: (eventTypes: string[]) =>
    set({ selectedEventTypes: eventTypes }),
}));

export default useFilterInfoStore;
