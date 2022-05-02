import { Button, ToggleTab, useToggleTab, Spacer, Dropdown, PageBox } from 'src/components/common';
import { OrderDrawer } from 'src/components/market';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { FaShoppingBag } from 'react-icons/fa';
import { RiLayoutGridFill } from 'react-icons/ri';
import { OrderbookList } from 'src/components/market/orderbook-list';
import { OrderbookProvider } from 'src/components/market/OrderbookContext';

const MarketPage = () => {
  const { orderDrawerOpen, setOrderDrawerOpen, isOrderStateEmpty } = useOrderContext();
  const { options, onChange, selected } = useToggleTab(['Orderbook', 'Assets'], 'Orderbook');

  const contents = (
    <>
      <div className="flex space-x-2 items-center mb-2">
        <ToggleTab options={options} selected={selected} onChange={onChange} />
        <Spacer />
      </div>

      {selected === 'Assets' && (
        <>
          <div className="flex space-x-2 items-center mb-2">
            <Button variant="outline" className="font-heading">
              Filter
            </Button>
            <Dropdown
              label="Sort"
              items={[
                { label: 'High to low', onClick: console.log },
                { label: 'Low to high', onClick: console.log }
              ]}
            />
            <RiLayoutGridFill />
          </div>
        </>
      )}

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
