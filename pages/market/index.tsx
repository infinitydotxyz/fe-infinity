import { ToggleTab, useToggleTab, Spacer, PageBox } from 'src/components/common';
import { OrderDrawer } from 'src/components/market';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { OrderbookContainer } from 'src/components/market/orderbook-list';

const MarketPage = () => {
  const { orderDrawerOpen, setOrderDrawerOpen } = useOrderContext();
  const { options, onChange, selected } = useToggleTab(['Orderbook'], 'Orderbook');

  const contents = (
    <>
      <div className="flex space-x-2 items-center mb-2">
        <ToggleTab options={options} selected={selected} onChange={onChange} />
        <Spacer />
      </div>

      {selected === 'Orderbook' && <OrderbookContainer />}
    </>
  );

  return (
    <PageBox title="Market">
      <OrderDrawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} />

      <div>{contents}</div>
    </PageBox>
  );
};

export default MarketPage;
