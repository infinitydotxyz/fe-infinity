import { CuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { useRouter } from 'next/router';
import React from 'react';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { twMerge } from 'tailwind-merge';
import { Field, FieldProps } from '../analytics/field';
import { BlueCheck, EZImage } from '../common';
import { NumericVoteInputBox } from './input';
import { FeesAprStats, FeesAccruedStats } from './statistics';
import { StakeTokensButton } from './vote-modal';
import { VoteProgressBar } from './vote-progress-bar';

const FieldWrapper: React.FC<FieldProps & { className?: string }> = ({ className = '', ...props }) => {
  return (
    <div className={twMerge(' ', className)}>
      <Field {...props} />
    </div>
  );
};

export type CurationTableProps = {
  curatedCollections: CuratedCollectionDto[][];
  isReadOnly?: boolean;
};

export const CurationTable: React.FC<CurationTableProps> = ({
  curatedCollections: curatedCollectionsArray,
  isReadOnly = false
}) => {
  const router = useRouter();
  const { result: quota } = useUserCurationQuota();

  const curatedCollections = curatedCollectionsArray?.flat();

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

export type CurationRowProps = {
  index: number;
  collection: CuratedCollectionDto;
  onClick: () => void;
  votes: number;
  isReadOnly?: boolean;
};

export const CurationRow: React.FC<CurationRowProps> = ({ collection, index, onClick, votes, isReadOnly = false }) => {
  return (
    <div className="pointer-events-auto">
      <div className="w-full h-full px-7  py-6 overflow-hidden rounded-3xl bg-gray-100 flex items-center">
        <div className="flex w-full flex-1 items-center">
          <div className="text-theme-light-800 text-xl mr-6 min-w-[32px] text-right font-heading">{index}</div>
          <EZImage src={collection.profileImage} className="mr-3 overflow-hidden w-14 h-14 rounded-full" />
          <div className="w-full h-full overflow-hidden mr-6  justify-start items-center flex    ">
            <div className="text-theme-light-900 items-center font-bold text-md flex cursor-pointer" onClick={onClick}>
              {collection.name} {collection.hasBlueCheck && <BlueCheck className="ml-1.5" />}
            </div>
          </div>
        </div>
        <FieldWrapper type="custom" className="mr-6">
          <FeesAprStats value={collection.feesAPR || 0} />
          <br />
          <FeesAccruedStats value={collection.fees || 0} />
        </FieldWrapper>
        <VoteProgressBar
          totalVotes={collection.numCuratorVotes || 0}
          votes={collection.votes || 0}
          className="mr-5 max-w-[220px]"
        />
        {!isReadOnly && (
          <FieldWrapper type="custom" className="">
            {votes > 0 && <NumericVoteInputBox collectionId={`${collection.chainId}:${collection.address}`} />}
            {votes === 0 && <StakeTokensButton variant="white" />}
          </FieldWrapper>
        )}
      </div>
    </div>
  );
};
