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

  const selectedOption = useMemo(
    () => options.find((opt) => opt.id === value) ?? null,
    [options, value],
  );

  useEffect(() => {
    if (!isOpen) {
      setQuery(selectedOption?.label ?? '');
    }
  }, [selectedOption, isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setQuery(selectedOption?.label ?? '');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q))
    );
  }, [query, options]);

  const showCreateOption =
    onCreateNew &&
    query.trim().length > 0 &&
    !options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelectOption = useCallback(
    (optId: string) => {
      onChange(optId);
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
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
            w-full rounded-lg border bg-white py-2.5 pl-9 pr-10 text-sm text-gray-900
            placeholder:text-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400
            hover:border-gray-300
            ${error ? 'border-red-300 focus:ring-red-500/10 focus:border-red-400' : 'border-gray-200'}
          `}
          autoComplete="off"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Effacer la sélection"
            >
              <X size={14} />
            </button>
          )}
          {!value && (
            <div className="p-1 text-gray-400 pointer-events-none">
              <ChevronDown size={16} />
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg animate-fade-in">
          {filteredOptions.length === 0 && !showCreateOption ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Aucun résultat trouvé.
            </div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt.id)}
                className={`
                  flex w-full flex-col items-start px-4 py-2 text-left transition-colors
                  hover:bg-gray-50
                  ${opt.id === value ? 'bg-gray-50' : ''}
                `}
              >
                <span className="text-sm font-medium text-gray-900">
                  {opt.label}
                </span>
                {opt.sublabel && (
                  <span className="text-xs text-gray-500 mt-0.5">
                    {opt.sublabel}
                  </span>
                )}
              </button>
            ))
          )}

          {showCreateOption && (
            <button
              type="button"
              onClick={() => {
                if (onCreateNew) {
                  onCreateNew(query.trim());
                  setIsOpen(false);
                }
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-900 transition-colors hover:bg-gray-50 border-t border-gray-50"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-gray-600">
                <Plus size={14} />
              </div>
              <span className="font-medium">
                {createNewLabel} <span className="font-bold">"{query.trim()}"</span>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
