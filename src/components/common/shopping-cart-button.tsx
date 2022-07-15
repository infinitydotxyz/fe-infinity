import React from 'react';
import { Button } from './button';
import { FaShoppingCart } from 'react-icons/fa';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { useAppContext } from 'src/utils/context/AppContext';
import { useRouter } from 'next/router';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { useDrawerContext } from 'src/utils/context/DrawerContext';

export const ShoppingCartButton = () => {
  const { user } = useAppContext();
  const { orderDrawerOpen, setOrderDrawerOpen } = useOrderContext();
  const { cartItemCount } = useDrawerContext();
  const router = useRouter();

  const connected = user?.address ? true : false;

  const handleClick = async () => {
    if (connected) {
      setOrderDrawerOpen(!orderDrawerOpen);
    } else {
      router.push('/connect');
    }
  };

  return (
    <Button variant="outline" onClick={handleClick} className="relative">
      <FaShoppingCart className={iconButtonStyle} />
      {cartItemCount > 0 ? (
        <span className="px-1 absolute top-1 right-2 bg-blue-500 text-white rounded-full text-xs">{cartItemCount}</span>
      ) : null}
    </Button>
  );
};
