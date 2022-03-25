import { DatePicker } from './DatePicker/DatePicker';

interface Props {
  label: string;
  value: string;
  type: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export function DateInput({ value, label, type, placeholder, onChange }: Props): JSX.Element {
  return (
    <div className="py-2 px-6 mb-1 outline outline-1 outline-slate-300 rounded-2xl ">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <div className="mt-1">
        {/* <DatePicker
          value={new Date(parseInt(endTime.toString()) * 1000)}
          onChange={(date) => {
            setEndTime(date.getTime() / 1000);
          }}
        /> */}
      </div>
    </div>
  );
}
