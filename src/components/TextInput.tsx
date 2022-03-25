interface Props {
  label: string;
  value: string;
  type: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, label, type, placeholder, onChange }: Props): JSX.Element {
  return (
    <div className='py-2 px-6 mb-1 outline outline-1 outline-slate-300 rounded-2xl '>
      <label className='block text-xs font-medium text-gray-700'>{label}</label>
      <div className='mt-1'>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className=' p-0 border-none focus:ring-0  block w-full  text-sm    '
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
