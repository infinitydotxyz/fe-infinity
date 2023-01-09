import { CheckIcon } from '@heroicons/react/solid';
import { Collection, CollectionPeriodStatsContent, Erc721Collection } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { parse } from 'query-string';
import { useEffect, useState } from 'react';
import { AButton } from 'src/components/astra/astra-button';
import { APageBox } from 'src/components/astra/astra-page-box';
import {
  BlueCheckInline,
  CenterFixed,
  EthPrice,
  EZImage,
  NextLink,
  ScrollLoader,
  Spinner,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import useScreenSize from 'src/hooks/useScreenSize';
import { apiGet, formatNumber, ITEMS_PER_PAGE, nFormatter } from 'src/utils';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

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
  const isMounted = useIsMounted();
  const { isCollSelected, isCollSelectable, toggleCollSelection } = useDashboardContext();

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

  return (
    <APageBox title="Trending Collections" showTitle={true}>
      <div className="overflow-y-auto overflow-x-clip">
        <ToggleTab
          small={true}
          className="font-heading"
          options={options}
          selected={selected}
          onChange={onChangeToggleTab}
        />

        <div className="space-y-3 mt-8">
          {data.map((coll, index) => {
            return (
              <TrendingPageCard
                key={coll.address}
                collection={coll}
                isCollSelectable={isCollSelectable}
                isCollSelected={isCollSelected}
                onClickBuy={(data) => {
                  if (toggleCollSelection) {
                    return toggleCollSelection(data);
                  }
                }}
                index={index}
                period={period}
              />
            );
          })}
        </div>

        {isLoading && (
          <CenterFixed>
            <Spinner />
          </CenterFixed>
        )}

        <ScrollLoader onFetchMore={() => fetchData()} />
      </div>
    </APageBox>
  );
};

export default TrendingPage;

// =======================================================================

interface Props {
  collection: Collection;
  period: string;
  index: number;
  onClickBuy: (data: Erc721Collection) => void;
  isCollSelected: (data: Erc721Collection) => boolean;
  isCollSelectable: (data: Erc721Collection) => boolean;
}

const TrendingPageCard = ({ collection, onClickBuy, isCollSelected, isCollSelectable, period, index }: Props) => {
  const { isDesktop } = useScreenSize();

  let periodStat: CollectionPeriodStatsContent | undefined = undefined;
  if (period === 'daily') {
    periodStat = collection?.stats?.daily;
  } else if (period === 'weekly') {
    periodStat = collection?.stats?.weekly;
  } else if (period === 'monthly') {
    periodStat = collection?.stats?.monthly;
  }
  const floorPrice = periodStat?.floorPrice ?? 0;

  return (
    <div className={twMerge(borderColor, 'border-b py-4 flex items-center font-heading')}>
      <div
        className="grid gap-4 justify-between items-center w-full"
        style={{ gridTemplateColumns: 'minmax(0, 2fr) repeat(auto-fit, minmax(0, 1fr))' }}
      >
        <div className="flex items-center font-bold ">
          <div className="text-lg mr-4 min-w-[32px] text-right font-heading">{index + 1}</div>

          <NextLink href={`/collection/${collection?.slug}/items`}>
            <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={collection?.metadata?.profileImage} />
          </NextLink>

          <NextLink href={`/collection/${collection?.slug}/items`} className="ml-2 whitespace-normal">
            {collection?.metadata?.name}
            {collection?.hasBlueCheck && <BlueCheckInline />}
          </NextLink>
        </div>

        {isDesktop ? (
          <>
            <div className="w-1/9 max-w-[80px] min-w-[80px]">
              <div className="text-sm font-bold   flex items-center">Sales</div>
              <div>{formatNumber(periodStat?.numSales)}</div>
            </div>
          </>
        ) : null}

        <div className="w-1/9 max-w-[80px] min-w-[80px]">
          <div className="text-sm font-bold  flex items-center">Volume</div>
          <div>
            <EthPrice label={`${periodStat?.salesVolume ? nFormatter(periodStat?.salesVolume) : '-'}`} />
          </div>
        </div>

        <div className="w-1/9 max-w-[80px] min-w-[80px]">
          <div className="text-sm font-bold  flex items-center">Floor Price</div>
          <div>
            <EthPrice
              label={
                floorPrice > 0
                  ? formatNumber(floorPrice, 2)
                  : periodStat?.minPrice
                  ? formatNumber(periodStat?.minPrice, 2)
                  : '-'
              }
            />
          </div>
        </div>

        {isDesktop ? (
          <>
            <div className="w-1/9 max-w-[80px] min-w-[80px]">
              <div className="text-sm font-bold ">Owners</div>
              <div>{nFormatter(periodStat?.ownerCount ?? 0)}</div>
            </div>

            <div className="w-1/9 max-w-[80px] min-w-[80px]">
              <div className=" text-sm font-bold ">Tokens</div>
              <div>{nFormatter(periodStat?.tokenCount ?? 0)}</div>
            </div>
          </>
        ) : null}

        <div
          className="flex gap-2"
          style={{
            gridColumn: -1,
            width: '170px'
          }}
        >
          <AButton
            primary
            onClick={() => {
              if (isCollSelectable(collection as Erc721Collection)) {
                onClickBuy(collection as Erc721Collection);
              }
            }}
          >
            {isCollSelected(collection as Erc721Collection) ? <CheckIcon className="w-5 h-5" /> : 'Buy'}
          </AButton>
        </div>
      </div>
    </div>
  );
};
