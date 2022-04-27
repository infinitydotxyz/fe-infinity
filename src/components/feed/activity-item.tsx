import Link from 'next/link';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { EthPrice } from 'src/components/common';
import { FeedEvent } from './feed-item';

interface Props {
  event: FeedEvent;
}

export function ActivityItem({ event }: Props) {
  return (
    <div>
      <div className="bg-gray-100 p-10 rounded-2xl flex items-center">
        <Link href={`/asset/${event.chainId}/${event.collectionAddress}/${event.tokenId}`} passHref={true}>
          <a>
            <img src={event.image} className="w-16 max-h-[80px] rounded-[50%]" alt="NFT Image" />
          </a>
        </Link>
        <div className="flex justify-between w-full mx-8">
          <div className="text-sm">
            <div className="text-gray-400">Token</div>
            <div>
              <a
                href={`${getChainScannerBase(event.chainId)}/tx/${event.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ellipsisAddress(event.txHash)}
              </a>
            </div>
          </div>
          <div className="text-sm">
            <div className="text-gray-400">Buyer</div>
            <div>
              <a
                href={`${getChainScannerBase(event.chainId)}/address/${event.buyer}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.buyerDisplayName ? ellipsisAddress(event.buyerDisplayName) : ellipsisAddress(event.buyer)}
              </a>
            </div>
          </div>
          <div className="text-sm">
            <div className="text-gray-400">Seller</div>
            <div>
              <a
                href={`${getChainScannerBase(event.chainId)}/address/${event.seller}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.sellerDisplayName ? ellipsisAddress(event.sellerDisplayName) : ellipsisAddress(event.seller)}
              </a>
            </div>
          </div>
          <div className="text-sm">
            <div className="text-gray-400">Price</div>
            <div>
              <EthPrice label={`${event.price}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
