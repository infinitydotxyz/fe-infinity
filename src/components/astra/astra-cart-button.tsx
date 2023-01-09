import { BsCartCheckFill, BsCartDash } from 'react-icons/bs';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { bgColorInverse, brandTextColor, iconButtonStyle, textColorInverse } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AButton } from './astra-button';

export const AstraCartButton = () => {
  const { showCart, setShowCart, selection, collSelection, orderSelection } = useDashboardContext();
  const numItems = Math.max(selection.length, collSelection.length, orderSelection.length);

  return (
    <AButton
      onClick={() => setShowCart(!showCart)}
      className={twMerge('relative py-2.5', showCart || numItems > 0 ? brandTextColor : '')}
    >
      {numItems > 0 ? (
        <>
          <BsCartCheckFill className={twMerge(iconButtonStyle)} />
          <span
            className={twMerge(
              'px-1.5 absolute top-0.5 right-0.5 rounded-full text-xs',
              bgColorInverse,
              textColorInverse
            )}
          >
            {numItems}
          </span>
        </>
      ) : (
        <BsCartDash className={twMerge(iconButtonStyle)} />
      )}
    </AButton>
  );
};
