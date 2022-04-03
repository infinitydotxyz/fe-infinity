import { formatEther } from 'ethers/lib/utils';
import { EthPrice } from 'src/components/common/eth-price';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { bigNumToDate } from 'src/utils/marketUtils';
import { OrderListItem } from './order-list-item';
import { SimpleTable, SimpleTableItem } from './simple-table';

export function OrderSummary() {
  const { isSellOrder, buyCartItems, sellCartItems, order } = useOrderContext();

  const list = (
    <ul role="list" className="  divide-y divide-gray-200 overflow-y-auto">
      {buyCartItems.map((item) => (
        <OrderListItem key={item.tokenName} cartItem={item} allowDelete={false} />
      ))}

      {sellCartItems.map((item) => (
        <OrderListItem key={item.tokenName} cartItem={item} allowDelete={false} />
      ))}
    </ul>
  );

  const items: SimpleTableItem[] = [];
  let header;

  if (isSellOrder()) {
    items.push({
      title: 'Max spending',
      value: <EthPrice label={formatEther(order?.endPrice ?? 0)} />
    });
    items.push({ title: 'Min NFTs to buy', value: <div>{order?.numItems}</div> });
    items.push({ title: 'Start Date', value: <div>{bigNumToDate(order?.startTime ?? 0).toLocaleString()}</div> });
    items.push({ title: 'Expiration Date', value: <div>{bigNumToDate(order?.endTime ?? 0).toLocaleString()}</div> });

    header = (
      <div>
        <div>Sell Order</div>
      </div>
    );
  } else {
    items.push({
      title: 'Max spending',
      value: <EthPrice label={formatEther(order?.endPrice ?? 0)} />
    });
    items.push({ title: 'Min NFTs to buy', value: <div>{order?.numItems}</div> });
    items.push({ title: 'Start Date', value: <div>{bigNumToDate(order?.startTime ?? 0).toLocaleString()}</div> });
    items.push({ title: 'Expiration Date', value: <div>{bigNumToDate(order?.endTime ?? 0).toLocaleString()}</div> });

    header = (
      <div>
        <div>Buy Order</div>
      </div>
    );
  }

  return (
    <>
      {list}
      {header}
      <SimpleTable items={items} />
    </>
  );
}
