import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { BsChatRight } from 'react-icons/bs';
import { Button, EZImage, SVG } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { NftActivity } from '../asset/activity/activity-item';
// import { addUserLike } from 'src/utils/firestore/firestoreUtils';
import { FeedEvent } from '../feed/feed-item';
import { AiOutlineLike } from 'react-icons/ai';
import { FeedListActivityItem } from './feed-list-activity-item';

interface Props {
  activity: NftActivity;
  onLike?: (event: FeedEvent) => void;
  onComment?: (event: FeedEvent) => void;
}

export const FeedListItem = ({ activity, onLike, onComment }: Props) => {
  const { user } = useAppContext();

  if (onLike && onComment) {
    // sdf
  }

  const likes = 23;
  const comments = 443;

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
        return <div className="rounded-xl bg-orange-700 text-white py-0.5 px-2 text-sm pb-1">Offer</div>;

      case EventType.NftTransfer:
        return <div className="rounded-xl bg-yello-700 text-white py-0.5 px-2 text-sm pb-1">Offer</div>;

      case EventType.CoinMarketCapNews:
        return <div className="rounded-xl bg-green-700 text-white py-0.5 px-2 text-sm pb-1">Offer</div>;

      default:
        return <div className="rounded-xl bg-orange-700 text-white py-0.5 px-2 text-sm pb-1">{type}</div>;
    }

    return <></>;
  };

  const typeContent = (type: string) => {
    switch (type) {
      case EventType.TwitterTweet:
        return <div className="rounded-xl bg-amber-600 text-white py-0.5 px-2 text-sm pb-1">Tweet</div>;

      case EventType.DiscordAnnouncement:
        return <div className="rounded-xl bg-blue-600 text-white py-0.5 px-2 text-sm pb-1">Discord</div>;

      case EventType.NftSale:
        return <FeedListActivityItem activity={activity} />;

      case EventType.NftOffer:
        return <div className="rounded-xl bg-cyan-700 text-white py-0.5 px-2 text-sm pb-1">Offer</div>;

      case EventType.NftListing:
        return <div className="rounded-xl bg-orange-700 text-white py-0.5 px-2 text-sm pb-1">Offer</div>;

      case EventType.NftTransfer:
        return <div className="rounded-xl bg-yello-700 text-white py-0.5 px-2 text-sm pb-1">Offer</div>;

      case EventType.CoinMarketCapNews:
        return <div className="rounded-xl bg-green-700 text-white py-0.5 px-2 text-sm pb-1">Offer</div>;

      default:
        return <div className="rounded-xl bg-orange-700 text-white py-0.5 px-2 text-sm pb-1">{type}</div>;
    }

    return <></>;
  };

  const bottomBar = (
    <div className="text-sm mt-2 text-gray-500 flex items-center">
      <Button
        variant="plain"
        className="px-0"
        onClick={async () => {
          if (user && user?.address) {
            // await addUserLike(data.id || '', user?.address, () => {
            //   if (onLike) {
            //     onLike(data);
            //   }
            // });
          }
        }}
      >
        <div className="flex">
          <AiOutlineLike size={22} className="mr-2" />
          {likes}
        </div>
      </Button>

      <Button
        variant="plain"
        className="px-0 ml-12"
        onClick={() => {
          // if (onComment) {
          //   onComment(data);
          // }
        }}
      >
        <div className="flex">
          <BsChatRight size={18} className="mr-2" /> {comments}
        </div>
      </Button>
    </div>
  );

  const content = typeContent(activity.type);

  return (
    <div>
      <div className="flex items-start">
        <EZImage
          src={activity.collectionData?.metadata.bannerImage}
          className="border border-red-300 rounded-full overflow-clip shrink-0 w-10 h-10 bg-gray-100"
        />

        <div className="ml-2 flex flex-col items-start">
          <div className="flex items-center">
            <div className="font-bold">
              <a href={`/collection/${activity.collectionData?.slug}`}>{activity.collectionData?.metadata.name}</a>
            </div>
            {activity.collectionData?.hasBlueCheck === true ? <SVG.blueCheck className="w-4 h-4 ml-1" /> : null}
          </div>
          <div className="text-gray-500 text-sm mt-1">{typeName(activity.type)}</div>

          <div className="py-8">{content}</div>

          {bottomBar}
        </div>
      </div>
    </div>
  );
};
