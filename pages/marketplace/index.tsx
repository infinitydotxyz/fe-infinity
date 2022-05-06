import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { ToggleTab, useToggleTab, Spacer, PageBox, CollectionGrid, TextInputBox } from 'src/components/common';
import { OrderbookContainer } from 'src/components/market/orderbook-list';

const MarketplacePage = () => {
  const { options, onChange, selected } = useToggleTab(['Orderbook', 'Buy', 'Sell'], 'Orderbook');

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleChange = async (value: string) => {
    setQuery(value);
    setQueryDebounced(value);
  };

  // must use useCallback or it doesn't work
  const setQueryDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
    }, 300),
    []
  );
  const contents = (
    <>
      <div className="flex space-x-2 items-center mb-2">
        <ToggleTab options={options} selected={selected} onChange={onChange} />
        <Spacer />
      </div>

      {selected === 'Orderbook' && <OrderbookContainer />}

      {selected === 'Buy' && (
        <div className="mt-12">
          <div className="mb-4">
            <TextInputBox
              type="text"
              value={query}
              label="Search for a Collection"
              placeholder=""
              onChange={(value) => handleChange(value)}
            />
          </div>
          <CollectionGrid query={debouncedQuery} routerQuery="tab=Orderbook&orderTypes=Listing" />
        </div>
      )}
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
