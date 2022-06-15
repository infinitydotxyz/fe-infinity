import { useEffect, useState } from 'react';
// import { FeedFilter } from 'src/utils/firestore/firestoreUtils';
import { FeedEventType } from '@infinityxyz/lib-frontend/types/core/feed';
// import { FeedFilterDropdown } from './feed-filter-dropdown';
import { UserPageOrderListItem } from './user-page-order-list-item';
import { apiGet, ITEMS_PER_PAGE } from 'src/utils';
import { Button, ScrollLoader, Spinner } from '../common';
import { UserProfileDto } from '../user/user-profile-dto';
import { CancelDrawer } from 'src/components/market/order-drawer/cancel-drawer';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { UserOrderFilter, UserProfileOrderFilterPanel } from '../filter/user-profile-order-filter-panel';
import { useOrderContext } from 'src/utils/context/OrderContext';

type Query = {
  limit: number;
  cursor: string;
  makerAddress?: string;
  takerAddress?: string;
  minPrice?: string;
  maxPrice?: string;
  numItems?: string;
  collections?: string[];
};

interface UserPageOrderListProps {
  userInfo: UserProfileDto;
  userAddress?: string;
  types?: FeedEventType[];
  forActivity?: boolean;
  forUserActivity?: boolean;
  className?: string;
}

export const UserPageOrderList = ({ userInfo, className }: UserPageOrderListProps) => {
  const { orderDrawerOpen, setCustomDrawerItems } = useOrderContext();
  // const [filter, setFilter] = useState<FeedFilter>({ userAddress, types });
  // const [filteringTypes, setFilteringTypes] = useState<FeedEventType[]>([]);
  const [data, setData] = useState<SignedOBOrder[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterShowed, setFilterShowed] = useState(false);
  const [apiFilter, setApiFilter] = useState<UserOrderFilter>({ orderType: 'listings' });
  const [showCancelDrawer, setShowCancelDrawer] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);

  useEffect(() => {
    setShowCancelDrawer(true);
  }, [orderDrawerOpen]);

  useEffect(() => {
    setCustomDrawerItems(selectedOrders.length);
  }, [selectedOrders]);

  const fetchData = async (isRefresh = false) => {
    setIsFetching(true);
    let newCursor = cursor;
    if (isRefresh) {
      newCursor = '';
    }

    const query: Query = {
      limit: ITEMS_PER_PAGE,
      cursor: newCursor,
      minPrice: apiFilter.minPrice,
      maxPrice: apiFilter.minPrice,
      numItems: apiFilter.numItems,
      collections: apiFilter.collections
    };
    if (apiFilter.orderType === 'listings') {
      query.makerAddress = userInfo.address;
    } else {
      query.takerAddress = userInfo.address;
    }
    const { result } = await apiGet(`/orders/${userInfo.address}`, {
      query,
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
  }, [apiFilter]);

  // const onChangeFilterDropdown = (checked: boolean, checkId: string) => {
  //   const newFilter = { ...filter };

  //   if (checkId === '') {
  //     setFilteringTypes([]);
  //     delete newFilter.types;
  //     setFilter(newFilter);
  //     return;
  //   }
  //   const selectedType = checkId as FeedEventType;
  //   if (checked) {
  //     newFilter.types = [...filteringTypes, selectedType];
  //     setFilter(newFilter);
  //     setFilteringTypes(newFilter.types);
  //   } else {
  //     const _newTypes = [...filteringTypes];
  //     const index = filteringTypes.indexOf(selectedType);
  //     if (index >= 0) {
  //       _newTypes.splice(index, 1);
  //     }
  //     newFilter.types = _newTypes;
  //     setFilter(newFilter);
  //     setFilteringTypes(_newTypes);
  //   }
  // };
  // console.log('onChangeFilterDropdown', onChangeFilterDropdown);

  return (
    <div className={`min-h-[1024px] mt-[-75px] ${className}`}>
      <div className="flex flex-row-reverse mb-8 bg-transparent">
        <Button
          variant="outline"
          onClick={() => {
            setFilterShowed((flag) => !flag);
          }}
          className="py-2.5 mr-2 font-heading pointer-events-auto"
        >
          {filterShowed ? 'Hide' : 'Show'} filter
        </Button>
      </div>

      <div className="flex items-start">
        {filterShowed && (
          <div className="mt-4">
            <UserProfileOrderFilterPanel userInfo={userInfo} onChange={(filter) => setApiFilter(filter)} />
          </div>
        )}

        <ul className="w-full space-y-4 pointer-events-auto">
          {isFetching && <Spinner />}

          {!isFetching && hasNextPage === false && data?.length === 0 ? <div>No results found.</div> : null}

          {data?.map((order, idx) => {
            return (
              <UserPageOrderListItem
                key={idx}
                order={order}
                userInfo={userInfo}
                onClickCancel={(clickedOrder, isCancelling) => {
                  if (isCancelling) {
                    const arr = [...selectedOrders, clickedOrder];
                    setSelectedOrders(arr);
                    if (arr.length === 1) {
                      setShowCancelDrawer(true);
                    }
                  } else {
                    const arr = selectedOrders.filter((o) => o.id !== clickedOrder.id);
                    setSelectedOrders(arr);
                    if (arr.length === 0) {
                      setShowCancelDrawer(false);
                    }
                  }
                }}
              />
            );
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

      <CancelDrawer
        orders={selectedOrders}
        open={showCancelDrawer}
        onClose={() => setShowCancelDrawer(false)}
        onClickRemove={(removingOrder) => {
          const arr = selectedOrders.filter((o) => o.id !== removingOrder.id);
          setSelectedOrders(arr);
          if (arr.length === 0) {
            setShowCancelDrawer(false);
          }
        }}
      />
    </div>
  );
};
