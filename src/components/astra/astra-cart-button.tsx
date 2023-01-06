import { BsCartCheckFill, BsCartDash } from 'react-icons/bs';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { clickColor, iconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AButton } from './astra-button';

export const AstraCartButton = () => {
  const { showCart, setShowCart, selection, collSelection, orderSelection } = useDashboardContext();
  const numItems = Math.max(selection.length, collSelection.length, orderSelection.length);

  return (
    <AButton onClick={() => setShowCart(!showCart)} className={twMerge('relative py-2.5', showCart ? clickColor : '')}>
      {numItems > 0 ? (
        <>
          <BsCartCheckFill className={twMerge(iconButtonStyle)} />
          <span className="px-1.5 absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full text-xs">
            {numItems}
          </span>
        </>
      ) : (
        <BsCartDash className={twMerge(iconButtonStyle)} />
      )}
    </AButton>
  );
};
