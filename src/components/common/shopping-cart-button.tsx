import React from 'react';

import { Button } from './button';
import { FaShoppingBag } from 'react-icons/fa';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { useAppContext } from 'src/utils/context/AppContext';
import { useRouter } from 'next/router';

export const ShoppingCartButton: React.FC = () => {
  const { user } = useAppContext();
  const { orderDrawerOpen, setOrderDrawerOpen, ordersInCart, cartItems, customDrawerItems } = useOrderContext();
  const router = useRouter();
  const hasOrderDrawer = router.asPath.indexOf('tab=Orders') < 0 && router.asPath.indexOf('tab=Send') < 0;

  const connected = user?.address ? true : false;

  const handleClick = async () => {
    if (connected) {
      setOrderDrawerOpen(!orderDrawerOpen);
    } else {
      router.push('/connect');
    }
  };
  let count = cartItems.length || ordersInCart.length;
  if (!hasOrderDrawer) {
    count = customDrawerItems;
  }

  return (
    <Button variant="outline" onClick={handleClick} className="py-3 relative">
      <FaShoppingBag className="mb-1" />
      {count > 0 ? (
        <span className="px-1 py-0.5 absolute top-0 right-2.5 bg-theme-gray-200 rounded-lg text-xs">{count}</span>
      ) : null}
    </Button>
  );
};
