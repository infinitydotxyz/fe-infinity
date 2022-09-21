import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { Button, EZImage } from 'src/components/common';
import { apiGet, nFormatter, standardCard } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { TweetArrayDto, TweetDto } from '@infinityxyz/lib-frontend/types/dto/twitter';

// @Get('/:id/topOwners')  TopOwnersArrayResponseDto
// @Get('/:id/mentions')  TweetArrayDto

interface Props2 {
  tweet: TweetDto;
}

const TwitterSupporter = ({ tweet }: Props2) => {
  return (
    <div className={twMerge(standardCard, 'flex justify-between items-center overflow-clip')}>
      <div className="flex mr-2 mb-3 items-center">
        <EZImage src={tweet.author.profileImageUrl} className="w-12 h-12  overflow-clip rounded-full" />
        <div className="ml-5">
          <div className="font-bold font-heading">{tweet.author.name}</div>
          <div className="text-theme-light-800 font-body text-sm">{`${nFormatter(
            tweet.author.followersCount
          )} Followers`}</div>
        </div>
      </div>
      <Button
        className="bg-white"
        variant="outline"
        onClick={() => {
          window.open(`https://twitter.com/${tweet.author.username}`);
        }}
      >
        View Profile
      </Button>
    </div>
  );
};

interface Props {
  collection: BaseCollection;
}

export const TwitterSupporterList = ({ collection }: Props) => {
  const [tweetList, setTweetList] = useState<TweetDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const [hasError, setHasError] = useState(false);

  // const { result, isLoading } = useFetch(`${USER_API_END_POINT}/${user.address}`);

  // const topOwners = `/collections/${chainId}:${collectionAddress}/topOwners`;

  const getActivityList = async () => {
    setIsLoading(true);
    setHasNoData(false);

    const ep = `/collections/${collection.chainId}:${collection.address}/mentions`;
    const { result, error } = await apiGet(ep, {
      query: { limit: 3 }
    });

    setIsLoading(false);

    if (!error) {
      if (result?.data && result?.data.length === 0) {
        setHasNoData(true);
      }

      const duh = result as TweetArrayDto;

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
      <div className="text-3xl mb-6 mt-16">Top Twitter supporters</div>

      {tweetList.map((e) => {
        return <TwitterSupporter tweet={e} key={e.tweetId} />;
      })}
    </>
  );
};
