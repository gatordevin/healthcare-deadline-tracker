'use client';

import { DeadlineCategory } from '@/types';
import { getCategoryLabel, getCategoryColors } from '@/lib/utils';
import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  selectedCategories: DeadlineCategory[];
  onCategoryChange: (categories: DeadlineCategory[]) => void;
  selectedStates: string[];
  onStateChange: (states: string[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showPassed: boolean;
  onShowPassedChange: (show: boolean) => void;
}

const allCategories: DeadlineCategory[] = [
  'hipaa',
  'cms',
  'interoperability',
  'licensing',
  'oig',
  'other',
];

const allStates = ['FL', 'CA', 'SC', 'MD', 'NJ'];

export default function FilterBar({
  selectedCategories,
  onCategoryChange,
  selectedStates,
  onStateChange,
  searchQuery,
  onSearchChange,
  showPassed,
  onShowPassedChange,
}: FilterBarProps) {
  const toggleCategory = (category: DeadlineCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const toggleState = (state: string) => {
    if (selectedStates.includes(state)) {
      onStateChange(selectedStates.filter((s) => s !== state));
    } else {
      onStateChange([...selectedStates, state]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search deadlines..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filter by Category:</span>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {allCategories.map((category) => {
          const colors = getCategoryColors(category);
          const isSelected = selectedCategories.includes(category);

          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                isSelected
                  ? 'ring-2 ring-offset-1'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor: colors.background,
                color: colors.text,
              }}
            >
              {getCategoryLabel(category)}
            </button>
          );
        })}
        <button
          onClick={() => onCategoryChange([])}
          className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* State Filters */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-gray-700">Filter by State:</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {allStates.map((state) => {
          const isSelected = selectedStates.includes(state);

          return (
            <button
              key={state}
              onClick={() => toggleState(state)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {state}
            </button>
          );
        })}
      </div>

      {/* Show Passed Toggle */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPassed}
            onChange={(e) => onShowPassedChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Show passed deadlines</span>
        </label>
      </div>
    </div>
  );
}
