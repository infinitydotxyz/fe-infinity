import { useState } from 'react';
import { useOrdersContext } from '../../utils/context/OrdersContext';
import { ADropdown } from './astra-dropdown';

export const AStatusFilterButton: React.FC = () => {
  const { updateFilter } = useOrdersContext();
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
            updateFilter('orderType', '');
          }
        },
        {
          label: 'Has listings',
          onClick: () => {
            setLabel('Has listings');
            updateFilter('orderType', 'listing');
          }
        },
        {
          label: 'Has offers',
          onClick: () => {
            setLabel('Has offers');
            updateFilter('orderType', 'offer');
          }
        }
      ]}
    />
  );
};
