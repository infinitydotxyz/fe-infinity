import { InputBox } from './input-box';

interface Props {
  label: string;
  value: string | number;
  type: string;
  placeholder: string;
  onChange: (value: string | number) => void;
}

export function TextInput({ value, label, type, placeholder, onChange }: Props): JSX.Element {
  return (
    <InputBox label={label}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className=" p-0 border-none focus:ring-0  block w-full  text-sm    "
        placeholder={placeholder}
      />
    </InputBox>
  );
}
