import { OBOrder } from '@infinityxyz/lib/types/core';
import moment from 'moment';
import { Button, EthPrice } from 'src/components/common';
import { ellipsisAddress, numStr, shortDate } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { DataColumn, defaultDataColumns } from './data-columns';
import { OrderbookItem } from './orderbook-item';

type OrderbookRowProps = {
  order: OBOrder;
};

export const OrderbookRow = ({ order }: OrderbookRowProps): JSX.Element => {
  const { checkSignedIn } = useAppContext();

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
          <div className="flex truncate flex-row items-center">
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
    gridTemplate += ` ${data.width}`;
  });

  const onClickBuySell = (order: OBOrder) => {
    if (!checkSignedIn()) {
      return;
    }
    alert('Fulfilling this order: ' + JSON.stringify(order));
    // todo: fullfill order
  };

  return (
    <div className="rounded-3xl mb-3 p-8 w-full bg-gray-100">
      <div className="items-center w-full hidden lg:grid" style={{ gridTemplateColumns: gridTemplate }}>
        {defaultDataColumns(order).map((data) => {
          const content = valueDiv(data);

          const title = data.name;

          if (data.field === 'buyOrSell') {
            return (
              <Button className="font-heading" key={`${order.id} ${data.field}`} onClick={() => onClickBuySell(order)}>
                {order.isSellOrder ? 'Buy' : 'Sell'}
              </Button>
            );
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
            />
          );
        })}
      </div>

      <div className="flex items-center w-full lg:hidden">
        <div className="flex flex-col w-full">
          <div className="mr-4">
            <OrderbookItem nameItem={true} key={`${order.id} ${order.chainId}`} order={order} />
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
            <div>NFT amount: {numStr(order.numItems.toString())}</div>
          </div>
        </div>
        <div className="text-right">
          <Button className="font-heading">{order.isSellOrder ? 'Buy' : 'Sell'}</Button>

          <div>{moment(order.startTimeMs).fromNow()}</div>
          <div>Expiring: {shortDate(new Date(order.endTimeMs))}</div>
        </div>
      </div>
    </div>
  );
};
