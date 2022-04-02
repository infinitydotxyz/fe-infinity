// import { ExchangeEvent } from '@infinityxyz/lib/types/core/feed/NftEvent';
import { ExchangeEvent } from '@infinityxyz/lib/types/core/feed';
import { BaseFeedEvent, FeedEventType } from '@infinityxyz/lib/types/core/feed/FeedEvent';
import { AiOutlineComment, AiOutlineLike } from 'react-icons/ai';
import { ellipsisAddress } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { addUserLike } from 'src/utils/firestore/firestoreUtils';
import { Button } from '../common';

export type FeedEvent = BaseFeedEvent &
  ExchangeEvent & {
    id?: string;
    type?: FeedEventType;
    title?: string;
    userDisplayName?: string;
  };

export type Comment = {
  userAddress: string;
  comment: string;
  timestamp: number;
};

interface FeedItemProps {
  data: FeedEvent;
  onLike?: (event: FeedEvent) => void;
  onComment?: (event: FeedEvent) => void;
}

export function FeedItem({ data, onLike, onComment }: FeedItemProps) {
  const { user } = useAppContext();

  const timestampStr = data.timestamp > 0 ? new Date(data.timestamp).toLocaleString() : '';
  return (
    <div>
      <header className="flex items-center">
        <span className="border border-gray-300 p-2 rounded-3xl w-10 bg-gray-100">&nbsp;</span>
        <div className="ml-2">
          <div className="font-medium text-sm">Username - {timestampStr}</div>
          <div className="text-gray-500 text-sm">Type</div>
        </div>
      </header>
      <div className="ml-12">
        {data.type === FeedEventType.TwitterTweet && <TweetEvent data={data} />}
        {data.type === FeedEventType.NftSale && <SaleEvent data={data} />}

        <footer className="text-sm mt-2 text-gray-500 flex items-center">
          <Button
            variant="plain"
            onClick={async () => {
              if (user && user?.address) {
                await addUserLike(data.id || '', user?.address, () => {
                  if (onLike) {
                    onLike(data);
                  }
                });
              }
            }}
            className="flex items-center"
          >
            <AiOutlineLike size={22} className="mr-2" /> {data.likes}
          </Button>

          <Button
            variant="plain"
            onClick={() => {
              if (onComment) {
                onComment(data);
              }
            }}
            className="flex items-center"
          >
            <AiOutlineComment size={22} className="mr-2" /> {data.comments}
          </Button>
        </footer>
      </div>
    </div>
  );
}

function TweetEvent({ data }: FeedItemProps) {
  return <div className="mt-2 border rounded-xl p-2">{data.title}</div>;
}

function SaleEvent({ data }: FeedItemProps) {
  return (
    <div className="mt-2 border rounded-xl p-2 flex items-center">
      <img src={data.image} className="w-20 h-20 rounded-xl" alt="NFT Image" />
      <div className="flex w-full justify-between ml-4">
        <div className="text-sm">
          <div className="text-gray-400">Link</div>
          <div>{ellipsisAddress(data.txHash)}</div>
        </div>
        <div className="text-sm">
          <div className="text-gray-400">Buyer</div>
          <div>{data.buyerDisplayName ? ellipsisAddress(data.buyerDisplayName) : ellipsisAddress(data.buyer)}</div>
        </div>
        <div className="text-sm">
          <div className="text-gray-400">Seller</div>
          <div>{data.sellerDisplayName ? ellipsisAddress(data.sellerDisplayName) : ellipsisAddress(data.seller)}</div>
        </div>
        <div className="text-sm">
          <div className="text-gray-400">Price</div>
          <div>{data.price}</div>
        </div>
      </div>
    </div>
  );
}
