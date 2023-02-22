import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { twMerge } from 'tailwind-merge';

import { TopOwnerDto, TopOwnersArrayResponseDto } from '@infinityxyz/lib-frontend/types/dto/collections';
import { useEffect, useState } from 'react';
import { NextLink } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { apiGet, ellipsisAddress } from 'src/utils';
import { divideColor, secondaryTextColor, standardBorderCard } from 'src/utils/ui-constants';

interface Props {
  collection: BaseCollection;
}

export const TopHolderList = ({ collection }: Props) => {
  const [tweetList, setTweetList] = useState<TopOwnerDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isMounted = useIsMounted();

  const getActivityList = async () => {
    setIsLoading(true);
    setHasNoData(false);

    const ep = `/collections/${collection.chainId}:${collection.address}/topOwners`;
    const { result, error } = await apiGet(ep, {
      query: { limit: 10 }
    });

    if (isMounted()) {
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
      <div className="text-2xl font-heading font-medium">Top holders</div>
      <div className={twMerge(standardBorderCard, divideColor, 'text-sm divide-y-[1px]')}>
        {tweetList.map((e, index) => {
          return <TopHolder topOwner={e} index={index} key={e.ownerAddress} />;
        })}
      </div>
    </>
  );
};

interface Props2 {
  topOwner: TopOwnerDto;
  index: number;
}

const TopHolder = ({ topOwner, index }: Props2) => {
  // const { data } = useEnsName({
  //   address: topOwner.ownerAddress as `0x${string}`
  // });
  const name = ellipsisAddress(topOwner.ownerAddress, 8, 0);

  // if (data) {
  //   name = ellipsisString(data, 9, 0);
  // }

  return (
    <div className={twMerge('flex items-center text-sm p-4')}>
      <div className="w-8 max-w-8">{index + 1}</div>

      <div className="flex justify-between flex-1">
        <div className="">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Address</div>
          <div className="mt-1 hover:text-blue-500">
            <NextLink href={'/profile/' + topOwner.ownerAddress}>{name}</NextLink>
          </div>
        </div>

        <div className="">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Owned</div>
          <div className="mt-1">{topOwner.ownedCount}</div>
        </div>

        <div className="">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Percentage</div>
          <div className="mt-1">{topOwner.percentOwned}</div>
        </div>
      </div>
    </div>
  );
};
