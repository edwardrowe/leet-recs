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
      className={`px-2 py-1 rounded border border-[var(--border)] text-xs bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] appearance-none shadow-sm ${className || ''}`}
      style={{ minWidth: 90 }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export default SortPicker; 