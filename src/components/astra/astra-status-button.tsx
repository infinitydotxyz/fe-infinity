import { useState } from 'react';
import { TokensFilter } from 'src/utils/types';
import { ADropdown } from './astra-dropdown';

interface Props {
  filter: TokensFilter;
  setFilter: (filter: TokensFilter) => void;
}

export const AStatusFilterButton = ({ filter, setFilter }: Props) => {
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
            delete filter.orderType;
            setFilter({ ...filter });
          }
        },
        {
          label: 'Has listings',
          onClick: () => {
            setLabel('Has listings');
            const newFilter: TokensFilter = {};
            newFilter.orderType = 'listing';
            setFilter({ ...filter, ...newFilter });
          }
        },
        {
          label: 'Has offers',
          onClick: () => {
            setLabel('Has offers');
            const newFilter: TokensFilter = {};
            newFilter.orderType = 'offer';
            setFilter({ ...filter, ...newFilter });
          }
        }
      ]}
    />
  );
};
