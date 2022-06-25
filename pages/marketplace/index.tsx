// import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useState } from 'react';
// import { FiSearch } from 'react-icons/fi';
import { ToggleTab, useToggleTab, Spacer, PageBox, Button } from 'src/components/common';
import { DiscoverCollectionGrid } from 'src/components/common/discover-collection-grid';
import { OrderbookContainer } from 'src/components/market/orderbook-list';
import { UserPageNftsTab } from 'src/components/user/user-page-nfts-tab';
import { UserProfileDto } from 'src/components/user/user-profile-dto';
import { useAppContext } from 'src/utils/context/AppContext';

const enum TABS {
  Orders = 'Orders',
  Discover = 'Discover',
  ListMyNFTs = 'List NFTs'
}

export type DiscoverOrderBy = 'twitterFollowersPercentChange' | 'volumePercentChange' | 'avgPricePercentChange';

const MarketplacePage = () => {
  const { user } = useAppContext();
  const router = useRouter();

  // Checks the url for the 'tab' query parameter. If it doesn't exist, default to Orderbook
  const tabDefault = router.query.tab && typeof router.query.tab === 'string' ? router.query.tab : TABS.Orders;

  const { options, onChange, selected } = useToggleTab([TABS.Orders, TABS.Discover, TABS.ListMyNFTs], tabDefault);
  const [orderBy, setOrderBy] = useState<DiscoverOrderBy>('twitterFollowersPercentChange');

  // const [searchActive, setSearchActive] = useState(false);
  // const [query, setQuery] = useState('');
  // const [debouncedQuery, setDebouncedQuery] = useState('');

  // const handleChange = async (value: string) => {
  //   setQuery(value);
  //   setQueryDebounced(value);
  // };

  // must use useCallback or it doesn't work
  // const setQueryDebounced = useCallback(
  //   debounce((value: string) => {
  //     setDebouncedQuery(value);
  //   }, 300),
  //   []
  // );
  const contents = (
    <>
      <div className="flex space-x-2 items-center relative max-w-xl lg:top-12 lg:-mt-14 pb-4 lg:pb-0">
        <ToggleTab
          tabWidth="150px"
          className="font-heading"
          options={options}
          selected={selected}
          onChange={onChange}
        />
        <Spacer />
      </div>

      {selected === TABS.Orders && <OrderbookContainer />}

      {selected === TABS.Discover && (
        <div className="">
          <div className="mb-8 w-full flex flex-row-reverse">
            {/* <TextInputBox
              type="text"
              value={query}
              label=""
              placeholder=""
              className="w-64 pl-4"
              inputClassName="font-normal font-body text-sm"
              icon={<FiSearch className="mr-2" />}
              onChange={(value) => handleChange(value)}
            /> */}
            <div className="space-x-2">
              {/* todo: volumePercentChange is mising in many collections */}
              {/* <Button
                variant={orderBy === 'volumePercentChange' ? 'primary' : 'outline'}
                className="font-heading"
                onClick={() => setOrderBy('volumePercentChange')}
              >
                By Volume
              </Button> */}
              <Button
                variant={orderBy === 'avgPricePercentChange' ? 'primary' : 'outline'}
                className="font-heading"
                onClick={() => setOrderBy('avgPricePercentChange')}
              >
                By Avg. Price
              </Button>
              <Button
                variant={orderBy === 'twitterFollowersPercentChange' ? 'primary' : 'outline'}
                className="font-heading"
                onClick={() => setOrderBy('twitterFollowersPercentChange')}
              >
                By Social Stats
              </Button>
            </div>
          </div>

          <DiscoverCollectionGrid orderBy={orderBy} routerQuery="" />
        </div>
      )}

      {selected === TABS.ListMyNFTs && (
        <div className="mt-40">
          <UserPageNftsTab userInfo={user as UserProfileDto} />
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
