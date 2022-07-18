import { ChainId, Collection, CollectionPeriodStatsContent } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { parse } from 'query-string';
import { Fragment, useEffect, useState } from 'react';
import { Button, EthPrice, EZImage, NextLink, PageBox, SVG, ToggleTab, useToggleTab } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import useScreenSize from 'src/hooks/useScreenSize';
import { apiGet, formatNumber, ITEMS_PER_PAGE, nFormatter } from 'src/utils';
import { useOrderContext } from 'src/utils/context/OrderContext';

// - cache stats 5mins

const DEFAULT_TAB = '1 day';

const TrendingPage = () => {
  const { pathname, query, push } = useRouter();
  const [queryBy, setQueryBy] = useState('by_sales_volume');
  const [data, setData] = useState<Collection[]>([]);
  const { options, onChange, selected } = useToggleTab(['1 day', '7 days', '30 days'], DEFAULT_TAB);
  const [period, setPeriod] = useState('daily');
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { addCartItem, setOrderDrawerOpen } = useOrderContext();
  const isMounted = useIsMounted();

  const { isDesktop, isMobile } = useScreenSize();

  useEffect(() => {
    const parsedQs = parse(window?.location?.search); // don't use useRouter-query as it's undefined initially.
    onChangeToggleTab(parsedQs.tab ? `${parsedQs.tab}` : DEFAULT_TAB);
    onClickQueryBy(parsedQs.queryBy ? `${parsedQs.queryBy}` : 'by_sales_volume', `${parsedQs.tab ?? ''}`);
  }, []);

  const fetchData = async (refresh = false) => {
    setIsLoading(true);
    if (refresh) {
      setData([]);
    }
    const { result } = await apiGet('/collections/stats', {
      query: {
        period,
        queryBy: queryBy // 'by_avg_price' // 'by_sales_volume'
      }
    });

    if (isMounted()) {
      setIsLoading(false);
      // console.log('result', result);

      if (result?.data?.length > 0) {
        if (refresh) {
          const newData = [...result.data];
          setData(newData);
        } else {
          const newData = [...data, ...result.data];
          setData(newData);
        }
      }
      setOffset(refresh ? 0 : offset + ITEMS_PER_PAGE);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, [queryBy, period]);

  const onClickQueryBy = (val: string, setTab = '') => {
    if (val !== queryBy) {
      setQueryBy(val);
      push(
        {
          pathname,
          query: { ...query, tab: (setTab ? setTab : query?.tab) || DEFAULT_TAB, queryBy: val }
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const onChangeToggleTab = (value: string) => {
    onChange(value);

    switch (value) {
      case '1 day':
        setPeriod('daily');
        break;
      case '7 days':
        setPeriod('weekly');
        break;
      case '30 days':
        setPeriod('monthly');
        break;
    }
  };

  const onClickBuy = (collection: Collection) => {
    addCartItem({
      chainId: collection.chainId as ChainId,
      collectionName: collection.metadata?.name ?? '',
      collectionAddress: collection.address ?? '',
      collectionImage: collection.metadata?.profileImage ?? '',
      collectionSlug: collection?.slug ?? '',
      isSellOrder: false
    });
    setOrderDrawerOpen(true);
  };

  return (
    <PageBox title="Trending">
      <div className="flex justify-between">
        <ToggleTab
          small={true}
          className="font-heading"
          options={options}
          selected={selected}
          onChange={onChangeToggleTab}
        />
      </div>

      <div className="space-y-4 mt-8">
        {data.map((coll) => {
          let periodStat: CollectionPeriodStatsContent | undefined = undefined;
          if (period === 'daily') {
            periodStat = coll?.stats?.daily;
          } else if (period === 'weekly') {
            periodStat = coll?.stats?.weekly;
          } else if (period === 'monthly') {
            periodStat = coll?.stats?.monthly;
          }
          return (
            <div key={coll.address} className="bg-gray-100 px-10 h-[110px] rounded-3xl flex items-center font-heading">
              <NextLink href={`/collection/${coll?.slug}`}>
                <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={coll?.metadata?.profileImage} />
              </NextLink>

              <div className="flex justify-between items-center w-full ml-6">
                <div className="w-44 flex items-center text-black font-bold font-body">
                  <NextLink href={`/collection/${coll?.slug}`} className="truncate">
                    {coll?.metadata?.name}
                  </NextLink>
                  {/* using inline here (className will show the bluechecks in different sizes for smaller screen) */}
                  {coll?.hasBlueCheck && <SVG.blueCheck className="ml-1.5" style={{ minWidth: 16, maxWidth: 16 }} />}
                </div>

                {isDesktop ? (
                  <>
                    <div className="w-1/9 max-w-[80px] min-w-[80px]">
                      <div className="text-black font-bold font-body flex items-center">Sales</div>
                      <div>{formatNumber(periodStat?.numSales)}</div>
                    </div>
                  </>
                ) : null}

                <div className="w-1/9 max-w-[80px] min-w-[80px]">
                  <div className="text-black font-bold font-body flex items-center">Volume</div>
                  <div>
                    <EthPrice label={`${periodStat?.salesVolume ? nFormatter(periodStat?.salesVolume) : '-'}`} />
                  </div>
                </div>

                {/* {isMobile ? null : (
                  <>
                    <div className="w-1/9 max-w-[80px] min-w-[80px]">
                      <div className="text-black font-bold font-body flex items-center">Min Price</div>
                      <div>
                        <EthPrice label={periodStat?.minPrice ? formatNumber(periodStat?.minPrice, 2) : '-'} />
                      </div>
                    </div>
                  </>
                )} */}

                <div className="w-1/9 max-w-[80px] min-w-[80px]">
                  <div className="text-black font-bold font-body flex items-center">Avg Price</div>
                  <div>
                    <EthPrice label={periodStat?.avgPrice ? formatNumber(periodStat?.avgPrice, 2) : '-'} />
                  </div>
                </div>

                {isMobile ? null : (
                  <>
                    <div className="w-1/9 max-w-[80px] min-w-[80px]">
                      <div className="text-black font-bold font-body flex items-center">Max Price</div>
                      <div>
                        <EthPrice label={periodStat?.maxPrice ? formatNumber(periodStat?.maxPrice, 2) : '-'} />
                      </div>
                    </div>
                  </>
                )}

                {isDesktop ? (
                  <>
                    <div className="w-1/9 max-w-[80px] min-w-[80px]">
                      <div className="text-black font-bold font-body">Owners</div>
                      <div>{nFormatter(periodStat?.ownerCount ?? 0)}</div>
                    </div>

                    <div className="w-1/9 max-w-[80px] min-w-[80px]">
                      <div className="text-black font-bold font-body">Tokens</div>
                      <div>{nFormatter(periodStat?.tokenCount ?? 0)}</div>
                    </div>
                  </>
                ) : null}

                <Button onClick={() => onClickBuy(coll)}>Buy</Button>
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && <LoadingCards />}

      {/* <ScrollLoader onFetchMore={() => fetchData()} /> */}
    </PageBox>
  );
};

export default TrendingPage;

// =======================================================================

const LoadingCards = () => (
  <>
    {Array.from(Array(Math.round(ITEMS_PER_PAGE / 2)).keys())?.map((x, i) => (
      <Fragment key={i}>
        <div className="w-full h-[110px] mt-4 bg-theme-light-200 rounded-3xl animate-pulse"></div>
      </Fragment>
    ))}
  </>
);
