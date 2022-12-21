import { useEffect, useState } from 'react';
import { UserPageOrderListItem } from './user-page-order-list-item';
import { apiGet, extractErrorMsg, ITEMS_PER_PAGE, ellipsisAddress } from 'src/utils';
import { CenteredContent, ScrollLoader, Spinner, toastError, toastInfo, toastSuccess } from '../common';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto/user';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import {
  DEFAULT_ORDER_TYPE_FILTER,
  UserOrderFilter,
  UserProfileOrderFilterPanel
} from '../filter/user-profile-order-filter-panel';
import { cancelAllOrders } from 'src/utils/exchange/orders';
import { fetchOrderNonce } from 'src/utils/orderbookUtils';
import { useDrawerContext } from 'src/utils/context/DrawerContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { twMerge } from 'tailwind-merge';
import { negativeMargin } from 'src/utils/ui-constants';
import { AOutlineButton } from '../astra';

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
  const { user, chainId, waitForTransaction, getSigner } = useOnboardContext();

  const { fulfillDrawerParams, cancelDrawerParams } = useDrawerContext();
  const [data, setData] = useState<SignedOBOrder[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [cursor, setCursor] = useState('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterShowed, setFilterShowed] = useState(true);
  const [isCancellingAll, setIsCancellingAll] = useState(false);
  const [apiFilter, setApiFilter] = useState<UserOrderFilter>({ orderType: DEFAULT_ORDER_TYPE_FILTER });

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

    const { result } = await apiGet(`/userOrders/${userInfo.address}`, {
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
        fulfillDrawerParams.addOrder(order);
        fulfillDrawerParams.setShowDrawer(true);
      } else {
        fulfillDrawerParams.removeOrder(order);
        // setShowDrawer(true);
      }
    } else {
      if (checked) {
        const arr = [...cancelDrawerParams.orders, order];
        cancelDrawerParams.setOrders(arr);

        if (arr.length === 1) {
          cancelDrawerParams.setShowDrawer(true);
        }
      } else {
        const arr = cancelDrawerParams.orders.filter((o) => o.id !== order.id);
        cancelDrawerParams.setOrders(arr);

        if (arr.length === 0) {
          cancelDrawerParams.setShowDrawer(false);
        }
      }
    }
  };

  return (
    <div className={twMerge('min-h-[50vh]', className, negativeMargin)}>
      <div className="flex gap-3 justify-end items-center mb-8 bg-transparent">
        <AOutlineButton
          disabled={isCancellingAll}
          onClick={async () => {
            try {
              const signer = getSigner();

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
        </AOutlineButton>

        <AOutlineButton
          onClick={() => {
            setFilterShowed((flag) => !flag);
          }}
          className="pointer-events-auto"
        >
          {filterShowed ? 'Hide' : 'Show'} filter
        </AOutlineButton>
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
    </div>
  );
};
