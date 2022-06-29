import { formatNumber } from 'src/utils';
import { NextLink } from './next-link';
import { SVG } from './svg';
import { EthPrice } from './eth-price';
import { DiscoverOrderBy } from 'pages/marketplace';
import { CollectionStatsDto } from '@infinityxyz/lib-frontend/types/dto/stats';
import { ImageOrMissing } from './image-or-missing';

interface Props {
  orderBy: DiscoverOrderBy;
  collection: CollectionStatsDto; // CollectionSearchDto;
  routerQuery?: string;
}

export const DiscoverCollectionCard = ({ orderBy, collection, routerQuery }: Props) => {
  const twitterChange = formatNumber(collection.twitterFollowersPercentChange, 1);

  return (
    <div
      className={`w-full mx-auto sm:mx-0 bg-theme-light-100
      p-2 shadow-[0_20px_20px_1px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_20px_1px_rgba(0,0,0,0.15)]
      rounded-3xl cursor-pointer`}
    >
      <NextLink
        href={`/collection/${collection.slug}${routerQuery ? `?${routerQuery}` : ''}`}
        className="text-theme-light-800 font-heading tracking-tight mr-2"
      >
        <div style={{ height: '300px' }}>
          <ImageOrMissing src={collection?.collectionData?.metadata?.profileImage} />
        </div>
        <div className="pt-4 flex items-start">
          {/* <div className="flex flex-1 items-start font-body text-base font-medium px-5 text-black whitespace-normal">
            {collection.name}
            {collection.hasBlueCheck ? <SVG.blueCheck className="w-4 h-4 ml-1 mt-1" /> : null}
          </div> */}
          <span className="flex flex-1 items-start font-body text-base font-medium pl-2 text-black whitespace-pre-wrap">
            <span className="inline-block">{collection.name}</span>
            {collection.hasBlueCheck ? <SVG.blueCheck className="w-4 h-4 mt-1" style={{ width: 24 }} /> : null}
          </span>

          <div className="font-body text-base px-5 text-theme-light-800">
            <div className="flex flex-col">
              {orderBy === 'twitterFollowersPercentChange' && collection.twitterFollowersPercentChange >= 0.1 ? (
                <div className="flex flex-row-reverse items-center w-full">
                  <div className="text-green-600 ml-2">{twitterChange}% ↑</div>
                  <SVG.twitter className="w-4 h-4 ml-1.5" />
                </div>
              ) : null}

              {orderBy === 'volumePercentChange' && collection.volumePercentChange ? (
                <div className="flex items-center w-full">
                  <div className="text-green-600 ml-2">{formatNumber(collection.volumePercentChange, 1)}% ↑</div>
                </div>
              ) : null}

              {orderBy === 'volumePercentChange' && collection.volume > 0.01 ? (
                <div className="flex">
                  <EthPrice label={formatNumber(collection.volume, 2)} className="ml-2" />
                  <span className="ml-1 "> Volume</span>
                </div>
              ) : null}

              {orderBy === 'avgPricePercentChange' && collection.avgPricePercentChange ? (
                <div className="text-right w-full text-green-600 ml-2">
                  {formatNumber(collection.avgPricePercentChange)}% ↑
                </div>
              ) : null}

              {orderBy === 'avgPricePercentChange' && collection.avgPrice > 0.01 ? (
                <div className="flex">
                  <span className="ml-1 ">Avg Price</span>
                  <EthPrice label={formatNumber(collection.avgPrice, 2)} className="ml-2" />
                </div>
              ) : null}

              {orderBy !== 'avgPricePercentChange' &&
              orderBy !== 'volumePercentChange' &&
              collection.floorPrice > 0.01 ? (
                <div className="flex">
                  <span className="ml-1 ">Floor</span>
                  <EthPrice label={formatNumber(collection.floorPrice, 2)} className="ml-2" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </NextLink>
    </div>
  );
};
