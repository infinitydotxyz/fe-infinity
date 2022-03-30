import { DatePicker } from 'src/components/common';
import { InputBox } from './input-box';

interface Props {
  label: string;
  value: Date;
  onChange: (value: Date) => void;
}

export function DateInput({ label, value, onChange }: Props): JSX.Element {
  return (
    <InputBox label={label}>
      <DatePicker value={value} onChange={onChange} />
    </InputBox>
  );
}
