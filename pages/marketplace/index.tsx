import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { ToggleTab, useToggleTab, Spacer, PageBox, CollectionGrid, TextInputBox } from 'src/components/common';
import { OrderbookContainer } from 'src/components/market/orderbook-list';

const MarketplacePage = () => {
  const router = useRouter();

  // Checks the url for the 'tab' query parameter. If it doesn't exist, default to Orderbook
  const tabDefault = router.query.tab && typeof router.query.tab === 'string' ? router.query.tab : 'Orderbook';

  const { options, onChange, selected } = useToggleTab(['Orderbook', 'Buy', 'Sell'], tabDefault);

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
      <div className="flex space-x-2 items-center relative max-w-xl lg:top-12 lg:-mt-12 pb-4 lg:pb-0">
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

      {selected === 'Sell' && <div>sale</div>}
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
