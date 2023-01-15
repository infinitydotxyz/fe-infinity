import React, { useEffect, useState } from 'react';
import { getSortLabel, SORT_FILTERS, SORT_LABELS, useOrderbookContext } from '../../utils/context/OrderbookContext';
import { ADropdown } from './astra-dropdown';

interface Props {
  className?: string;
}

// There has to be a parent with OrderbookProvider to work.
export const ASortButton = ({ className }: Props) => {
  const { updateFilter, filters } = useOrderbookContext();
  const [label, setLabel] = useState<string>(getSortLabel(filters?.sort));

  useEffect(() => {
    setLabel(getSortLabel(filters?.sort));
  }, [filters?.sort]);

  const onClickSort = (_label: string, sortOrder: string) => {
    updateFilter('sort', sortOrder);
  };

  return (
    <>
      <div className={className}>
        <ADropdown
          hasBorder={true}
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
              label: SORT_LABELS[SORT_FILTERS.tokenIdNumeric],
              onClick: () => onClickSort(SORT_LABELS[SORT_FILTERS.tokenIdNumeric], SORT_FILTERS.tokenIdNumeric)
            }
          ]}
        />
      </div>
    </>
  );
};
