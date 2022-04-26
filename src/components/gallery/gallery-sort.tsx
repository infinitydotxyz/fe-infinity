import { useEffect, useState } from 'react';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { Dropdown } from 'src/components/common';

const RARITY_HIGH_LABEL = 'Rarity high';
const RARITY_LOW_LABEL = 'Rarity low';

export const GallerySort = () => {
  const { filterState, setFilterState } = useFilterContext();
  const [label, setLabel] = useState('Sort');

  const onClickSort = (orderDirection: 'asc' | 'desc' | '') => {
    const newFilter = { ...filterState };
    newFilter.orderBy = 'rarityRank';
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
    <span>
      <Dropdown
        label={label}
        items={[
          { label: RARITY_HIGH_LABEL, onClick: () => onClickSort('asc') },
          { label: RARITY_LOW_LABEL, onClick: () => onClickSort('desc') }
          // { label: 'Clear', onClick: () => onClickSort('desc') }
        ]}
        contentClassName="right-0"
      />
    </span>
  );
};
