import { Collection, CollectionPeriodStatsContent } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { EthPrice, EZImage, NextLink, Spinner, SVG } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import useScreenSize from 'src/hooks/useScreenSize';
import { apiGet, formatNumber, ITEMS_PER_PAGE, nFormatter } from 'src/utils';

export const TrendingStart = () => {
  const [data, setData] = useState<Collection[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const { isDesktop, isMobile } = useScreenSize();

  const fetchData = async (refresh = false) => {
    setIsLoading(true);
    if (refresh) {
      setData([]);
    }
    const { result } = await apiGet('/collections/stats', {
      query: {
        limit: 4,
        period: 'daily',
        queryBy: 'by_sales_volume' // 'by_avg_price' // 'by_sales_volume'
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
  }, []);

  return (
    <div>
      <div className="space-y-4 mt-8">
        {data.map((coll) => {
          let periodStat: CollectionPeriodStatsContent | undefined = undefined;
          periodStat = coll?.stats?.daily;

          return (
            <div
              key={coll.address}
              className="bg-theme-light-200 px-10 h-[110px] rounded-3xl flex items-center font-heading"
            >
              <NextLink href={`/collection/${coll?.slug}`}>
                <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={coll?.metadata?.profileImage} />
              </NextLink>

              <div className="flex justify-between items-center w-full ml-6">
                <div className="w-44 flex items-center text-black font-bold font-body">
                  <NextLink href={`/collection/${coll?.slug}`} className="truncate">
                    {coll?.metadata?.name}
                  </NextLink>
                  {coll?.hasBlueCheck && <SVG.blueCheck className="ml-1.5 shrink-0 w-4 h-4" />}
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
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && <Spinner />}
    </div>
  );
};
