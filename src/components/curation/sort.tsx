import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React from 'react';
import { Dropdown } from '../common';

type Props = {
  onClick: (orderBy: CuratedCollectionsOrderBy) => void;
};

export const Sort: React.FC<Props> = ({ onClick }) => (
  <Dropdown
    label="Sort"
    className="pointer-events-auto ml-8 cursor-pointer"
    items={[
      {
        label: 'Most votes',
        onClick: () => onClick(CuratedCollectionsOrderBy.Votes)
      },
      {
        label: 'APR: High to low',
        onClick: () => onClick(CuratedCollectionsOrderBy.Apr)
      },
      {
        label: 'APR: Low to high',
        onClick: () => onClick(CuratedCollectionsOrderBy.Apr)
      }
    ]}
  />
);
