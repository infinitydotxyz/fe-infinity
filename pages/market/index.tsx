import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { ToggleTab, useToggleTab, Spacer, PageBox, CollectionGrid, TextInputBox } from 'src/components/common';
import { OrderbookContainer } from 'src/components/market/orderbook-list';

const enum TABS {
  Orders = 'Orders',
  Discover = 'Discover',
  ListMyNFTs = 'List NFTs'
}

const MarketplacePage = () => {
  const router = useRouter();

  // Checks the url for the 'tab' query parameter. If it doesn't exist, default to Orderbook
  const tabDefault = router.query.tab && typeof router.query.tab === 'string' ? router.query.tab : TABS.Orders;

  const { options, onChange, selected } = useToggleTab([TABS.Orders, TABS.Discover, TABS.ListMyNFTs], tabDefault);

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

      {selected === TABS.Orders && <OrderbookContainer />}

      {selected === TABS.Discover && (
        <div className="mt-16">
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

      {selected === TABS.ListMyNFTs && <div className="mt-24">List NFTs</div>}
    </>
  );

  return (
    <PageBox title="Market">
      {/* <OrderDrawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} /> */}

      <div>{contents}</div>
    </PageBox>
  );
};

export default MarketplacePage;
