'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, X, ChevronDown, Plus } from 'lucide-react';

interface SearchSelectOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface SearchSelectProps {
  label: string;
  placeholder: string;
  options: SearchSelectOption[];
  value: string;
  onChange: (id: string) => void;
  error?: string;
  required?: boolean;
  onCreateNew?: (searchTerm: string) => void;
  createNewLabel?: string;
}

export default function SearchSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  required,
  onCreateNew,
  createNewLabel = 'Ajouter',
}: SearchSelectProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Resolve the currently selected option from the value prop
  const selectedOption = useMemo(
    () => options.find((opt) => opt.id === value) ?? null,
    [options, value],
  );

  // Keep the input text in sync when the value prop changes externally
  useEffect(() => {
    if (!isOpen) {
      setQuery(selectedOption?.label ?? '');
    }
  }, [selectedOption, isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        // Reset query to the selected label (or empty) when closing
        setQuery(selectedOption?.label ?? '');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption]);

  // Filter options based on query (case-insensitive on label + sublabel)
  const filteredOptions = useMemo(() => {
    const search = query.toLowerCase().trim();
    if (!search) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(search) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(search)),
    );
  }, [query, options]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      setIsOpen(true);

      // If the user clears the input, deselect
      if (val === '') {
        onChange('');
      }
    },
    [onChange],
  );

  const handleSelect = useCallback(
    (opt: SearchSelectOption) => {
      onChange(opt.id);
      setQuery(opt.label);
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange('');
      setQuery('');
      setIsOpen(false);
      inputRef.current?.focus();
    },
    [onChange],
  );

  const handleFocus = useCallback(() => {
    setIsOpen(true);
    // Select all text so the user can immediately type to search
    if (selectedOption) {
      setQuery('');
    }
  }, [selectedOption]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery(selectedOption?.label ?? '');
        inputRef.current?.blur();
      }
    },
    [selectedOption],
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Label */}
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        {/* Search icon */}
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full rounded-none border bg-white py-2.5 pl-9 pr-16 text-sm text-slate-900
            placeholder:text-slate-400
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-slate-900
            ${error ? 'border-red-400' : 'border-slate-300'}
          `}
          autoComplete="off"
        />

        {/* Right-side controls */}
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {/* Clear button – shown only when a value is selected */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-none p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Effacer la sélection"
            >
              <X size={14} />
            </button>
          )}

          {/* Chevron indicator */}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-none border border-slate-200 bg-white py-1 shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li
                key={opt.id}
                onMouseDown={(e) => {
                  // Prevent input blur before selection fires
                  e.preventDefault();
                  handleSelect(opt);
                }}
                className={`
                  cursor-pointer px-3 py-2 transition-colors hover:bg-slate-50
                  ${opt.id === value ? 'bg-slate-50 font-medium text-slate-900' : 'text-slate-700'}
                `}
              >
                <span className="block text-sm">{opt.label}</span>
                {opt.sublabel && (
                  <span className="block text-xs text-slate-400">
                    {opt.sublabel}
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-slate-400">
              Aucun résultat trouvé
            </li>
          )}
          {onCreateNew && query.trim() && (
            <li
              onMouseDown={(e) => {
                e.preventDefault();
                onCreateNew(query.trim());
                setIsOpen(false);
              }}
              className="cursor-pointer px-3 py-2.5 border-t border-slate-100 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              {createNewLabel} &laquo; {query.trim()} &raquo;
            </li>
          )}
        </ul>
      )}

      {/* Error message */}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
