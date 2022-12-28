import { useState } from 'react';
import { useOrderbook } from '../orderbook/OrderbookContext';
import { ADropdown } from './astra-dropdown';

export const AStatusFilterButton: React.FC = () => {
  const { updateFilter } = useOrderbook();
  const [label, setLabel] = useState<string>('Status');

  return (
    <ADropdown
      hasBorder={false}
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
