import React from 'react';
import { useAppContext } from 'src/utils/context/AppContext';
import { BiCopyAlt, BiCheck } from 'react-icons/bi';
import { Dropdown } from './dropdown';
import { useRouter } from 'next/router';
import { Button } from './button';
import { FaShoppingBag } from 'react-icons/fa';
import { useOrderContext } from 'src/utils/context/OrderContext';

interface ShoppingCartButtonProps {
  address: string;
  href: string;
  label: string;
  tooltip: string;
  target?: string;
}

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
