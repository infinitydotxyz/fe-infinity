import { Button, ToggleTab, useToggleTab, Spacer, PageBox } from 'src/components/common';
import { OrderDrawer } from 'src/components/market';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { FaShoppingBag } from 'react-icons/fa';
import { OrderbookList } from 'src/components/market/orderbook-list';
import { OrderbookProvider } from 'src/components/market/OrderbookContext';

const MarketPage = () => {
  const { orderDrawerOpen, setOrderDrawerOpen, isOrderStateEmpty } = useOrderContext();
  const { options, onChange, selected } = useToggleTab(['Orderbook'], 'Orderbook');

  const contents = (
    <>
      <div className="flex space-x-2 items-center mb-2">
        <ToggleTab options={options} selected={selected} onChange={onChange} />
        <Spacer />
      </div>

      {selected === 'Orderbook' && (
        <OrderbookProvider>
          <OrderbookList />
        </OrderbookProvider>
      )}
    </>
  );

  return (
    <PageBox
      title="Market"
      rightToolbar={
        <Button
          disabled={isOrderStateEmpty()}
          variant="outline"
          onClick={async () => {
            setOrderDrawerOpen(!orderDrawerOpen);
          }}
        >
          <FaShoppingBag />
        </Button>
      }
    >
      <OrderDrawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} />

      <div>{contents}</div>
    </PageBox>
  );
};

export default MarketPage;
