import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { TextInputBox } from './input-box';

interface Props {
  value: string;
  onChange: (query: string) => void;
  placeholder: string;
  label: string;
  type: string;
  className?: string;
}

export const DebouncedTextInputBox = ({ value, label, type, placeholder, onChange, className = '' }: Props) => {
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
    <div>
      <TextInputBox
        label={label}
        type={type}
        className={className}
        value={query}
        onChange={(value) => handleChange(value)}
        placeholder={placeholder}
      />
    </div>
  );
};
