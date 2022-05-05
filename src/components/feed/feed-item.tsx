// import { ExchangeEvent } from '@infinityxyz/lib/types/core/feed/NftEvent';
import { ExchangeEvent } from '@infinityxyz/lib/types/core/feed';
import { BaseFeedEvent, FeedEventType } from '@infinityxyz/lib/types/core/feed/FeedEvent';
import { ReactNode } from 'react';
import { AiOutlineComment, AiOutlineLike } from 'react-icons/ai';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { addUserLike } from 'src/utils/firestore/firestoreUtils';
import { Button, NftImage, EthPrice, NextLink } from 'src/components/common';

export type FeedEvent = BaseFeedEvent &
  ExchangeEvent & {
    id?: string;
    type?: FeedEventType;
    title?: string;
    text?: string;
    userDisplayName?: string;
  };

const TypeName: { [key: string]: ReactNode } = {
  [FeedEventType.TwitterTweet]: (
    <span className="rounded-xl bg-blue-400 text-white py-0.5 px-2 text-sm pb-1">Tweet</span>
  ),
  [FeedEventType.DiscordAnnouncement]: (
    <span className="rounded-xl bg-blue-600 text-white py-0.5 px-2 text-sm pb-1">Discord</span>
  ),
  [FeedEventType.NftSale]: <span className="rounded-xl bg-blue-700 text-white py-0.5 px-2 text-sm pb-1">Sale</span>
};

interface FeedItemProps {
  data: FeedEvent;
  onLike?: (event: FeedEvent) => void;
  onComment?: (event: FeedEvent) => void;
}

export const FeedItem = ({ data, onLike, onComment }: FeedItemProps) => {
  const { user, checkSignedIn } = useAppContext();

  const timestampStr = data.timestamp > 0 ? new Date(data.timestamp).toLocaleString() : '';
  return (
    <div>
      <header className="flex items-center">
        <NftImage
          chainId={data.chainId ?? '1'}
          collectionAddress={data.collectionAddress}
          className="border border-gray-300 rounded-3xl w-10 bg-gray-100"
        />
        <div className="ml-2">
          <div className="font-medium">
            <span className="font-bold">
              <a href={`/collection/${data.collectionSlug}`}>{data.collectionName}</a>
            </span>{' '}
            <span className="ml-4 text-secondary">{timestampStr}</span>
          </div>
          <div className="text-gray-500 text-sm mt-1">{TypeName[data.type] ?? ''}</div>
        </div>
      </header>
      <div className="ml-12">
        {data.type === FeedEventType.TwitterTweet && <TweetEvent data={data} />}
        {data.type === FeedEventType.DiscordAnnouncement && <Discord data={data} />}
        {data.type === FeedEventType.NftSale && <SaleEvent data={data} />}

        <footer className="text-sm mt-2 text-gray-500 flex items-center">
          <Button
            variant="plain"
            onClick={async () => {
              if (!checkSignedIn()) {
                return;
              }
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
};

const renderTextWithLinks = (txt: string | undefined) => {
  const urlRegex = /^(https?:\/\/[^/]+(\/[\w-]+)+)/;
  return (txt ?? '')
    .replace(/\n/g, ' ')
    .split(' ')
    .map((part) => {
      return urlRegex.test(part) ? (
        <a href={part} className="text-blue-500" target="_blank" rel="noopener noreferrer">
          {part}{' '}
        </a>
      ) : (
        part + ' '
      );
    });
};

const TweetEvent = ({ data }: FeedItemProps) => {
  return <div className="mt-4">{renderTextWithLinks(data.text ?? data.title)}</div>;
};

const Discord = ({ data }: FeedItemProps) => {
  return <div className="mt-4">{renderTextWithLinks(data.title)}</div>;
};

const SaleEvent = ({ data }: FeedItemProps) => {
  return (
    <div className="mt-4 border rounded-xl p-4 flex items-center bg-gray-100 font-heading">
      <NextLink href={`/asset/${data.chainId}/${data.collectionAddress}/${data.tokenId}`}>
        <img src={data.image} alt="NFT Image" className="w-24 rounded-xl" />
      </NextLink>
      <div className="flex w-full justify-between mx-8">
        <div className="text-sm">
          <div className="text-gray-400">Link</div>
          <div>
            <a href={`${getChainScannerBase('1')}/tx/${data.txHash}`} target="_blank" rel="noopener noreferrer">
              {ellipsisAddress(data.txHash)}
            </a>
          </div>
        </div>
        <div className="text-sm">
          <div className="text-gray-400">Buyer</div>
          <div>
            <a href={`${getChainScannerBase('1')}/address/${data.buyer}`} target="_blank" rel="noopener noreferrer">
              {data.buyerDisplayName ? ellipsisAddress(data.buyerDisplayName) : ellipsisAddress(data.buyer)}
            </a>
          </div>
        </div>
        <div className="text-sm">
          <div className="text-gray-400">Seller</div>
          <div>
            <a href={`${getChainScannerBase('1')}/address/${data.seller}`} target="_blank" rel="noopener noreferrer">
              {data.sellerDisplayName ? ellipsisAddress(data.sellerDisplayName) : ellipsisAddress(data.seller)}
            </a>
          </div>
        </div>
        <div className="text-sm">
          <div className="text-gray-400">Price</div>
          <div>
            <EthPrice label={`${data.price}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
