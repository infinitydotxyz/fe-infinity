import { ToggleTab, useToggleTab, Spacer, PageBox } from 'src/components/common';
import { OrderbookContainer } from 'src/components/market/orderbook-list';

const MarketplacePage = () => {
  const { options, onChange, selected } = useToggleTab(['Orderbook', 'Buy', 'Sell'], 'Orderbook');

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
    <PageBox title="Marketplace">
      {/* <OrderDrawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} /> */}

      <div>{contents}</div>
    </PageBox>
  );
};

export default MarketplacePage;
