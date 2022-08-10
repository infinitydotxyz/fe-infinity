import { FaMinus, FaPlus } from 'react-icons/fa';
import { TextInputBox } from './input-box';

export type NumericInputBoxProps = {
  /**
   * Default value.
   */
  value: number | string;

  /**
   * Called when the value changes.
   */
  onChange?: (value: string, valueAsNr: number) => void;

  /**
   * Called when the user clicks the increment button.
   */
  onIncrement?: () => void;

  /**
   * Called when the user clicks the decrement button.
   */
  onDecrement?: () => void;

  /**
   * The minimum value.
   *
   * Defaults to Number.MIN_SAFE_INTEGER.
   */
  min?: number;

  /**
   * The maximum value.
   *
   * Defaults to Number.MAX_SAFE_INTEGER.
   */
  max?: number;
};

export const NumericInputBox: React.FC<NumericInputBoxProps> = ({
  value,
  onChange,
  onIncrement,
  onDecrement,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER
}) => {
  const isInRange = (nextValue: number) => nextValue >= min && nextValue <= max;

  const increment = () => isInRange(+value + 1) && onIncrement?.();
  const decrement = () => isInRange(+value - 1) && onDecrement?.();
  const change = (nextValue: string) => isInRange(+nextValue) && onChange?.(nextValue, +nextValue);

  return (
    <TextInputBox
      className="bg-white"
      label=""
      value={value.toString()}
      onChange={change}
      type="text"
      placeholder="0"
      renderRightIcon={() => <FaPlus onClick={increment} />}
      renderLeftIcon={() => <FaMinus onClick={decrement} />}
    />
  );
};
