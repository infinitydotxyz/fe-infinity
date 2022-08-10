import { useEffect, useState } from 'react';
import { EZImage, HelpTip } from 'src/components/common';
import { apiGet, nFormatter, standardCard } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { Collection } from '@infinityxyz/lib-frontend/types/core';

interface Props2 {
  collection: Collection;
}

const TrendingItem = ({ collection }: Props2) => {
  return (
    <div className={twMerge(standardCard, 'flex justify-between items-center')}>
      <div className="flex items-center overflow-clip">
        <EZImage
          src={collection.metadata.bannerImage || collection.metadata.profileImage}
          className="w-12 h-12 overflow-clip shrink-0 rounded-full"
        />
        <div className="ml-5">
          <div className="font-bold truncate font-heading">{collection.metadata.name}</div>
          <div className="text-theme-light-800 font-body text-sm">{`Volume ${nFormatter(
            collection.stats?.weekly?.salesVolume
          )}`}</div>
        </div>
      </div>
      <HelpTip
        content={
          <div className="flex flex-col items-center">
            <div>Number of sales</div>
            <div>last 7 days</div>
          </div>
        }
      >
        <div className="bg-white px-3 font-bold py-1 rounded-full mx-3">{`${nFormatter(
          collection.stats?.weekly?.numSales
        )}`}</div>
      </HelpTip>
    </div>
  );
};

export const TrendingSidebar = () => {
  const [data, setData] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const [hasError, setHasError] = useState(false);

  // const { result, isLoading } = useFetch(`${USER_API_END_POINT}/${user.address}`);

  // const topOwners = `/collections/${chainId}:${collectionAddress}/topOwners`;

  const getActivityList = async () => {
    setIsLoading(true);
    setHasNoData(false);

    const { result, error } = await apiGet('/collections/stats', {
      query: {
        period: 'weekly',
        queryBy: 'by_sales_volume' // 'by_avg_price' // 'by_sales_volume'
      }
    });

    setIsLoading(false);

    if (!error) {
      if (result?.data && result?.data.length === 0) {
        setHasNoData(true);
      }

      let tData = (result.data as Collection[]) ?? [];

      if (tData.length > 10) {
        tData = tData.splice(0, 10);
      }

      setData(tData);
    } else {
      setHasError(true);
    }
  };

  useEffect(() => {
    getActivityList();
  }, []);

  if (hasError || isLoading || hasNoData) {
    // return <ErrorOrLoading error={hasError} noData={hasNoData} />;
    return <></>;
  }

  return (
    <>
      <div className="text-3xl mb-6 mt-16">Trending 7 day vol</div>

      {data.map((e) => {
        return <TrendingItem collection={e} key={`${e.address}:${e.chainId}:${e.slug}`} />;
      })}
    </>
  );
};
