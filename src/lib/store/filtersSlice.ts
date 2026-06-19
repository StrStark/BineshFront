import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColumnConfig } from '../components/ColumnCustomizer';

export type FilterOperator = 'equals' | 'notEquals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 'hasIncompleteData' | 'hasCompleteData' | 'isEmpty';

export interface ColumnFilter {
  id: string;
  column: string;
  operator: FilterOperator;
  value: string;
}

export interface SavedFilterSet {
  id: string;
  name: string;
  filters: ColumnFilter[];
  columnSettings?: ColumnConfig[];
  createdAt: number;
  tableId?: string; // Added to track which table the filter belongs to
}

interface FiltersState {
  activeFilters: Record<string, ColumnFilter[]>; // tableId -> filters
  savedFilterSets: SavedFilterSet[];
  openColumnFilter: string | null;
  columnSettings: Record<string, ColumnConfig[]>; // tableId -> columns
}

const initialState: FiltersState = {
  activeFilters: {},
  savedFilterSets: [],
  openColumnFilter: null,
  columnSettings: {},
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    addFilter: (state, action: PayloadAction<{ tableId: string; filter: ColumnFilter }>) => {
      const { tableId, filter } = action.payload;
      if (!state.activeFilters[tableId]) {
        state.activeFilters[tableId] = [];
      }
      state.activeFilters[tableId].push(filter);
    },
    removeFilter: (state, action: PayloadAction<{ tableId: string; filterId: string }>) => {
      const { tableId, filterId } = action.payload;
      if (state.activeFilters[tableId]) {
        state.activeFilters[tableId] = state.activeFilters[tableId].filter(f => f.id !== filterId);
      }
    },
    updateFilter: (state, action: PayloadAction<{ tableId: string; filter: ColumnFilter }>) => {
      const { tableId, filter } = action.payload;
      if (state.activeFilters[tableId]) {
        const index = state.activeFilters[tableId].findIndex(f => f.id === filter.id);
        if (index !== -1) {
          state.activeFilters[tableId][index] = filter;
        }
      }
    },
    clearAllFilters: (state, action: PayloadAction<string>) => {
      const tableId = action.payload;
      state.activeFilters[tableId] = [];
    },
    saveFilterSet: (state, action: PayloadAction<{ tableId: string; name: string }>) => {
      const { tableId, name } = action.payload;
      const newSet: SavedFilterSet = {
        id: Date.now().toString(),
        name,
        filters: [...(state.activeFilters[tableId] || [])],
        columnSettings: state.columnSettings[tableId],
        createdAt: Date.now(),
        tableId,
      };
      state.savedFilterSets.push(newSet);
    },
    loadFilterSet: (state, action: PayloadAction<{ tableId: string; setId: string }>) => {
      const { tableId, setId } = action.payload;
      const filterSet = state.savedFilterSets.find(fs => fs.id === setId);
      if (filterSet) {
        state.activeFilters[tableId] = filterSet.filters.map(f => ({ ...f, id: Date.now().toString() + Math.random() }));
        if (filterSet.columnSettings) {
          state.columnSettings[tableId] = filterSet.columnSettings;
        }
      }
    },
    deleteSavedFilterSet: (state, action: PayloadAction<string>) => {
      state.savedFilterSets = state.savedFilterSets.filter(fs => fs.id !== action.payload);
    },
    setOpenColumnFilter: (state, action: PayloadAction<string | null>) => {
      state.openColumnFilter = action.payload;
    },
    setColumnSettings: (state, action: PayloadAction<{ tableId: string; columns: ColumnConfig[] }>) => {
      state.columnSettings[action.payload.tableId] = action.payload.columns;
    },
  },
});

export const {
  addFilter,
  removeFilter,
  updateFilter,
  clearAllFilters,
  saveFilterSet,
  loadFilterSet,
  deleteSavedFilterSet,
  setOpenColumnFilter,
  setColumnSettings,
} = filtersSlice.actions;

export default filtersSlice.reducer;