import { useState } from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import moment from 'moment';
import { EthPrice } from 'src/components/common';
import { ellipsisAddress, numStr, shortDate } from 'src/utils';
import { getOrderType } from 'src/utils/orderbookUtils';
import { DataColumn, defaultDataColumns } from './data-columns';
import { OrderbookItem } from './orderbook-item';
import { OrderDetailModal } from '../OrderDetailModal';
import { OrderbookRowButton } from './orderbook-row-button';
import { twMerge } from 'tailwind-merge';
import { secondaryBgColor } from 'src/utils/ui-constants';

type Props = {
  order: SignedOBOrder;
};

export const OrderbookRow = ({ order }: Props) => {
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
          <div className="flex truncate flex-row items-center" title={value}>
            {value ? <div className="truncate font-bold">{value}</div> : <div>---</div>}
          </div>
        );
      case 'Currency':
        return (
          <div className="flex flex-row items-center">
            <EthPrice label={value} labelClassName="font-bold" />
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
    <div className={twMerge(secondaryBgColor, 'rounded-3xl mb-3 px-8 py-6 w-full')}>
      {/* for larger screen - show row summary: */}
      <div className="items-center w-full hidden lg:grid" style={{ gridTemplateColumns: gridTemplate }}>
        {defaultDataColumns(order).map((data) => {
          const content = valueDiv(data);

          const title = data.name;

          if (data.field === 'buyOrSell') {
            return (
              <div key={`${order.id} ${data.field}`}>
                <OrderbookRowButton order={order} />
              </div>
            );
          }

          if (data.name === 'From' || data.name === 'Date') {
            return null;
          }

          return (
            <OrderbookItem
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
                labelClassName="font-bold"
              />
            </div>
            <div># NFTs: {numStr(order.numItems.toString())}</div>
          </div>
        </div>
        <div className="text-right">
          <OrderbookRowButton order={order} />

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
