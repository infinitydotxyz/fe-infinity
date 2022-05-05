import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface Props {
  value: string;
  onChange: (query: string) => void;
  placeholder: string;
  className?: string;
}

export const DebouncedTextField = ({ value, placeholder, onChange, className = '' }: Props) => {
  const [query, setQuery] = useState(value);

  const handleChange = async (value: string) => {
    setQuery(value);
    setQueryDebounced(value);
  };

  // must use useCallback or it doesn't work
  const setQueryDebounced = useCallback(
    debounce((value: string) => {
      onChange(value);
    }, 300),
    []
  );

  return (
    <div className={className}>
      <input
        value={query}
        placeholder={placeholder}
        className="w-full border border-gray-400 rounded-lg focus:ring-0 py-2 px-3 text-lg leading-5 text-gray-900 "
        onChange={(event) => handleChange(event.target.value)}
      />
    </div>
  );
};
