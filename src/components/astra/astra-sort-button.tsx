import React, { useEffect, useState } from 'react';
import { getSortLabel, SORT_FILTERS, SORT_LABELS, useOrderbook } from '../orderbook/OrderbookContext';
import { ADropdown } from './astra-dropdown';

interface Props {
  className?: string;
}

// There has to be a parent with OrderbookProvider to work.
export const ASortButton = ({ className }: Props) => {
  const { updateFilter, filters } = useOrderbook();
  const [label, setLabel] = useState<string>(getSortLabel(filters?.sort));

  useEffect(() => {
    setLabel(getSortLabel(filters?.sort));
  }, [filters]);

  const onClickSort = (_label: string, sortOrder: string) => {
    updateFilter('sort', sortOrder);
  };

  return (
    <>
      <div className={className}>
        <ADropdown
          label={label}
          items={[
            {
              label: SORT_LABELS[SORT_FILTERS.highestPrice],
              onClick: () => onClickSort(SORT_LABELS[SORT_FILTERS.highestPrice], SORT_FILTERS.highestPrice)
            },
            {
              label: SORT_LABELS[SORT_FILTERS.lowestPrice],
              onClick: () => onClickSort(SORT_LABELS[SORT_FILTERS.lowestPrice], SORT_FILTERS.lowestPrice)
            },
            {
              label: SORT_LABELS[SORT_FILTERS.mostRecent],
              onClick: () => onClickSort(SORT_LABELS[SORT_FILTERS.mostRecent], SORT_FILTERS.mostRecent)
            }
          ]}
        />
      </div>
    </>
  );
};
