import React from 'react';
import Flatpickr from 'react-flatpickr';

// date picker themes
// import './theme.css';
import 'flatpickr/dist/themes/airbnb.css';
// import 'flatpickr/dist/themes/dark.css';
// import 'flatpickr/dist/themes/light.css';
// import 'flatpickr/dist/themes/material_blue.css';

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
};

export const DatePicker = ({ placeholder = 'Dec 8, 2021  12:00 PM', value, onChange }: Props) => {
  return (
    <div className="flex flex-row w-full     rounded-md">
      <Flatpickr
        data-enable-time
        options={{
          enableTime: true,
          altInput: true,
          altFormat: 'M j, Y  h:i K'
        }}
        placeholder={placeholder}
        value={value}
        className="flex border-none outline-none w-full"
        onChange={(date) => {
          onChange(date[0]);
        }}
      />
    </div>
  );
};
