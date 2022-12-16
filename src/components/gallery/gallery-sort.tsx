import { useEffect, useState } from 'react';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { ADropdown } from '../astra/astra-dropdown';

const SORT_BY_TOKEN_ID = 'Token Id';
const SORT_BY_RARITY_HIGH_LABEL = 'Rarity: High to low';
const SORT_BY_RARITY_LOW_LABEL = 'Rarity: Low to high';
const SORT_BY_PRICE_HIGH_LABEL = 'Price: High to low';
const SORT_BY_PRICE_LOW_LABEL = 'Price: Low to high';

export const GallerySort = () => {
  const { filterState, setFilterState } = useFilterContext();
  const [label, setLabel] = useState('Sort');

  const onClickSort = (orderBy: 'rarityRank' | 'price' | 'tokenIdNumeric', orderDirection: 'asc' | 'desc') => {
    const newFilter = { ...filterState };
    newFilter.orderBy = orderBy;
    newFilter.orderDirection = orderDirection;
    setFilterState(newFilter);
  };

  useEffect(() => {
    let newLabel = label;
    newLabel = filterState.orderBy === 'tokenIdNumeric' ? SORT_BY_TOKEN_ID : newLabel;
    newLabel =
      filterState.orderBy === 'rarityRank' && filterState.orderDirection === 'asc'
        ? SORT_BY_RARITY_HIGH_LABEL
        : newLabel;
    newLabel =
      filterState.orderBy === 'rarityRank' && filterState.orderDirection === 'desc'
        ? SORT_BY_RARITY_LOW_LABEL
        : newLabel;
    newLabel =
      filterState.orderBy === 'price' && filterState.orderDirection === 'desc' ? SORT_BY_PRICE_HIGH_LABEL : newLabel;
    newLabel =
      filterState.orderBy === 'price' && filterState.orderDirection === 'asc' ? SORT_BY_PRICE_LOW_LABEL : newLabel;
    setLabel(newLabel);
  }, [filterState]);

  return (
    <div className="pointer-events-auto">
      <ADropdown
        alignMenuRight={true}
        label={label}
        items={[
          { label: SORT_BY_TOKEN_ID, onClick: () => onClickSort('tokenIdNumeric', 'asc') },
          // { label: SORT_BY_RARITY_HIGH_LABEL, onClick: () => onClickSort('rarityRank', 'asc') },
          // { label: SORT_BY_RARITY_LOW_LABEL, onClick: () => onClickSort('rarityRank', 'desc') },
          { label: SORT_BY_PRICE_HIGH_LABEL, onClick: () => onClickSort('price', 'desc') },
          { label: SORT_BY_PRICE_LOW_LABEL, onClick: () => onClickSort('price', 'asc') }
          // { label: 'Clear', onClick: () => onClickSort('desc') }
        ]}
      />
    </div>
  );
};
