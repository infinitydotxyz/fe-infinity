import { ChainId, Collection, CollectionPeriodStatsContent } from '@infinityxyz/lib-frontend/types/core';
import { UserCuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto/collections';
import { NULL_ADDRESS } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import { parse } from 'query-string';
import { useEffect, useState } from 'react';
import {
  BlueCheck,
  Button,
  CenterFixed,
  EthPrice,
  EZImage,
  NextLink,
  PageBox,
  Spinner,
  toastSuccess,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { VoteModal } from 'src/components/curation/vote-modal';
import { useIsMounted } from 'src/hooks/useIsMounted';
import useScreenSize from 'src/hooks/useScreenSize';
import { apiGet, formatNumber, ITEMS_PER_PAGE, nFormatter, useFetch } from 'src/utils';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

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

  return (
    <PageBox title="Trending">
      <div className="mt-4 flex justify-between">
        <ToggleTab
          small={true}
          className="font-heading"
          options={options}
          selected={selected}
          onChange={onChangeToggleTab}
        />
      </div>

      <div className="space-y-3 mt-8">
        {data.map((coll, index) => {
          return <TrendingPageCard key={coll.address} collection={coll} index={index} period={period} />;
        })}
      </div>

      {isLoading && (
        <CenterFixed>
          <Spinner />
        </CenterFixed>
      )}

      {/* <ScrollLoader onFetchMore={() => fetchData()} /> */}
    </PageBox>
  );
};

export default TrendingPage;

// =======================================================================

const VoteModalWrapper: React.FC<{ coll: Collection; isOpen: boolean; onClose: () => void }> = ({
  coll,
  isOpen,
  onClose
}) => {
  const { user, chainId } = useOnboardContext();
  const { result: curatedCollection } = useFetch<UserCuratedCollectionDto>(
    coll.metadata.name && isOpen
      ? `/collections/${coll.slug}/curated/${chainId}:${user?.address ?? NULL_ADDRESS}`
      : null
  );

  return (
    <VoteModal
      collection={{
        ...coll,
        ...coll.metadata,
        ...(curatedCollection as UserCuratedCollectionDto)
      }}
      isOpen={isOpen}
      onClose={onClose}
      onVote={() => {
        toastSuccess('Votes registered successfully. Your balance will reflect shortly.');
      }}
    />
  );
};

// =======================================================================

interface Props {
  collection: Collection;
  period: string;
  index: number;
}

const TrendingPageCard = ({ collection, period, index }: Props) => {
  const { checkSignedIn } = useOnboardContext();
  const [selectedCollection, setSelectedCollection] = useState<Collection>();
  const { addCartItem, setOrderDrawerOpen } = useOrderContext();

  const { isDesktop, isMobile } = useScreenSize();

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
    <div className="bg-theme-light-200 px-7 py-4 rounded-3xl flex items-center font-heading">
      <div className="text-theme-light-800 text-xl mr-6 min-w-[32px] text-right font-heading">{index + 1}</div>

      <NextLink href={`/collection/${collection?.slug}`}>
        <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={collection?.metadata?.profileImage} />
      </NextLink>

      <div className="flex justify-between items-center w-full ml-6">
        <div className="w-44 flex items-center text-black font-bold font-body">
          <NextLink href={`/collection/${collection?.slug}`} className="truncate">
            {collection?.metadata?.name}
          </NextLink>
          {collection?.hasBlueCheck && <BlueCheck className="ml-1.5" />}
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

        {/* <div className="w-1/9 max-w-[80px] min-w-[80px]">
          <div className="text-black font-bold font-body flex items-center">Avg Price</div>
          <div>
            <EthPrice label={periodStat?.avgPrice ? formatNumber(periodStat?.avgPrice, 2) : '-'} />
          </div>
        </div> */}

        <div className="w-1/9 max-w-[80px] min-w-[80px]">
          <div className="text-black font-bold font-body flex items-center">Floor Price</div>
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

        <div className="flex flex-row gap-3 flex-wrap">
          <Button size="medium" onClick={() => onClickBuy(collection)}>
            Buy
          </Button>
          <Button size="medium" onClick={() => checkSignedIn() && setSelectedCollection(collection)}>
            Curate
          </Button>
        </div>
      </div>

      <VoteModalWrapper
        coll={collection}
        isOpen={selectedCollection === collection}
        onClose={() => setSelectedCollection(undefined)}
      />
    </div>
  );
};
