import { BsCartCheckFill, BsCartDash } from 'react-icons/bs';
import { useAppContext } from 'src/utils/context/AppContext';
import { useCartContext } from 'src/utils/context/CartContext';
import { inverseBgColor, brandTextColor, iconButtonStyle, inverseTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AButton } from './astra-button';

export const AstraCartButton = () => {
  const { showCart, setShowCart } = useAppContext();
  const { getCurrentCartItems } = useCartContext();
  const numItems = getCurrentCartItems().length;

  return (
    <AButton
      onClick={() => setShowCart(!showCart)}
      className={twMerge('relative py-2.5 rounded-lg', showCart || numItems > 0 ? brandTextColor : '')}
    >
      {numItems > 0 ? (
        <>
          <BsCartCheckFill className={twMerge(iconButtonStyle)} />
          <div
            className={twMerge(
              'absolute top-0.5 right-0.5 rounded-full text-xs h-5 w-5 flex items-center justify-center',
              inverseBgColor,
              inverseTextColor
            )}
          >
            {numItems}
          </div>
        </>
      ) : (
        <BsCartDash className={twMerge(iconButtonStyle)} />
      )}
    </AButton>
  );
};
