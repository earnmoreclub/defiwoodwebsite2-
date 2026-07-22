'use client';

import { JournalCategory } from '@/types/journal';

interface CategoryFilterProps {
  categories: JournalCategory[];
  activeCategory: JournalCategory | 'all';
  onChange: (category: JournalCategory | 'all') => void;
}

export default function CategoryFilter({ categories, activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <FilterChip
        label="全部"
        active={activeCategory === 'all'}
        onClick={() => onChange('all')}
      />
      {categories.map((category) => (
        <FilterChip
          key={category}
          label={category}
          active={activeCategory === category}
          onClick={() => onChange(category)}
        />
      ))}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${
          active
            ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
            : 'bg-dark-800 text-slate-400 hover:text-white hover:bg-dark-700 border border-white/10'
        }
      `}
    >
      {label}
    </button>
  );
}