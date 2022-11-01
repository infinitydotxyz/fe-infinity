import { OrderDirection } from '@infinityxyz/lib-frontend/types/core';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React from 'react';
import { Dropdown } from '../common';

export type SortButtonOrder = {
  orderBy: CuratedCollectionsOrderBy;
  direction: OrderDirection;
};

interface Props {
  order: SortButtonOrder;
  onClick: (order: { orderBy: CuratedCollectionsOrderBy; direction: OrderDirection }) => void;
}

export const Sort: React.FC<Props> = ({ onClick, order }) => {
  let label = 'Sort';

  switch (order.orderBy) {
    case CuratedCollectionsOrderBy.Votes:
      switch (order.direction) {
        case OrderDirection.Ascending:
          label = 'Most votes';
          break;
        case OrderDirection.Descending:
          label = 'Most votes';
          break;
      }
      break;
    case CuratedCollectionsOrderBy.Apr:
      switch (order.direction) {
        case OrderDirection.Ascending:
          label = 'APR: Low to high';
          break;
        case OrderDirection.Descending:
          label = 'APR: High to low';
          break;
      }
      break;
  }

  return (
    <Dropdown
      alignMenuRight={true}
      label={label}
      className="pointer-events-auto ml-4 cursor-pointer"
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
};
