import React from 'react';

import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
};

export const DatePicker = ({ placeholder = 'Dec 8, 2021  12:00 PM', value, onChange }: Props) => {
  return (
    <div className="flex flex-row w-full rounded-md">
      <ReactDatePicker
        selected={value}
        showTimeInput
        timeInputLabel="Time:"
        minDate={new Date()}
        shouldCloseOnSelect={true}
        placeholderText={placeholder}
        dateFormat="EE, MMMM dd, yyyy h:mm aa"
        onChange={(date) => {
          onChange(date ?? new Date());
        }}
        className="border-none outline-none focus:ring-0 p-0 focus:outline-none w-full"
      />
    </div>
  );
};
