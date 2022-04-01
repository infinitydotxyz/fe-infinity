import { InputBox } from './input-box';

interface Props {
  label: string;
  value: string;
  type: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, label, type, placeholder, onChange }: Props): JSX.Element {
  return (
    <InputBox label={label}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className=" p-0 border-none focus:ring-0  block w-full  text-base"
        placeholder={placeholder}
      />
    </InputBox>
  );
}
