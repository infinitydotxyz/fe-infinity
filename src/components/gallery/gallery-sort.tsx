import { useEffect, useState } from 'react';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { Dropdown } from '../common';

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
    newLabel = filterState.orderDirection === 'asc' ? 'High Rarity Rank to Low' : newLabel;
    newLabel = filterState.orderDirection === 'desc' ? 'Low Rarity Rank to High' : newLabel;
    setLabel(newLabel);
  }, [filterState]);

  return (
    <span className="mr-40">
      <Dropdown
        label={label}
        items={[
          { label: 'High Rarity Rank to Low', onClick: () => onClickSort('asc') },
          { label: 'Low Rarity Rank to High', onClick: () => onClickSort('desc') },
          { label: 'Clear', onClick: () => onClickSort('desc') }
        ]}
      />
    </span>
  );
};
