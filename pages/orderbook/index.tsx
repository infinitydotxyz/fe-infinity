import { PageBox } from 'src/components/common';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';

const OrderbookPage = () => {
  const contents = <OrderbookContainer />;

  return (
    <PageBox title="Orderbook">
      <div>{contents}</div>
    </PageBox>
  );
};

export default OrderbookPage;
