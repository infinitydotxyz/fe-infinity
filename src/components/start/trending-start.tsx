import { Collection, CollectionPeriodStatsContent } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { CenteredContent, EthPrice, EZImage, NextLink, Spinner, SVG } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import useScreenSize from 'src/hooks/useScreenSize';
import { apiGet, formatNumber, ITEMS_PER_PAGE, nFormatter } from 'src/utils';
import { twMerge } from 'tailwind-merge';

const grayText = 'text-gray-500';

export const TrendingStart = () => {
  const [data, setData] = useState<Collection[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();
  const { innerWidth } = useScreenSize();

  const fetchData = async (refresh = false) => {
    setIsLoading(true);
    if (refresh) {
      setData([]);
    }
    const { result } = await apiGet('/collections/stats', {
      query: {
        limit: 10,
        period: 'daily',
        queryBy: 'by_sales_volume' // 'by_avg_price' // 'by_sales_volume'
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
  }, []);

  if (isLoading) {
    return (
      <CenteredContent>
        <Spinner />
      </CenteredContent>
    );
  }

  const tableHeader = (
    <div className={twMerge('flex text-xs', grayText)}>
      <div className="w-2/3 uppercase ml-4">Collection</div>
      <div className="w-1/3 text-right uppercase">Volume</div>
      <div className="w-1/3 text-right uppercase">Avg Price</div>
    </div>
  );

  const collectionTable = (cols: Collection[], className: string, startIndex = 1) => {
    return (
      <div className={twMerge('space-y-3 flex-1 flex-col', className)}>
        {tableHeader}
        {cols.map((collection, index) => {
          return <TrendingStartCard key={collection.address} collection={collection} index={index + startIndex} />;
        })}
      </div>
    );
  };

  if (innerWidth < 1000) {
    const firstFive = data.slice(0, 5);
    return collectionTable(firstFive, '');
  }

  const firstFive = data.slice(0, 5);
  const secondFive = data.slice(5, 10);

  return (
    <div className="flex w-full">
      {collectionTable(firstFive, '')}
      {collectionTable(secondFive, 'ml-20', 6)}
    </div>
  );
};

// ==========================================================================================

interface Props {
  index: number;
  collection: Collection;
}

const TrendingStartCard = ({ collection, index }: Props) => {
  let periodStat: CollectionPeriodStatsContent | undefined = undefined;
  periodStat = collection?.stats?.daily;

  return (
    <div>
      <div className="flex items-center w-full">
        <div className="w-2/3 min-w-0 flex items-center font-body">
          <div className={twMerge('text-xl font-body mr-5 shrink-0 font-bold text-right w-6', grayText)}>{index}</div>

          <NextLink href={`/collection/${collection?.slug}`}>
            <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={collection?.metadata?.profileImage} />
          </NextLink>

          <NextLink href={`/collection/${collection?.slug}`} className="truncate ml-4 font-bold">
            {collection?.metadata?.name}
          </NextLink>
          {collection?.hasBlueCheck && <SVG.blueCheck className="ml-1.5 shrink-0 w-4 h-4" />}
        </div>

        <div className="w-1/3 grow-0 font-bold">
          <EthPrice
            onRight={false}
            ethClassName={grayText}
            rowClassName="justify-end"
            label={`${periodStat?.salesVolume ? nFormatter(periodStat?.salesVolume) : '-'}`}
          />
        </div>

        <div className="w-1/3 grow-0   font-bold">
          <EthPrice
            onRight={false}
            ethClassName={grayText}
            rowClassName="justify-end"
            label={periodStat?.avgPrice ? formatNumber(periodStat?.avgPrice, 2) : '-'}
          />
        </div>
      </div>
    </div>
  );
};

// <div className="w-1/9 max-w-[80px] min-w-[80px]">
//   <div className="text-black font-bold font-body flex items-center">Sales</div>
//   <div>{formatNumber(periodStat?.numSales)}</div>
// </div>

//  <div className="w-1/9 max-w-[80px] min-w-[80px]">
//   <div className="text-black font-bold font-body flex items-center">Max Price</div>
//   <div>
//     <EthPrice label={periodStat?.maxPrice ? formatNumber(periodStat?.maxPrice, 2) : '-'} />
//   </div>
// </div>

// <div className="w-1/9 max-w-[80px] min-w-[80px]">
//   <div className="text-black font-bold font-body">Owners</div>
//   <div>{nFormatter(periodStat?.ownerCount ?? 0)}</div>
// </div>

// <div className="w-1/9 max-w-[80px] min-w-[80px]">
//   <div className="text-black font-bold font-body">Tokens</div>
//   <div>{nFormatter(periodStat?.tokenCount ?? 0)}</div>
// </div>
