import { OBOrder } from '@infinityxyz/lib/types/core';
import moment from 'moment';
import { Button, EthPrice } from 'src/components/common';
import { numStr, shortDate } from 'src/utils';
import { DataColumn, defaultDataColumns } from './data-columns';
import { OrderbookItem } from './orderbook_item';

type OrderbookRowProps = {
  order: OBOrder;
};

export const OrderbookRow = ({ order }: OrderbookRowProps): JSX.Element => {
  const valueDiv = (dataColumn: DataColumn) => {
    let value = order.id;

    switch (dataColumn.field) {
      case 'name':
      case 'buyOrSell':
        break;
      case 'type':
        value = order.isSellOrder ? 'Listing' : 'Offer';
        break;
      case 'makerUsername':
        value = order.makerUsername || order.makerAddress;
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
          <div className="flex truncate flex-row items-center">
            {value ? <div className="truncate font-bold">{value}</div> : <div>---</div>}
          </div>
        );
        break;
      case 'Currency':
        return (
          <div className="flex flex-row items-center">
            <EthPrice label={value} labelClassName="font-bold" />
          </div>
        );
      case 'Name':
      case 'Button':
        return <></>;
    }
  };

  let gridTemplate = '';

  defaultDataColumns(order).forEach((data) => {
    gridTemplate += ` ${data.width}`;
  });

  return (
    <div className={'rounded-3xl mb-3 p-8 w-full bg-gray-100'}>
      <div className={'grid items-start relative w-full gap-5'} style={{ gridTemplateColumns: gridTemplate }}>
        {defaultDataColumns(order).map((data) => {
          const content = valueDiv(data);

          const title = data.name;

          if (data.field === 'buyOrSell') {
            return <Button>{order.isSellOrder ? 'Buy' : 'Sell'}</Button>;
          }

          return (
            <OrderbookItem
              nameItem={data.type === 'Name'}
              key={`${order.id} ${data.field}`}
              title={title}
              order={order}
              content={content}
            />
          );
        })}
      </div>
    </div>
  );
};
