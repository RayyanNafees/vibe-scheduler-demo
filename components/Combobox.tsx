
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

interface ComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const Combobox: React.FC<ComboboxProps> = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 ring-offset-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="flex items-center border-b border-zinc-800 px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-8 w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-600"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredOptions.length > 0) {
                  onChange(filteredOptions[0]);
                  setOpen(false);
                  setSearch('');
                }
              }}
            />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-sm text-zinc-600">No results found.</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearch('');
                  }}
                  className="relative flex w-full cursor-default select-none items-center rounded-lg px-2 py-2 text-sm outline-none hover:bg-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Check className={`mr-2 h-4 w-4 ${value === opt ? "opacity-100" : "opacity-0"}`} />
                  {opt}
                </button>
              ))
            )}
            {!filteredOptions.includes(search) && search && (
               <button
                  type="button"
                  onClick={() => {
                    onChange(search);
                    setOpen(false);
                    setSearch('');
                  }}
                  className="relative flex w-full cursor-default select-none items-center rounded-lg px-2 py-2 text-sm italic text-blue-400 hover:bg-zinc-900"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Add "{search}"
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import { Plus } from 'lucide-react';
