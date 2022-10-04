import React from 'react';
import { Button } from './button';
import { FaShoppingCart } from 'react-icons/fa';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { useDrawerContext } from 'src/utils/context/DrawerContext';

export const ShoppingCartButton = () => {
  const { drawerButtonClick } = useDrawerContext();

  const { cartItemCount } = useDrawerContext();

  return (
    <Button variant="outline" onClick={drawerButtonClick} className="relative">
      <FaShoppingCart className={iconButtonStyle} />
      {cartItemCount > 0 ? (
        <span className="px-1.5 absolute top-1 right-2   bg-blue-500 text-white rounded-full text-xs">
          {cartItemCount}
        </span>
      ) : null}
    </Button>
  );
};
