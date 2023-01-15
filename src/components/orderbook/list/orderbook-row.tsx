import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import moment from 'moment';
import { useState } from 'react';
import { EthPrice } from 'src/components/common';
import { ellipsisAddress, numStr, shortDate } from 'src/utils';
import { getOrderType } from 'src/utils/orderbookUtils';
import { standardBorderCard } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { OrderDetailModal } from '../OrderDetailModal';
import { DataColumn, defaultDataColumns } from './data-columns';
import { OrderbookItem } from './orderbook-item';

type Props = {
  order: SignedOBOrder;
  canShowAssetModal?: boolean;
};

export const OrderbookRow = ({ order, canShowAssetModal }: Props) => {
  const [selectedOrder, setSelectedOrder] = useState<SignedOBOrder | null>(null);

  const valueDiv = (dataColumn: DataColumn) => {
    let value = order.id;

    switch (dataColumn.field) {
      case 'name':
      case 'buyOrSell':
        break;
      case 'type':
        value = getOrderType(order);
        break;
      case 'makerUsername':
        value = order.makerUsername || ellipsisAddress(order.makerAddress);
        break;
      case 'minSalePrice':
        value = numStr(order.startPriceEth.toString());
        break;
      case 'maxBuyPrice':
        value = numStr(order.endPriceEth.toString());
        break;
      case 'numNFTs':
        value = numStr(order.numItems.toString());
        break;
      case 'expirationDate':
        value = shortDate(new Date(order.endTimeMs));
        break;
      case 'datePlaced':
        value = moment(order.startTimeMs).fromNow();
        break;
    }

    switch (dataColumn.type) {
      case 'Text':
        return (
          <div className={twMerge('flex truncate flex-row items-center')} title={value}>
            {value ? <div className="truncate">{value}</div> : <div>---</div>}
          </div>
        );
      case 'Currency':
        return (
          <div className="flex flex-row items-center">
            <EthPrice label={value} labelClassName="" />
          </div>
        );
      case 'Name':
      case 'Button':
    }
  };

  let gridTemplate = '';

  defaultDataColumns(order).forEach((data) => {
    if (data.name === 'From' || data.name === 'Date') {
      // isFilterOpen => don't show those columns.
    } else {
      gridTemplate += ` ${data.width}`;
    }
  });

  return (
    <div className={twMerge(standardBorderCard, 'w-full text-sm')}>
      {/* for larger screen - show row summary: */}
      <div className="items-center w-full hidden lg:grid" style={{ gridTemplateColumns: gridTemplate }}>
        {defaultDataColumns(order).map((data) => {
          const content = valueDiv(data);

          const title = data.name;

          // todo: fix this - do not remove comment
          if (data.field === 'buyOrSell') {
            return null;
            // <div key={`${order.id} ${data.field}`}>
            //   {/* <OrderbookRowButton order={order} /> */}
            // </div>
          }

          if (data.name === 'From' || data.name === 'Date') {
            return null;
          }

          return (
            <OrderbookItem
              canShowAssetModal={canShowAssetModal}
              nameItem={data.type === 'Name'}
              key={`${order.id} ${data.field}`}
              title={title}
              order={order}
              content={
                <span className={data.onClick ? 'cursor-pointer' : ''} onClick={data.onClick}>
                  {content}
                </span>
              }
              onClick={() => setSelectedOrder(order)}
            />
          );
        })}
      </div>

      {/* for smaller screen - show row summary: */}
      <div className="flex items-center w-full lg:hidden">
        <div className="flex flex-col w-full">
          <div className="mr-4">
            <OrderbookItem
              nameItem={true}
              key={`${order.id} ${order.chainId}`}
              order={order}
              onClick={() => setSelectedOrder(order)}
            />
          </div>
          <div className="flex flex-col">
            <div>{order.isSellOrder ? 'Listing' : 'Offer'}</div>
            <div className="flex flex-row items-center">
              <EthPrice
                label={
                  order.isSellOrder ? numStr(order.startPriceEth.toString()) : numStr(order.endPriceEth.toString())
                }
                labelClassName=""
              />
            </div>
          </div>
        </div>
        <div className="text-right">
          <div>{moment(order.startTimeMs).fromNow()}</div>
          <div>Expiry: {shortDate(new Date(order.endTimeMs))}</div>
        </div>
      </div>

      {selectedOrder !== null ? (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={true}
          onClose={() => {
            setSelectedOrder(null);
          }}
        />
      ) : null}
    </div>
  );
};
