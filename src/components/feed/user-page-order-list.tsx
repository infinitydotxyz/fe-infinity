import { useEffect, useState } from 'react';
import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { FeedEventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { FeedFilterDropdown } from './feed-filter-dropdown';
import { UserPageOrderListItem } from './user-page-order-list-item';
import { apiGet, ITEMS_PER_PAGE } from 'src/utils';
import { ScrollLoader, Spinner } from '../common';
import { UserProfileDto } from '../user/user-profile-dto';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';

interface UserPageOrderListProps {
  userInfo: UserProfileDto;
  userAddress?: string;
  types?: FeedEventType[];
  forActivity?: boolean;
  forUserActivity?: boolean;
  className?: string;
}

export const UserPageOrderList = ({ userInfo, userAddress, types, className }: UserPageOrderListProps) => {
  const [filter, setFilter] = useState<FeedFilter>({ userAddress, types });
  const [filteringTypes, setFilteringTypes] = useState<FeedEventType[]>([]);
  const [data, setData] = useState<SignedOBOrder[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchData = async (isRefresh = false) => {
    setIsFetching(true);
    let newCursor = cursor;
    if (isRefresh) {
      newCursor = '';
    }

    const { result } = await apiGet(`/orders/${userInfo.address}`, {
      query: {
        limit: ITEMS_PER_PAGE,
        cursor: newCursor,
        events: filteringTypes,
        makerAddress: userInfo.address
      },
      requiresAuth: true
    });

    if (result?.hasNextPage === true) {
      setCursor(result?.cursor);
    }
    setHasNextPage(result?.hasNextPage);

    const moreData: SignedOBOrder[] = [];
    result?.data?.map((item: SignedOBOrder) => {
      moreData.push(item);
    });

    setIsFetching(false);
    if (isRefresh) {
      setData([...moreData]);
    } else {
      setData([...data, ...moreData]);
    }
  };

  useEffect(() => {
    setData([]);
    fetchData(true);
  }, [filter]);

  const onChangeFilterDropdown = (checked: boolean, checkId: string) => {
    const newFilter = { ...filter };

    if (checkId === '') {
      setFilteringTypes([]);
      delete newFilter.types;
      setFilter(newFilter);
      return;
    }
    const selectedType = checkId as FeedEventType;
    if (checked) {
      newFilter.types = [...filteringTypes, selectedType];
      setFilter(newFilter);
      setFilteringTypes(newFilter.types);
    } else {
      const _newTypes = [...filteringTypes];
      const index = filteringTypes.indexOf(selectedType);
      if (index >= 0) {
        _newTypes.splice(index, 1);
      }
      newFilter.types = _newTypes;
      setFilter(newFilter);
      setFilteringTypes(_newTypes);
    }
  };

  return (
    <div className={`min-h-[1024px] mt-[-66px] ${className}`}>
      <div className="flex flex-row-reverse mb-8 bg-transparent">
        <FeedFilterDropdown
          selectedTypes={filteringTypes}
          onChange={onChangeFilterDropdown}
          options={[
            {
              label: 'All',
              value: ''
            },
            {
              label: 'Listings',
              value: 'listing'
            },
            {
              label: 'Offers',
              value: 'offer'
            },
            {
              label: 'Sales',
              value: 'sale'
            }
          ]}
        />
      </div>

      <ul className="space-y-4 pointer-events-auto">
        {isFetching && <Spinner />}

        {!isFetching && hasNextPage === false && data?.length === 0 ? <div>No results found.</div> : null}

        {data?.map((event, idx) => {
          return <UserPageOrderListItem key={idx} event={event} />;
        })}

        {hasNextPage === true ? (
          <ScrollLoader
            onFetchMore={async () => {
              await fetchData();
            }}
          />
        ) : null}
      </ul>
    </div>
  );
};
