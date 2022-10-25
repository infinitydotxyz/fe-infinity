import { CuratedCollectionDto, UserCuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto';
import { round } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import React from 'react';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { nFormatter } from 'src/utils';
import { BlueCheckInline, EZImage } from '../common';
import { ProgressBar } from '../common/progress-bar';
import { NumericVoteInputBox } from './input';
import { FeesAprStats, FeesAccruedStats } from './statistics';
import { StakeTokensButton } from './vote-modal';

interface Props {
  curatedCollections: (CuratedCollectionDto | UserCuratedCollectionDto)[];
  isReadOnly?: boolean;
}

export const CurationTable: React.FC<Props> = ({ curatedCollections, isReadOnly = false }) => {
  const router = useRouter();
  const { result: quota } = useUserCurationQuota();

  return (
    <div className="space-y-3">
      {curatedCollections.map((curatedCollection, i) => (
        <CurationRow
          key={i}
          collection={curatedCollection}
          index={i + 1}
          onClick={() => router.push(`/collection/${curatedCollection.slug}`)}
          votes={quota?.availableVotes || 0}
          isReadOnly={isReadOnly}
        />
      ))}
    </div>
  );
};

// ==========================================================

interface Props2 {
  index: number;
  collection: CuratedCollectionDto | UserCuratedCollectionDto;
  onClick: () => void;
  votes: number;
  isReadOnly?: boolean;
}

export const CurationRow: React.FC<Props2> = ({ collection, index, onClick, votes, isReadOnly = false }) => {
  return (
    <div className="pointer-events-auto">
      <div
        className="w-full h-full px-7 grid gap-5 py-6 overflow-hidden rounded-3xl bg-gray-100 items-center"
        style={{ gridTemplateColumns: 'minmax(0, 3fr) repeat(auto-fit, minmax(0, 2fr))' }}
      >
        <div className="flex w-full flex-1 items-center">
          <div className="text-theme-light-800 text-xl mr-6 min-w-[32px] text-right font-heading">{index}</div>
          <EZImage src={collection.profileImage} className="mr-3 overflow-hidden w-14 h-14 rounded-full" />
          <div className="w-full h-full overflow-hidden justify-start items-center flex">
            <div className="text-theme-light-900 font-bold text-md cursor-pointer" onClick={onClick}>
              {collection.name}
              {collection.hasBlueCheck && <BlueCheckInline />}
            </div>
          </div>
        </div>
        <div>
          <FeesAprStats value={nFormatter(round(collection.feesAPR ?? 0, 2)) ?? 0} />
          <br />
          <FeesAccruedStats value={nFormatter(round(collection.fees ?? 0, 2)) ?? 0} />
        </div>
        <ProgressBar
          max={collection.numCuratorVotes}
          amount={'curator' in collection ? collection.curator.votes : 0}
          units="votes"
          className="bg-white max-w-[280px] font-normal"
          overlayClassName="text-base top-1"
        />

        {!isReadOnly && (
          <>
            {votes > 0 && <NumericVoteInputBox collectionId={`${collection.chainId}:${collection.address}`} />}
            {votes === 0 && <StakeTokensButton variant="white" />}
          </>
        )}
      </div>
    </div>
  );
};
