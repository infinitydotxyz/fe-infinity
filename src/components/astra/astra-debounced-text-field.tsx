import React, { useState, useCallback } from 'react';
import { cardClr, textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import debounce from 'lodash/debounce';

interface Props {
  value: string;
  onChange: (query: string) => void;
  placeholder: string;
  className?: string;
}

export const ADebouncedTextField = ({ value, placeholder, onChange, className = '' }: Props) => {
  const [query, setQuery] = useState(value);

  const handleChange = (value: string) => {
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
        className={twMerge(
          cardClr,
          textClr,
          'w-full outline-none',
          'rounded-full focus-visible:ring focus:ring-0 py-2 px-4 text-lg lg:text-md leading-5'
        )}
        onChange={(event) => handleChange(event.target.value)}
      />
    </div>
  );
};
