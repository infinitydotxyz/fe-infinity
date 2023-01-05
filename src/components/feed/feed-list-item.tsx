import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { BsChatRight } from 'react-icons/bs';
import { TbArrowBarUp } from 'react-icons/tb';
import { BlueCheck, Button, ExternalLink, EZImage, NextLink, Spacer } from 'src/components/common';
import person from 'src/images/person.png';
import { cl, timeAgo } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { NftEventRec } from '../asset/activity/activity-item';
import { FeedListTableItem, NewsImage } from './feed-list-table-item';

interface Props {
  activity: NftEventRec;
  onComment: (event?: NftEventRec) => void;
  collectionName?: string;
  collectionSlug?: string;
  collectionProfileImage?: string;
}

export const FeedListItem = ({
  activity,
  onComment,
  collectionName,
  collectionSlug,
  collectionProfileImage
}: Props) => {
  const typeName = (activity: NftEventRec) => {
    const classes = 'rounded-md text-white px-3 py-0.5 w-32 text-center text-sm';

    const component = (color: string, label: string) => {
      return (
        <div
          onClick={() => cl(activity)}
          className={twMerge(classes, color, 'relative flex justify-center items-center bg-opacity-80')}
        >
          <div>{label}</div>
        </div>
      );
    };

    switch (activity.type) {
      case EventType.TwitterTweet:
        return component('bg-amber-600', 'Tweet');
      case EventType.DiscordAnnouncement:
        return component('bg-blue-600', 'Discord');
      case EventType.NftSale:
        return component('bg-purple-700', 'Sale');
      case EventType.NftOffer:
        return component('bg-cyan-700', 'Offer');
      case EventType.NftListing:
        return component('bg-orange-700', 'Listing');
      case EventType.NftTransfer:
        return component('bg-yellow-600', 'Transfer');
      case EventType.CoinMarketCapNews:
        return component('bg-black', 'News');
      case EventType.TokensStaked:
        return component('bg-green-600', 'Tokens staked');
      case EventType.UserVote:
        return component('bg-teal-600', 'Vote');

      case EventType.TokensUnStaked:
      case EventType.UserVoteRemoved:
      case EventType.TokensRageQuit:
      default:
        return component('bg-red-700', activity.type);
    }
  };

  const bottomBar = (
    <div className="text-sm w-full text-gray-500 flex items-center">
      <Button
        variant="plain"
        className="px-0 ml-12"
        onClick={() => {
          onComment(activity);
        }}
      >
        <div className="flex items-center">
          <BsChatRight size={18} className="mr-2" />
          {activity.comments}
        </div>
      </Button>

      <Spacer />

      <Button
        variant="plain"
        className="px-0 ml-12"
        onClick={() => {
          onComment(); // this just closes the chat
        }}
      >
        <div className="flex">
          <TbArrowBarUp size={18} className="" />
        </div>
      </Button>
    </div>
  );

  const timeString = timeAgo(new Date(activity.timestamp));

  // disable the bottomBar for now
  const likesEnabled = false;

  const header = () => {
    switch (activity.type) {
      case EventType.NftSale:
      case EventType.NftOffer:
      case EventType.NftTransfer:
      case EventType.NftListing:
      case EventType.UserVote:
        return (
          <div className="flex items-center">
            <div className="font-bold">
              <NextLink href={`/collection/${collectionSlug}`}>{collectionName}</NextLink>
            </div>

            {activity?.hasBlueCheck === true ? <BlueCheck className="ml-1" /> : null}

            <div className="ml-3 text-gray-600">{timeString}</div>
          </div>
        );
      case EventType.TwitterTweet:
        return (
          <div className="flex items-center">
            {collectionName && (
              <div className="font-bold">
                <NextLink href={`/collection/${collectionSlug}`}>{collectionName}</NextLink>
              </div>
            )}

            {!collectionName && (
              <div className="font-bold">
                <ExternalLink href={`https://twitter.com/${activity.from}`}>{activity.fromDisplayName}</ExternalLink>
              </div>
            )}

            <div className="ml-3 text-gray-600">{timeString}</div>
          </div>
        );
      case EventType.CoinMarketCapNews:
        return (
          <div className="flex items-center">
            {collectionName && <div className="font-bold">{activity.fromDisplayName}</div>}

            {!collectionName && <div className="font-bold">{activity.fromDisplayName}</div>}

            <div className="ml-3 text-gray-600">{timeString}</div>
          </div>
        );
      case EventType.DiscordAnnouncement:
        return (
          <div className="flex items-center">
            <div className="font-bold">{activity.paymentToken}</div>

            <div className="ml-3 text-gray-600">{timeString}</div>
          </div>
        );
      case EventType.TokensStaked:
        return (
          <div className="flex items-center">
            <NextLink className="font-bold" href={`/profile/${activity.from}`}>
              {activity.fromDisplayName}
            </NextLink>

            <div className="ml-3 text-gray-600">{timeString}</div>
          </div>
        );

      case EventType.TokensUnStaked:
      case EventType.UserVoteRemoved:
      case EventType.TokensRageQuit:
      default:
        return <div></div>;
    }
  };

  const image = () => {
    switch (activity.type) {
      case EventType.TwitterTweet:
        return (
          <EZImage
            src={activity?.paymentToken || activity?.image}
            className="border rounded-full overflow-clip shrink-0 w-10 h-10 bg-gray-100"
          />
        );

      case EventType.NftSale:
      case EventType.NftOffer:
      case EventType.NftTransfer:
      case EventType.NftListing:
      case EventType.DiscordAnnouncement:
        return (
          <EZImage
            src={activity?.image || collectionProfileImage}
            className="border rounded-full overflow-clip shrink-0 w-10 h-10 bg-gray-100"
          />
        );

      case EventType.CoinMarketCapNews:
        return (
          <NewsImage
            src={activity?.image || collectionProfileImage}
            className="border rounded-full overflow-clip shrink-0 w-10 h-10 bg-gray-100"
          />
        );

      case EventType.TokensStaked:
        return (
          <EZImage
            src={activity?.image || collectionProfileImage || person.src}
            className="border rounded-full overflow-clip shrink-0 w-10 h-10 bg-gray-100"
          />
        );

      case EventType.UserVote:
        return (
          <EZImage
            src={activity?.image || collectionProfileImage}
            className="border rounded-full overflow-clip shrink-0 w-10 h-10 bg-gray-100"
          />
        );

      case EventType.TokensUnStaked:
      case EventType.UserVoteRemoved:
      case EventType.TokensRageQuit:
      default:
        return <div></div>;
    }
  };

  return (
    <div className="w-full flex items-start">
      {image()}

      <div className="ml-2 mt-1 flex-1 flex-col items-start">
        <div className="flex items-center">
          {header()}
          <Spacer />
          <div className="text-gray-500 flex text-sm  ">{typeName(activity)}</div>
        </div>

        <div className="mt-4">
          <FeedListTableItem activity={activity} />
        </div>

        {likesEnabled && bottomBar}
      </div>
    </div>
  );
};