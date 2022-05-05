import { useEffect, useState } from 'react';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { Dropdown } from 'src/components/common';

const RARITY_HIGH_LABEL = 'Rarity: High to low';
const RARITY_LOW_LABEL = 'Rarity: Low to high';
const PRICE_HIGH_LABEL = 'Price: High to low';
const PRICE_LOW_LABEL = 'Price: Low to high';

export const GallerySort = () => {
  const { filterState, setFilterState } = useFilterContext();
  const [label, setLabel] = useState('Sort');

  const onClickSort = (orderBy: 'rarityRank' | 'price' | '', orderDirection: 'asc' | 'desc' | '') => {
    const newFilter = { ...filterState };
    newFilter.orderBy = orderBy;
    newFilter.orderDirection = orderDirection;
    setFilterState(newFilter);
  };

  useEffect(() => {
    let newLabel = label;
    newLabel = filterState.orderDirection === 'asc' ? RARITY_HIGH_LABEL : newLabel;
    newLabel = filterState.orderDirection === 'desc' ? RARITY_LOW_LABEL : newLabel;
    setLabel(newLabel);
  }, [filterState]);

  return (
    <span className="pointer-events-auto">
      <Dropdown
        label={label}
        items={[
          { label: RARITY_HIGH_LABEL, onClick: () => onClickSort('rarityRank', 'asc') },
          { label: RARITY_LOW_LABEL, onClick: () => onClickSort('rarityRank', 'desc') },
          // TODO: order by 'price' once it's supported by api.
          { label: PRICE_HIGH_LABEL, onClick: () => onClickSort('rarityRank', 'asc') },
          { label: PRICE_LOW_LABEL, onClick: () => onClickSort('rarityRank', 'desc') }
          // { label: 'Clear', onClick: () => onClickSort('desc') }
        ]}
        contentClassName="right-0 w-64"
      />
    </span>
  );
};
