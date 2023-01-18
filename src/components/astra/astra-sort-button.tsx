import { useEffect, useState } from 'react';
import { TokensFilter, SORT_FILTERS, SORT_LABELS, getSortLabel } from 'src/utils/types';
import { ADropdown } from './astra-dropdown';

interface Props {
  className?: string;
  filter: TokensFilter;
  setFilter: (filter: TokensFilter) => void;
}

// There has to be a parent with OrderbookProvider to work.
export const ASortButton = ({ className, filter, setFilter }: Props) => {
  const [label, setLabel] = useState<string>(getSortLabel(filter.sort));

  useEffect(() => {
    setLabel(getSortLabel(filter.sort));
  }, [filter.sort]);

  const onClickSort = (_label: string, sortOrder: string) => {
    const newFilter: TokensFilter = {};
    newFilter.sort = sortOrder;
    setFilter({ ...filter, ...newFilter });
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
