import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { twMerge } from 'tailwind-merge';

import { useEffect, useState } from 'react';
import { NextLink } from 'src/components/common';
import { apiGet, ellipsisAddress, standardCard } from 'src/utils';
import { TopOwnersArrayResponseDto, TopOwnerDto } from '@infinityxyz/lib-frontend/types/dto/collections';

interface Props2 {
  topOwner: TopOwnerDto;
  index: number;
}

const TopHolder = ({ topOwner, index }: Props2) => {
  return (
    <div className={twMerge(standardCard, 'flex items-center')}>
      <div className="w-12 rounded-full max-w-18 h-12 p-3 bg-white px-5 font-bold"> {index + 1}</div>
      <div className="flex justify-between flex-1">
        <div className="ml-5 py-1">
          <div className="text-theme-light-800 text-sm">Address</div>
          <div className="font-heading mt-1">
            <NextLink href={'/profile/' + topOwner.ownerAddress}>
              {ellipsisAddress(topOwner.ownerAddress, 8, 0)}
            </NextLink>
          </div>
        </div>

        <div className="ml-5 py-1">
          <div className="text-theme-light-800 text-sm">Owned</div>
          <div className="font-heading mt-1">{topOwner.ownedCount}</div>
        </div>

        <div className="ml-5 py-1 float-right">
          <div className="text-theme-light-800 text-sm">Percentage</div>
          <div className="font-heading mt-1">{topOwner.percentOwned}</div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  collection: BaseCollection;
}

export const TopHolderList = ({ collection }: Props) => {
  const [tweetList, setTweetList] = useState<TopOwnerDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getActivityList = async () => {
    setIsLoading(true);
    setHasNoData(false);

    const ep = `/collections/${collection.chainId}:${collection.address}/topOwners`;
    const { result, error } = await apiGet(ep, {
      query: { limit: 6 }
    });

    setIsLoading(false);

    if (!error) {
      if (result?.data && result?.data.length === 0) {
        setHasNoData(true);
      }

      const duh = result as TopOwnersArrayResponseDto;

      setTweetList(duh.data || []);
    } else {
      setHasError(true);
    }
  };

  useEffect(() => {
    getActivityList();
  }, [collection]);

  if (hasError || isLoading || hasNoData) {
    // return <ErrorOrLoading error={hasError} noData={hasNoData} />;
    return <></>;
  }

  return (
    <>
      <div className="text-3xl mb-6 mt-16">Top Holders</div>

      {tweetList.map((e, index) => {
        return <TopHolder topOwner={e} index={index} key={e.ownerAddress} />;
      })}
    </>
  );
};
