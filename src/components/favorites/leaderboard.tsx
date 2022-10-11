import { CollectionFavoriteDto } from '@infinityxyz/lib-frontend/types/dto';
import { formatNumber } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { NextLink, EZImage, SVG } from '../common';

export const LeaderBoardRow: React.FC<{ collection: CollectionFavoriteDto; className?: string; minimal?: boolean }> = ({
  collection,
  minimal = false,
  className
}) => {
  return (
    <div
      key={collection.collectionAddress}
      className={twMerge('bg-theme-light-200 px-10 h-[110px] rounded-3xl flex items-center font-heading', className)}
    >
      <NextLink href={`/collection/${collection?.slug}`}>
        <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={collection?.profileImage} />
      </NextLink>

      <div className="flex justify-between items-center w-full ml-6">
        <div className="w-44 flex items-center text-black font-bold font-body">
          <NextLink href={`/collection/${collection.slug}`} className="truncate">
            {collection.name}
          </NextLink>
          {collection?.hasBlueCheck && <SVG.blueCheck className="ml-1.5 shrink-0 w-4 h-4" />}
        </div>

        {!minimal && (
          <div className="w-1/9 max-w-[80px] min-w-[80px]">
            <div className="text-black font-bold font-body flex items-center">Favorites</div>
            <div>{formatNumber(collection.numFavorites)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Leaderboard: React.FC<{ collections: CollectionFavoriteDto[]; className?: string }> = ({
  collections,
  className
}) => {
  return (
    <div className={twMerge('space-y-4 w-full', className)}>
      {collections.map((collection) => (
        <LeaderBoardRow key={collection.collectionAddress} collection={collection} className="w-full" />
      ))}
    </div>
  );
};
