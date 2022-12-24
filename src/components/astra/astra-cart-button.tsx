import { HiOutlineShoppingCart } from 'react-icons/hi';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { iconButtonStyle, primaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ARoundButton } from './astra-button';

export const AstraCartButton = () => {
  const { showCart, setShowCart, selection, collSelection } = useDashboardContext();

  return (
    <ARoundButton onClick={() => setShowCart(!showCart)} className="relative">
      <HiOutlineShoppingCart className={twMerge(iconButtonStyle, showCart ? primaryTextColor : '')} />
      {selection.length > 0 || collSelection.length > 0 ? (
        <span className="px-1.5 absolute top-1 right-1.5   bg-red-500   text-white rounded-full text-xs">
          {selection.length > collSelection.length ? selection.length : collSelection.length}
        </span>
      ) : null}
    </ARoundButton>
  );
};
