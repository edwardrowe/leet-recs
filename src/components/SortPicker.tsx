import React from "react";

export type SortOption = {
  value: string;
  label: string;
};

interface SortPickerProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SortPicker: React.FC<SortPickerProps> = ({ options, value, onChange, className }) => {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 ${className || ''}`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export default SortPicker; 