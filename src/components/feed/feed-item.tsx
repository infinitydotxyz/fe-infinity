// import { ExchangeEvent } from '@infinityxyz/lib/types/core/feed/NftEvent';
import { BaseFeedEvent, FeedEventType } from '@infinityxyz/lib/types/core/feed/FeedEvent';

export type FeedEvent = BaseFeedEvent & {
  id?: string;
  type?: FeedEventType;
  title?: string;
  userDisplayName?: string;
};

interface FeedItemProps {
  data: FeedEvent;
}

export function FeedItem({ data }: FeedItemProps) {
  return (
    <div>
      <header className="flex items-center">
        <span className="border border-gray-300 p-2 rounded-3xl w-10 bg-gray-100">&nbsp;</span>
        <div className="ml-2">
          <div className="font-medium text-sm">Username</div>
          <div className="text-gray-500 text-sm">Type</div>
        </div>
      </header>
      <div className="ml-12">
        {data.type === FeedEventType.TwitterTweet && <TweetEvent data={data} />}

        <footer className="text-sm mt-2 text-gray-500">0 Likes - 0 Comments</footer>
      </div>
    </div>
  );
}

function TweetEvent({ data }: FeedItemProps) {
  return <div className="mt-2 border rounded-xl p-2">{data.title}</div>;
}

export default FeedItem;
