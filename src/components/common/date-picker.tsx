import React from 'react';
import Flatpickr from 'react-flatpickr';

// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

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

export const AppDatePicker = ({ placeholder = 'Dec 8, 2021  12:00 PM', value, onChange }: Props) => {
  return (
    <div className="flex flex-row w-full rounded-md">
      <Flatpickr
        data-enable-time
        options={{
          enableTime: true,
          altInput: true,
          altFormat: 'M j, Y  h:i K'
        }}
        placeholder={placeholder}
        value={value}
        className="flex border-none outline-none focus:ring-0 p-0 focus:outline-none w-full"
        onChange={(date) => {
          onChange(date[0]);
        }}
      />

      {/* <DatePicker
        selected={value}
        showTimeSelect
        dateFormat="MM/dd/yyyy, h:mm aa"
        onChange={(date: Date) => {
          onChange(date);
        }}
        className="border-none outline-none focus:ring-0 p-0 focus:outline-none w-full"
      /> */}
    </div>
  );
};
