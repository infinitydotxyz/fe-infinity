import { ComboBox, ComboBoxBaseType } from './combo-box';
import { InputBox } from './input-box';

interface Props<T extends ComboBoxBaseType> {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}

export function ComboInput<T extends ComboBoxBaseType>({ label, options, onChange, value }: Props<T>): JSX.Element {
  return (
    <InputBox label={label}>
      <ComboBox options={options} value={value} onChange={onChange} />
    </InputBox>
  );
}
