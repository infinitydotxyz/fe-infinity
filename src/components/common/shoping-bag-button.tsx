import { useAppContext } from 'src/utils/context/AppContext';
import { useCartContext } from 'src/utils/context/CartContext';
import { brandTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AButton } from '../astra/astra-button';
import { ShoppingBag } from 'src/icons';

export const ShoppingBagButton = () => {
  const { showCart, setShowCart } = useAppContext();
  const { getCurrentCartItems } = useCartContext();
  const numItems = getCurrentCartItems().length;
  return (
    <AButton
      primary
      onClick={() => setShowCart(!showCart)}
      className={twMerge(
        'relative py-3.5 rounded-tr-4 rounded-br-4 border-0 px-3.5',
        showCart || numItems > 0 ? brandTextColor : ''
      )}
    >
      {numItems > 0 && (
        <div className="absolute -top-2 -right-2 px-1.5 text-sm rounded-full bg-gray-50 border border-gray-300 text-black font-semibold">
          {numItems}
        </div>
      )}
      <ShoppingBag className="text-white dark:text-neutral-700 h-4.5 w-5" />
    </AButton>
  );
};
