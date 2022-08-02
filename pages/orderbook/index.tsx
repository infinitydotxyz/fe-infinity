import { PageBox } from 'src/components/common';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';

const OrderbookPage = () => {
  return (
    <PageBox title="Orderbook">
      <OrderbookContainer />
    </PageBox>
  );
};

export default OrderbookPage;
