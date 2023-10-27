import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { hoverColor, selectedColor, tabItemBGColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { TextInputBox } from './input-box';
import { ClearBrushIcon } from 'src/icons';

const TabSelector = ({
  tabItems,
  value,
  customValue = '',
  setValue,
  setCustomValue,
  suffix,
  prefix,
  showCustom = false,
  showClear = false
}: {
  tabItems: string[];
  value: string;
  customValue?: string;
  setValue: (sweep: string) => void;
  setCustomValue?: (sweep: string) => void;
  showCustom?: boolean;
  showClear?: boolean;
  prefix?: string;
  suffix?: string;
}) => {
  const { cartType } = useCartContext();
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={twMerge(
          'flex flex-row md:m-0 my-2 h-10 cursor-pointer rounded-4 overflow-hidden gap-0.25',
          cartType === CartType.CollectionBid ? 'opacity-30 duration-300 pointer-events-none' : 'duration-300'
        )}
      >
        {tabItems?.map((tabItem) => (
          <div
            key={tabItem}
            className={twMerge(
              'flex items-center p-2.5 min-w-8.5 justify-center cursor-pointer',
              tabItemBGColor,
              hoverColor,
              value === tabItem && selectedColor
            )}
            onClick={() => {
              value === tabItem ? setValue('') : setValue(tabItem);
            }}
          >
            {prefix}
            {tabItem}
            {suffix}
          </div>
        ))}
        {showCustom && (
          <div className={twMerge('px-4 h-full flex items-center', tabItemBGColor)}>
            <TextInputBox
              autoFocus={true}
              inputClassName={twMerge(
                'text-sm font-medium font-body dark:placeholder:text-white placeholder:text-neutral-700',
                tabItemBGColor
              )}
              className={twMerge('border-0 w-14 p-0 text-sm', tabItemBGColor)}
              type="number"
              placeholder="Custom"
              value={customValue}
              onChange={(value) => {
                setValue(value);
                setCustomValue?.(value);
              }}
            />
          </div>
        )}
      </div>
      {showClear && (
        <div className="cursor-pointer" onClick={() => setValue('')}>
          <ClearBrushIcon />
        </div>
      )}
    </div>
  );
};

export default TabSelector;
