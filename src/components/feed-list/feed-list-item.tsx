import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { BsChatRight } from 'react-icons/bs';
import { TbArrowBarUp } from 'react-icons/tb';
import { Button, EZImage, NextLink, Spacer, SVG } from 'src/components/common';
import { NftEventRec } from '../asset/activity/activity-item';
import { addUserLike } from 'src/utils/firestore/firestoreUtils';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { FeedListTableItem } from './feed-list-table-item';
import { useState } from 'react';
import { timeAgo } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

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
  const { user } = useOnboardContext();
  const [likedCache, setLikedCache] = useState<Map<string, boolean>>(new Map());

  const typeName = (type: string) => {
    switch (type) {
      case EventType.TwitterTweet:
        return <div className="rounded-xl bg-amber-600 text-white py-0.5 px-2 text-sm pb-1">Tweet</div>;

      case EventType.DiscordAnnouncement:
        return <div className="rounded-xl bg-blue-600 text-white py-0.5 px-2 text-sm pb-1">Discord</div>;

      case EventType.NftSale:
        return <div className="rounded-xl bg-purple-700 text-white py-0.5 px-2 text-sm pb-1">Sale</div>;

      case EventType.NftOffer:
        return <div className="rounded-xl bg-cyan-700 text-white py-0.5 px-2 text-sm pb-1">Offer</div>;

      case EventType.NftListing:
        return <div className="rounded-xl bg-orange-700 text-white py-0.5 px-2 text-sm pb-1">Listing</div>;

      case EventType.NftTransfer:
        return <div className="rounded-xl bg-yello-700 text-white py-0.5 px-2 text-sm pb-1">Transfer</div>;

      case EventType.CoinMarketCapNews:
        return <div className="rounded-xl bg-green-700 text-white py-0.5 px-2 text-sm pb-1">News</div>;

      default:
        return <div className="rounded-xl bg-orange-700 text-white py-0.5 px-2 text-sm pb-1">{type}</div>;
    }

    return <></>;
  };

  const onLike = (liked: boolean) => {
    likedCache.set(activity.id, liked);

    setLikedCache(new Map(likedCache));
  };

  const likeButtons = () => {
    let likes = activity.likes;

    if (likedCache.has(activity.id)) {
      const likedInCache = likedCache.get(activity.id);

      if (likedInCache) {
        likes += 1;
      } else {
        likes -= 1;
      }
    }

    return (
      <div className="flex items-center">
        <Button
          size="plain"
          variant="round"
          onClick={async () => {
            if (user && user?.address) {
              await addUserLike(true, activity.id, user.address);

              onLike(true);
            }
          }}
        >
          <div className="flex items-center">
            <IoMdArrowDropup size={22} />
          </div>
        </Button>

        <div className="mx-2">{likes}</div>

        <Button
          variant="round"
          size="plain"
          onClick={async () => {
            if (user && user?.address) {
              await addUserLike(false, activity.id, user.address);

              onLike(false);
            }
          }}
        >
          <div className="flex items-center">
            <IoMdArrowDropdown size={22} />
          </div>
        </Button>
      </div>
    );
  };

  const bottomBar = (
    <div className="text-sm   w-full text-gray-500 flex items-center">
      {likeButtons()}
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

  return (
    <div className="w-full flex items-start">
      <EZImage
        src={activity?.image || collectionProfileImage}
        className="border border-red-300 rounded-full overflow-clip shrink-0 w-10 h-10 bg-gray-100"
      />

      <div className="ml-2 flex-1 flex-col items-start">
        <div className="flex items-center">
          <div className="font-bold">
            <NextLink href={`/collection/${collectionSlug}`}>{collectionName}</NextLink>
          </div>
          {activity?.hasBlueCheck === true ? <SVG.blueCheck className="w-4 h-4 ml-1 shrink-0" /> : null}

          <div className="ml-3 text-gray-600">{timeString}</div>
        </div>

        <div className="text-gray-500 flex text-sm mt-1">{typeName(activity.type)}</div>

        <div className="mt-4">
          <FeedListTableItem activity={activity} />
        </div>

        {bottomBar}
      </div>
    </div>
  );
};
