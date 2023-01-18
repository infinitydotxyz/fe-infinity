import { useState } from 'react';
import { useOrdersContext } from '../../utils/context/OrdersContext';
import { OrdersFilter } from 'src/utils/types';
import { ADropdown } from './astra-dropdown';

export const AStatusFilterButton: React.FC = () => {
  const { setFilter } = useOrdersContext();
  const [label, setLabel] = useState<string>('Status');

  return (
    <ADropdown
      hasBorder={true}
      label={label}
      items={[
        {
          label: 'All items',
          onClick: () => {
            setLabel('All items');
            const newFilter: OrdersFilter = {};
            newFilter.orderType = '';
            setFilter((state) => ({ ...state, ...newFilter }));
          }
        },
        {
          label: 'Has listings',
          onClick: () => {
            setLabel('Has listings');
            const newFilter: OrdersFilter = {};
            newFilter.orderType = 'listing';
            setFilter((state) => ({ ...state, ...newFilter }));
          }
        },
        {
          label: 'Has offers',
          onClick: () => {
            setLabel('Has offers');
            const newFilter: OrdersFilter = {};
            newFilter.orderType = 'offer';
            setFilter((state) => ({ ...state, ...newFilter }));
          }
        }
      ]}
    />
  );
};
