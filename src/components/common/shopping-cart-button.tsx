import React from 'react';
import { Button } from './button';
import { FaShoppingCart } from 'react-icons/fa';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { useAppContext } from 'src/utils/context/AppContext';
import { useRouter } from 'next/router';
import { iconButtonStyle } from 'src/utils/ui-constants';

export const ShoppingCartButton = () => {
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
    <Button variant="outline" onClick={handleClick} className="relative">
      <FaShoppingCart className={iconButtonStyle} />
      {count > 0 ? (
        <span className="px-1 absolute top-1 right-2 bg-blue-500 text-white rounded-full text-xs">{count}</span>
      ) : null}
    </Button>
  );
};
