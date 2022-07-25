import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PageBox } from 'src/components/common';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { parse } from 'query-string';

const enum TABS {
  Orders = 'Orders',
  Discover = 'Discover',
  ListMyNFTs = 'List NFTs'
}
const DEFAULT_TAB = TABS.Orders;

export type DiscoverOrderBy = 'twitterFollowersPercentChange' | 'volumePercentChange' | 'avgPricePercentChange';

const OrderbookPage = () => {
  const { pathname, query, push } = useRouter();

  // Checks the url for the 'tab' query parameter. If it doesn't exist, default to Orderbook
  // const defaultTab = query.tab && typeof query.tab === 'string' ? query.tab : TABS.Orders;

  // const { options, onChange, selected } = useToggleTab([TABS.Orders, TABS.ListMyNFTs], defaultTab);
  const [orderBy, setOrderBy] = useState<DiscoverOrderBy>('twitterFollowersPercentChange');

  const selected = TABS.Orders;

  useEffect(() => {
    const parsedQs = parse(window?.location?.search);
    // onChange(parsedQs.tab ? `${parsedQs.tab}` : DEFAULT_TAB);
    onClickQueryBy(
      (parsedQs.queryBy ? `${parsedQs.queryBy}` : 'twitterFollowersPercentChange') as DiscoverOrderBy,
      `${parsedQs.tab ?? ''}`
    );
  }, []);

  const onClickQueryBy = (val: DiscoverOrderBy, setTab = '') => {
    const tab = (setTab ? setTab : query?.tab) || DEFAULT_TAB;
    if (val !== orderBy) {
      setOrderBy(val);
    }
    if (tab === TABS.Discover) {
      push(
        {
          pathname,
          query: { ...query, tab, queryBy: val }
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const contents = (
    <>
      {/* <div className="flex space-x-2 items-center relative max-w-xl lg:top-14 lg:-mt-14 pb-4 lg:pb-0">
        <ToggleTab className="font-heading" options={options} selected={selected} onChange={onChange} />
        <Spacer />
      </div> */}

      {selected === TABS.Orders && <OrderbookContainer />}

      {/* {selected === TABS.Discover && (
        <div className="min-h-[50vh]">
          <div className="mb-8 w-full flex flex-row-reverse">
            <div className="space-x-2">
              <Dropdown
                label={orderBy === 'avgPricePercentChange' ? 'Sort by Avg. Price' : 'Sort by Social Stats'}
                items={[
                  {
                    label: 'Avg. Price',
                    onClick: () => {
                      onClickQueryBy('avgPricePercentChange');
                    }
                  },
                  {
                    label: 'Social Stats',
                    onClick: () => {
                      onClickQueryBy('twitterFollowersPercentChange');
                    }
                  }
                ]}
              />
            </div>
          </div>

          <DiscoverCollectionGrid orderBy={orderBy} routerQuery="" />
        </div>
      )} */}

      {/* {selected === TABS.ListMyNFTs && (
        <div className="mt-40">
          <UserPageNftsTab userInfo={user as UserProfileDto} listClassName="mt-[-87px]" />
        </div>
      )} */}
    </>
  );

  return (
    <PageBox title="Orderbook">
      <div>{contents}</div>
    </PageBox>
  );
};

export default OrderbookPage;
