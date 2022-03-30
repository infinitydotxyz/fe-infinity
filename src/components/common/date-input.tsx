import { DatePicker } from 'src/components/common';
import { InputBox } from './input-box';
import datePickerIcon from 'src/images/date-picker-icon.svg';
interface Props {
  label: string;
  value: Date;
  placeholder: string;
  onChange: (value: Date) => void;
}

export function DateInput({ label, value, onChange, placeholder }: Props): JSX.Element {
  return (
    <InputBox label={label}>
      <DatePicker value={value} onChange={onChange} />
    </InputBox>
  );
}
