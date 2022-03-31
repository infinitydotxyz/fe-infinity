import { useRef } from 'react';
import { DatePicker } from 'src/components/common';
import { InputBox } from './input-box';
import datePickerIcon from 'src/images/date-picker-icon.svg';
import flatpickr from 'flatpickr';
interface Props {
  label: string;
  value: Date;
  placeholder: string;
  onChange: (value: Date) => void;
}

export function DateInput({ label, value, onChange, placeholder }: Props): JSX.Element {
  const fpRef = useRef<{ flatpickr: flatpickr.Instance } | null>(null);

  const openTimer = () => {
    console.log(fpRef);
    setTimeout(() => fpRef.current && fpRef.current.flatpickr.open(), 0);
  };

  return (
    <InputBox label={label}>
      <div className="relative flex-1">
        <div className="mt-1 flex-1">
          <DatePicker ref={fpRef} value={value} onChange={onChange} placeholder={placeholder} />
        </div>
        <div className="absolute right-0 bottom-0">
          <img src={datePickerIcon.src} alt="date picker icon" onClick={openTimer} />
        </div>
      </div>
    </InputBox>
  );
}
