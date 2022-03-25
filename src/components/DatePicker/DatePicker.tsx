import React from 'react';
import styles from './DatePicker.module.scss';
import Flatpickr from 'react-flatpickr';

// date picker themes
// import './theme.css';
import 'flatpickr/dist/themes/airbnb.css';
import { OutlineButton } from '../Button';
// import 'flatpickr/dist/themes/dark.css';
// import 'flatpickr/dist/themes/light.css';
// import 'flatpickr/dist/themes/material_blue.css';

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
};

export const DatePicker = ({ placeholder = 'Dec 8, 2021  12:00 PM', value, onChange }: Props) => {
  let myFp: any;

  return (
    <div className={styles.wrapper}>
      <Flatpickr
        ref={(fp) => {
          myFp = fp;
        }}
        data-enable-time
        options={{
          enableTime: true,
          altInput: true,
          altFormat: 'M j, Y  h:i K'
        }}
        placeholder={placeholder}
        value={value}
        className={styles.flatpicker}
        onChange={(date) => {
          onChange(date[0]);
        }}
      />

      <OutlineButton
        onClick={() => {
          // at this point it's always closed since any click closes the existing popup
          // tried to get it to toggle properly, but will fix later if possible
          if (myFp) {
            if (!myFp.isOpen) {
              myFp.flatpickr.toggle();
            }
          }
        }}
      >
        Icon
      </OutlineButton>
    </div>
  );
};
