import { useEffect, useState } from 'react';
import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { UserPageOrderListItem } from './user-page-order-list-item';
import { apiGet, extractErrorMsg, ITEMS_PER_PAGE, ellipsisAddress } from 'src/utils';
import { Button, CenteredContent, ScrollLoader, Spinner, toastError, toastSuccess } from '../common';
import { UserProfileDto } from '../user/user-profile-dto';
import { CancelDrawer } from 'src/components/market/order-drawer/cancel-drawer';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { UserOrderFilter, UserProfileOrderFilterPanel } from '../filter/user-profile-order-filter-panel';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { useRouter } from 'next/router';
import { cancelAllOrders } from 'src/utils/exchange/orders';
import { useAppContext } from 'src/utils/context/AppContext';
import { fetchOrderNonce } from 'src/utils/marketUtils';

type Query = {
  limit: number;
  cursor: string;
  isSellOrder?: boolean;
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
  types?: EventType[];
  forActivity?: boolean;
  forUserActivity?: boolean;
  className?: string;
}

export const UserPageOrderList = ({ userInfo, className = '' }: UserPageOrderListProps) => {
  const router = useRouter();
  const { providerManager, chainId, user, waitForTransaction } = useAppContext();
  const { orderDrawerOpen, setOrderDrawerOpen, setCustomDrawerItems } = useOrderContext();
  const [data, setData] = useState<SignedOBOrder[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterShowed, setFilterShowed] = useState(false);
  const [apiFilter, setApiFilter] = useState<UserOrderFilter>({ orderType: 'listings' });
  const [showCancelDrawer, setShowCancelDrawer] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);

  useEffect(() => {
    const hasCustomDrawer = router.asPath.indexOf('tab=Orders') >= 0;
    if (hasCustomDrawer && orderDrawerOpen) {
      setShowCancelDrawer(true);
    }
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
      query.isSellOrder = true;
    } else if (apiFilter.orderType === 'offers-made') {
      query.makerAddress = userInfo.address;
      query.isSellOrder = false;
    } else {
      query.takerAddress = userInfo.address;
      query.isSellOrder = false;
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
        <Button
          variant="outline"
          className="py-2.5 mr-2 font-heading pointer-events-auto"
          onClick={async () => {
            try {
              const signer = providerManager?.getEthersProvider().getSigner();
              if (signer && user) {
                const minOrderNonce = await fetchOrderNonce(user.address);
                const { hash } = await cancelAllOrders(signer, chainId, minOrderNonce);
                toastSuccess('Transaction sent to chain');
                waitForTransaction(hash, () => {
                  toastSuccess(`Transaction confirmed ${ellipsisAddress(hash)}`);
                });
              } else {
                throw 'User is null';
              }
            } catch (err) {
              toastError(extractErrorMsg(err));
            }
          }}
        >
          Cancel all
        </Button>
      </div>

      <div className="flex items-start">
        {filterShowed && (
          <div className="mt-4">
            <UserProfileOrderFilterPanel userInfo={userInfo} onChange={(filter) => setApiFilter(filter)} />
          </div>
        )}

        <div className="w-full space-y-4 pointer-events-auto">
          {isFetching && (
            <div className="mt-8">
              <CenteredContent>
                <Spinner />
              </CenteredContent>
            </div>
          )}

          {!isFetching && hasNextPage === false && data?.length === 0 ? (
            <div className="font-heading">No results found</div>
          ) : null}

          {data?.map((order, idx) => {
            return (
              <UserPageOrderListItem
                key={idx}
                order={order}
                orderType={apiFilter.orderType}
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
                      setOrderDrawerOpen(false);
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
        </div>
      </div>

      <CancelDrawer
        orders={selectedOrders}
        open={showCancelDrawer}
        onClose={() => {
          setShowCancelDrawer(false);
          setOrderDrawerOpen(false);
        }}
        onClickRemove={(removingOrder) => {
          const arr = selectedOrders.filter((o) => o.id !== removingOrder.id);
          setSelectedOrders(arr);
          if (arr.length === 0) {
            setShowCancelDrawer(false);
            setOrderDrawerOpen(false);
          }
        }}
      />
    </div>
  );
};
