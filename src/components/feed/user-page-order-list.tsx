import { useEffect, useState } from 'react';
import { UserPageOrderListItem } from './user-page-order-list-item';
import { apiGet, extractErrorMsg, ITEMS_PER_PAGE, ellipsisAddress } from 'src/utils';
import { Button, CenteredContent, ScrollLoader, Spinner, toastError, toastInfo, toastSuccess } from '../common';
import { UserProfileDto } from '../user/user-profile-dto';
import { CancelDrawer } from 'src/components/market/order-drawer/cancel-drawer';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import {
  DEFAULT_ORDER_TYPE_FILTER,
  UserOrderFilter,
  UserProfileOrderFilterPanel
} from '../filter/user-profile-order-filter-panel';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { cancelAllOrders } from 'src/utils/exchange/orders';
import { useAppContext } from 'src/utils/context/AppContext';
import { fetchOrderNonce } from 'src/utils/marketUtils';
import { useDrawerContext } from 'src/utils/context/DrawerContext';
import { AcceptOfferDrawer } from '../market/order-drawer/accept-offer-drawer';

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

interface Props {
  userInfo: UserProfileDto;
  className?: string;
}

export const UserPageOrderList = ({ userInfo, className = '' }: Props) => {
  const { providerManager, chainId, user, waitForTransaction } = useAppContext();
  const { orderDrawerOpen, setOrderDrawerOpen } = useOrderContext();
  const { setCartItemCount, hasOrderDrawer } = useDrawerContext();
  const [data, setData] = useState<SignedOBOrder[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterShowed, setFilterShowed] = useState(true);
  const [isCancellingAll, setIsCancellingAll] = useState(false);
  const [apiFilter, setApiFilter] = useState<UserOrderFilter>({ orderType: DEFAULT_ORDER_TYPE_FILTER });
  const [showAcceptOfferDrawer, setShowAcceptOfferDrawer] = useState(false);
  const [showCancelDrawer, setShowCancelDrawer] = useState(false);

  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<SignedOBOrder[]>([]);

  useEffect(() => {
    if (orderDrawerOpen && !hasOrderDrawer()) {
      if (apiFilter.orderType === 'offers-received') {
        setShowAcceptOfferDrawer(true);
      } else {
        setShowCancelDrawer(true);
      }
    }
  }, [orderDrawerOpen]);

  useEffect(() => {
    if (apiFilter.orderType === 'offers-received') {
      setCartItemCount(selectedOffers.length);
    } else {
      setCartItemCount(selectedOrders.length);
    }
  }, [apiFilter, selectedOrders, selectedOffers]);

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
      maxPrice: apiFilter.maxPrice,
      numItems: apiFilter.numItems,
      collections: apiFilter.collections
    };

    if (apiFilter.orderType === 'listings') {
      query.makerAddress = userInfo.address;
      query.isSellOrder = true;
    } else if (apiFilter.orderType === 'offers-made') {
      query.makerAddress = userInfo.address;
      query.isSellOrder = false;
    } else if (apiFilter.orderType === 'offers-received') {
      query.takerAddress = userInfo.address;
      query.isSellOrder = false;
    } else {
      query.takerAddress = userInfo.address;
      query.makerAddress = userInfo.address;
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

  const listItemButtonClick = (order: SignedOBOrder, checked: boolean) => {
    if (apiFilter.orderType === 'offers-received') {
      if (checked) {
        const exists = selectedOffers.findIndex((o) => o.id === order.id) !== -1;
        if (!exists) {
          const arr = [...selectedOffers, order];
          setSelectedOffers(arr);

          if (arr.length === 1) {
            setShowAcceptOfferDrawer(true);
          }
        }
      } else {
        const arr = selectedOffers.filter((o) => o.id !== order.id);
        setSelectedOffers(arr);

        if (arr.length === 0) {
          setShowAcceptOfferDrawer(false);
        }
      }
    } else {
      if (checked) {
        const arr = [...selectedOrders, order];
        setSelectedOrders(arr);

        if (arr.length === 1) {
          setShowCancelDrawer(true);
        }
      } else {
        const arr = selectedOrders.filter((o) => o.id !== order.id);
        setSelectedOrders(arr);

        if (arr.length === 0) {
          setShowCancelDrawer(false);
        }
      }
    }
  };

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
          disabled={isCancellingAll}
          onClick={async () => {
            try {
              const signer = providerManager?.getEthersProvider().getSigner();

              if (signer && user) {
                setIsCancellingAll(true);
                const minOrderNonce = await fetchOrderNonce(user.address);
                const { hash } = await cancelAllOrders(signer, chainId, minOrderNonce);
                setIsCancellingAll(false);
                toastSuccess('Sent txn to chain for execution');
                waitForTransaction(hash, () => {
                  toastInfo(`Transaction confirmed ${ellipsisAddress(hash)}`);
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
                onClickActionBtn={listItemButtonClick}
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

      <AcceptOfferDrawer
        orders={selectedOffers}
        open={showAcceptOfferDrawer}
        onClose={() => {
          setShowAcceptOfferDrawer(false);
          setOrderDrawerOpen(false);
        }}
        onClickRemove={(removingOrder) => {
          const arr = selectedOffers.filter((o) => o.id !== removingOrder.id);
          setSelectedOffers(arr);

          if (arr.length === 0) {
            setShowAcceptOfferDrawer(false);
            setOrderDrawerOpen(false);
          }
        }}
      />

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
