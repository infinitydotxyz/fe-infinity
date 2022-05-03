import React from 'react';

import { Button } from './button';
import { FaShoppingBag } from 'react-icons/fa';
import { useOrderContext } from 'src/utils/context/OrderContext';

export const ShoppingCartButton: React.FC = () => {
  const { orderDrawerOpen, setOrderDrawerOpen, isOrderStateEmpty } = useOrderContext();

  return (
    <Button
      disabled={isOrderStateEmpty()}
      variant="outline"
      onClick={async () => {
        setOrderDrawerOpen(!orderDrawerOpen);
      }}
      className="py-3"
    >
      <FaShoppingBag />
    </Button>
  );
};
