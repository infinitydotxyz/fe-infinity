import { OrderDirection } from '@infinityxyz/lib-frontend/types/core';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React from 'react';
import { Dropdown } from '../common';

type Props = {
  onClick: (order: { orderBy: CuratedCollectionsOrderBy; direction: OrderDirection }) => void;
};

export const Sort: React.FC<Props> = ({ onClick }) => (
  <Dropdown
    alignMenuRight={true}
    label="Sort"
    className="pointer-events-auto ml-8 cursor-pointer"
    items={[
      {
        label: 'Most votes',
        onClick: () => onClick({ orderBy: CuratedCollectionsOrderBy.Votes, direction: OrderDirection.Descending })
      },
      {
        label: 'APR: High to low',
        onClick: () => onClick({ orderBy: CuratedCollectionsOrderBy.Apr, direction: OrderDirection.Descending })
      },
      {
        label: 'APR: Low to high',
        onClick: () => onClick({ orderBy: CuratedCollectionsOrderBy.Apr, direction: OrderDirection.Ascending })
      }
    ]}
  />
);
