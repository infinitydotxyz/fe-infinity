import { OBOrderSpec } from '@infinityxyz/lib/types/core';
import { EthPrice } from 'src/components/common/eth-price';
import { numStr, shortDate } from 'src/utils';
import { DataColumn, defaultDataColumns } from './data-columns';
import { OrderbookItem } from './orderbook_item';

type Props3 = {
  order: OBOrderSpec;
};

export const OrderbookRow = ({ order }: Props3): JSX.Element => {
  const valueDiv = (dataColumn: DataColumn) => {
    let value = order.id;

    switch (dataColumn.field) {
      case 'name':
        break;
      case 'type':
        value = order.isSellOrder ? 'Sell' : 'Buy';
        break;
      case 'minSalePrice':
        value = order.startPrice.toString();
        break;
      case 'numNFTs':
        value = numStr(order.numItems.toString());
        break;
      case 'expirationDate':
        value = shortDate(new Date(parseInt(order.endTime.toString()) * 1000));
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
        return <></>;
    }
  };

  let gridTemplate = '';

  defaultDataColumns.forEach((data) => {
    gridTemplate += ` ${data.width}`;
  });

  return (
    <div className={'rounded-3xl mb-3 p-8 w-full bg-gray-100'}>
      <div className={'grid items-start relative w-full gap-5'} style={{ gridTemplateColumns: gridTemplate }}>
        {defaultDataColumns.map((data) => {
          const content = valueDiv(data);

          const title = data.name;

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
