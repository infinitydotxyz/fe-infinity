import { useState } from 'react';
import { useOrdersContext } from '../../utils/context/OrdersContext';
import { ADropdown } from './astra-dropdown';

export const AStatusFilterButton: React.FC = () => {
  const { updateFilters } = useOrdersContext();
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
            updateFilters([{ name: 'orderType', value: '' }]);
          }
        },
        {
          label: 'Has listings',
          onClick: () => {
            setLabel('Has listings');
            updateFilters([{ name: 'orderType', value: 'listing' }]);
          }
        },
        {
          label: 'Has offers',
          onClick: () => {
            setLabel('Has offers');
            updateFilters([{ name: 'orderType', value: 'offer' }]);
          }
        }
      ]}
    />
  );
};
