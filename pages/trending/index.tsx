import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { parse } from 'query-string';
import { BGImage, Button, EthPrice, NextLink, PageBox, ToggleTab, useToggleTab } from 'src/components/common';
import { apiGet, BLANK_IMG, formatNumber, ITEMS_PER_PAGE } from 'src/utils';
import { Collection } from '@infinityxyz/lib-frontend/types/core';

// - cache stats 5mins

const DEFAULT_TAB = '1 day';

const CollectionStatsPage = () => {
  const { pathname, query, push } = useRouter();
  const [queryBy, setQueryBy] = useState('by_sales_volume');
  const [data, setData] = useState<Collection[]>([]);
  const { options, onChange, selected } = useToggleTab(['1 day', '7 days', '30 days'], DEFAULT_TAB);
  const [period, setPeriod] = useState('daily');
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const parsedQs = parse(window?.location?.search); // don't use useRouter-query as it's undefined initially.
    onChangeToggleTab(parsedQs.tab ? `${parsedQs.tab}` : DEFAULT_TAB);
    onClickQueryBy(parsedQs.queryBy ? `${parsedQs.queryBy}` : 'by_sales_volume', `${parsedQs.tab ?? ''}`);
  }, []);

  const fetchData = async (refresh = false) => {
    setIsLoading(true);
    const { result } = await apiGet('/collections/stats', {
      query: {
        offset: refresh ? 0 : offset,
        limit: 20,
        period,
        orderDirection: 'desc',
        minDate: 0,
        maxDate: Number.MAX_SAFE_INTEGER,
        queryBy: queryBy // 'by_avg_price' // 'by_sales_volume'
      }
    });
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
  };

  useEffect(() => {
    fetchData(true);
  }, [queryBy, period]);

  const onClickQueryBy = (val: string, setTab = '') => {
    setQueryBy(val);
    push(
      {
        pathname,
        query: { ...query, tab: (setTab ? setTab : query?.tab) || DEFAULT_TAB, queryBy: val }
      },
      undefined,
      { shallow: true }
    );
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

  return (
    <PageBox title="Trending">
      <div className="flex justify-between">
        <ToggleTab className="font-heading" options={options} selected={selected} onChange={onChangeToggleTab} />

        <div className="space-x-2">
          <Button
            variant={queryBy === 'by_sales_volume' ? 'primary' : 'outline'}
            className="font-heading"
            onClick={() => onClickQueryBy('by_sales_volume')}
          >
            By Volume
          </Button>
          <Button
            variant={queryBy === 'by_avg_price' ? 'primary' : 'outline'}
            className="font-heading"
            onClick={() => onClickQueryBy('by_avg_price')}
          >
            By Avg. Price
          </Button>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        {data.map((coll) => {
          return (
            <div key={coll.address} className="bg-gray-100 px-10 h-[110px] rounded-3xl flex items-center font-heading">
              <NextLink href={`/collection/${coll?.slug}`}>
                {coll?.metadata?.profileImage ? (
                  <BGImage className="w-16 h-16 max-h-[80px] rounded-full" src={coll?.metadata?.profileImage} />
                ) : (
                  <BGImage className="w-16 h-16 max-h-[80px] rounded-full" src={BLANK_IMG} />
                )}
              </NextLink>

              <div className="flex justify-between w-full mx-8">
                <div className="w-1/6">
                  <div className="text-black font-bold font-body">
                    <a href={`/collection/${coll?.slug}`}>{coll?.metadata?.name}</a>
                  </div>
                  <div></div>
                </div>

                <div className="w-1/6">
                  <div className="text-black font-bold font-body">Volume</div>
                  <div>
                    <EthPrice label={formatNumber(coll?.stats?.daily?.salesVolume)} />
                  </div>
                </div>

                <div className="w-1/6">
                  <div className="text-black font-bold font-body">Avg. Price</div>
                  <div>
                    <EthPrice label={formatNumber(coll?.stats?.daily?.avgPrice, 2)} />
                  </div>
                </div>

                <div className="w-1/6">
                  <div className="text-black font-bold font-body">Owners</div>
                  <div>{formatNumber(coll?.stats?.daily?.ownerCount)}</div>
                </div>

                <div className="w-1/6">
                  <div className="text-black font-bold font-body">Tokens</div>
                  <div>{formatNumber(coll?.stats?.daily?.tokenCount)}</div>
                </div>

                <div className="w-1/6">
                  <Button>Buy</Button>
                </div>
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

export default CollectionStatsPage;

// =======================================================================

const LoadingCards = () => (
  <>
    {Array.from(Array(Math.round(ITEMS_PER_PAGE / 2)).keys())?.map((x, i) => (
      <Fragment key={i}>
        <div className="w-full h-[110px] mt-3 bg-theme-light-200 rounded-3xl animate-pulse"></div>
      </Fragment>
    ))}
  </>
);
