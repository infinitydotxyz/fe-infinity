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
          label: 'Buy now',
          onClick: () => {
            setLabel('Buy now');
            updateFilter('status', 'buyNow');
          }
        },
        {
          label: 'Has offers',
          onClick: () => {
            setLabel('Has offers');
            updateFilter('status', 'hasOffers');
          }
        }
      ]}
    />
  );
};
