import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { AiOutlineComment, AiOutlineLike } from 'react-icons/ai';
import { Button, EZImage, SVG } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { NftActivity } from '../asset/activity/activity-item';
// import { addUserLike } from 'src/utils/firestore/firestoreUtils';
import { FeedEvent } from '../feed/feed-item';

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

  const bottomBar = (
    <footer className="text-sm mt-2 text-gray-500 flex items-center">
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
          <AiOutlineComment size={22} className="mr-2" /> {comments}
        </div>
      </Button>
    </footer>
  );

  const content = <div className="p-12">hello</div>;

  return (
    <div>
      <div className="flex   items-start">
        <EZImage
          src={activity.collectionData?.metadata.bannerImage}
          className="border border-red-300 rounded-full overflow-clip w-10 h-10 bg-gray-100"
        />

        <div className="ml-2">
          <div className="flex items-center">
            <div className="font-bold">
              <a href={`/collection/${activity.collectionData?.slug}`}>{activity.collectionData?.metadata.name}</a>
            </div>
            {activity.collectionData?.hasBlueCheck === true ? <SVG.blueCheck className="w-4 h-4 ml-1" /> : null}
          </div>
          <div className="text-gray-500 text-sm mt-1">{typeName(activity.type)}</div>

          {content}

          {bottomBar}
        </div>
      </div>
    </div>
  );
};

const typeName = (type: string) => {
  switch (type) {
    case EventType.TwitterTweet:
      return <span className="rounded-xl bg-amber-600 text-white py-0.5 px-2 text-sm pb-1">Tweet</span>;

    case EventType.DiscordAnnouncement:
      return <span className="rounded-xl bg-blue-600 text-white py-0.5 px-2 text-sm pb-1">Discord</span>;

    case EventType.NftSale:
      return <span className="rounded-xl bg-purple-700 text-white py-0.5 px-2 text-sm pb-1">Sale</span>;

    case EventType.NftOffer:
      return <span className="rounded-xl bg-cyan-700 text-white py-0.5 px-2 text-sm pb-1">Offer</span>;

    case EventType.NftListing:
      return <span className="rounded-xl bg-orange-700 text-white py-0.5 px-2 text-sm pb-1">Offer</span>;

    case EventType.NftTransfer:
      return <span className="rounded-xl bg-yello-700 text-white py-0.5 px-2 text-sm pb-1">Offer</span>;

    case EventType.CoinMarketCapNews:
      return <span className="rounded-xl bg-green-700 text-white py-0.5 px-2 text-sm pb-1">Offer</span>;

    default:
      return <span className="rounded-xl bg-orange-700 text-white py-0.5 px-2 text-sm pb-1">{type}</span>;
  }

  return <></>;
};
