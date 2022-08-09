import { useEffect, useState } from 'react';
import { Button, EZImage } from 'src/components/common';
import { apiGet, nFormatter, standardCard } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { TweetArrayDto, TweetDto } from '@infinityxyz/lib-frontend/types/dto/twitter';

interface Props2 {
  tweet: TweetDto;
}

const TrendingItem = ({ tweet }: Props2) => {
  return (
    <div className={twMerge(standardCard, 'flex justify-between items-center flex-wrap')}>
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

export const TrendingSidebar = () => {
  const [tweetList, setTweetList] = useState<TweetDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoData, setHasNoData] = useState(false);
  const [hasError, setHasError] = useState(false);

  // const { result, isLoading } = useFetch(`${USER_API_END_POINT}/${user.address}`);

  // const topOwners = `/collections/${chainId}:${collectionAddress}/topOwners`;

  const getActivityList = async () => {
    setIsLoading(true);
    setHasNoData(false);

    const ep = `/???/`;
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
  }, []);

  if (hasError || isLoading || hasNoData) {
    // return <ErrorOrLoading error={hasError} noData={hasNoData} />;
    return <></>;
  }

  return (
    <>
      <div className="text-3xl mb-6 mt-16">Trending 7 day vol</div>

      {tweetList.map((e) => {
        return <TrendingItem tweet={e} key={e.tweetId} />;
      })}
    </>
  );
};
