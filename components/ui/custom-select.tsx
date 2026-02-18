import React, { useState, useRef, useEffect } from 'react';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select...',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Keyboard navigation
  const [highlighted, setHighlighted] = useState<number>(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ') setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      setHighlighted((h) => (h + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      setHighlighted((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === 'Enter' && highlighted >= 0) {
      onChange(options[highlighted].value);
      setOpen(false);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={ref}>
      {label && (
        <label className="block mb-1 text-sm font-medium">{label}</label>
      )}
      <button
        type="button"
        className={`w-full bg-white border rounded-full px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center ${open ? 'ring-2 ring-blue-400' : ''}`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>
          {options.find((o) => o.value === value)?.label || (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
          tabIndex={-1}
          role="listbox"
        >
          {options.map((option, idx) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${value === option.value ? 'bg-blue-50 font-semibold' : ''} ${highlighted === idx ? 'bg-blue-200' : ''}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlighted(idx)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
