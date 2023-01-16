import React from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { CenteredContent, CenterFixed, ScrollLoader, Spinner } from 'src/components/common';
import { OrderbookRow } from './orderbook-row';

interface Props2 {
  orderList: SignedOBOrder[];
  isLoading: boolean;
  fetchMore: () => void;
  hasMoreOrders?: boolean;
  hasNoData?: boolean;
  canShowAssetModal?: boolean;
}

export const OrderbookList = ({
  orderList,
  isLoading,
  fetchMore,
  hasMoreOrders,
  hasNoData,
  canShowAssetModal
}: Props2): JSX.Element => {
  return (
    <div className="flex overflow-y-clip overflow-x-clip">
      <div className="flex flex-col items-start w-full h-full overflow-y-auto  ">
        {hasNoData && (
          <CenteredContent>
            <div className="text-sm mt-4">No Orders</div>
          </CenteredContent>
        )}

        {!isLoading &&
          orderList.length > 0 &&
          orderList.map((order: SignedOBOrder, i: number) => {
            return <OrderbookRow key={`${i}-${order.id}`} order={order} canShowAssetModal={canShowAssetModal} />;
          })}

        {isLoading && (
          <CenterFixed>
            <Spinner />
          </CenterFixed>
        )}

        {hasMoreOrders && <ScrollLoader onFetchMore={fetchMore} />}
      </div>
    </div>
  );
};
