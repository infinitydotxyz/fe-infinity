import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { TweetArrayDto, TweetDto } from '@infinityxyz/lib-frontend/types/dto/twitter';
import { useEffect, useState } from 'react';
import { apiGet, nFormatter } from 'src/utils';
import { divideColor, standardBorderCard } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AOutlineButton } from '../astra/astra-button';
import { EZImage } from '../common/ez-image';

// @Get('/:id/mentions')  TweetArrayDto

interface Props {
  collection: BaseCollection;
}

export const TwitterSupporterList = ({ collection }: Props) => {
  const [tweetList, setTweetList] = useState<TweetDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getActivityList = async () => {
    setIsLoading(true);
    setHasNoData(false);

    const ep = `/collections/${collection.chainId}:${collection.address}/mentions`;
    const { result, error } = await apiGet(ep, {
      query: { limit: 10 }
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
      <div className="text-2xl font-heading font-medium">Top Twitter supporters</div>
      <div className={twMerge(standardBorderCard, divideColor, 'text-sm divide-y')}>
        {tweetList.map((e) => {
          return <TwitterSupporter tweet={e} key={e.tweetId} />;
        })}
      </div>
    </>
  );
};

interface Props2 {
  tweet: TweetDto;
}

const TwitterSupporter = ({ tweet }: Props2) => {
  return (
    <div className={twMerge('flex justify-between items-center overflow-clip text-sm p-4')}>
      <div className="flex items-center">
        <EZImage src={tweet.author.profileImageUrl} className="w-11 h-11 overflow-clip rounded-lg" />
        <div className="ml-3">
          <div className="truncate">{tweet.author.name}</div>
          <div className="truncate">{`${nFormatter(tweet.author.followersCount)} Followers`}</div>
        </div>
      </div>
      <AOutlineButton
        className="py-2"
        onClick={() => {
          window.open(`https://twitter.com/${tweet.author.username}`);
        }}
      >
        View Profile
      </AOutlineButton>
    </div>
  );
};
