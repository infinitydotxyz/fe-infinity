import { FeedEventType } from '@infinityxyz/lib/types/core/feed/FeedEvent';
import FeedItem, { FeedEvent } from './feed-item';

export function CollectionFeed() {
  const data: FeedEvent[] = [
    {
      id: 'ev1',
      type: FeedEventType.TwitterTweet,
      title: 'Title 1',
      likes: 0,
      comments: 0,
      timestamp: 0
    },
    {
      id: 'ev2',
      type: FeedEventType.TwitterTweet,
      title: 'Title 2',
      likes: 0,
      comments: 0,
      timestamp: 0
    }
  ];

  return (
    <div>
      <div className="text-3xl mb-6">Feed</div>

      <ul className="space-y-8">
        {data.map((item, idx) => {
          return (
            <li key={idx} className="">
              <FeedItem data={item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CollectionFeed;
