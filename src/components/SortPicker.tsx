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
      className={`px-2 py-1 rounded border border-gray-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-cyan-200 appearance-none shadow-sm ${className || ''}`}
      style={{ minWidth: 90 }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export default SortPicker; 