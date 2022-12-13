import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { ARoundButton } from './astra-button';
import { useDashboardContext } from 'src/utils/context/DashboardContext';

export const AstraCartButton = () => {
  const { showCart, setShowCart, selection } = useDashboardContext();

  return (
    <ARoundButton onClick={() => setShowCart(!showCart)} className="relative">
      <FaShoppingCart className={iconButtonStyle} />
      {selection.length > 0 ? (
        <span className="px-1.5 absolute top-1 right-1.5   bg-blue-500 text-white rounded-full text-xs">
          {selection.length}
        </span>
      ) : null}
    </ARoundButton>
  );
};