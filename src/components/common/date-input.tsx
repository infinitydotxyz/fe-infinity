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
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <div className="mt-1">
        <DatePicker value={value} onChange={onChange} />
      </div>
    </InputBox>
  );
}
