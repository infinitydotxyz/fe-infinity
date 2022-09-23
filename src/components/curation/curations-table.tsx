import { CuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { useRouter } from 'next/router';
import React from 'react';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { twMerge } from 'tailwind-merge';
import { Field, FieldProps } from '../analytics/field';
import { SVG } from '../common';
import { NumericVoteInputBox } from './input';
import { FeesAprStats, FeesAccruedStats } from './statistics';
import { StakeTokensButton } from './vote-modal';
import { VoteProgressBar } from './vote-progress-bar';

const FieldWrapper: React.FC<FieldProps & { className?: string }> = ({ className, ...props }) => (
  <div className={twMerge('w-full h-full', className)}>
    <Field {...props} />
  </div>
);

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
    <>
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
    </>
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
    <div className="mb-2 pointer-events-auto">
      <div className="w-full h-full p-8 overflow-hidden rounded-3xl bg-gray-100 flex items-center">
        <>
          <FieldWrapper value={index} type="index" className="w-1/2" />
          <FieldWrapper value={collection.profileImage} className="w-1/2 2xl:w-full" type="image" />
          <div className="w-full h-full overflow-hidden flex flex-row place-content-center">
            <div className="w-full h-full overflow-hidden grid justify-start items-center">
              <div className="text-theme-light-900 font-bold text-md flex flex-row cursor-pointer" onClick={onClick}>
                {collection.name} {collection.hasBlueCheck && <SVG.blueCheck className="h-5 w-5 ml-1.5" />}
              </div>
            </div>
          </div>
          <FieldWrapper type="custom">
            <FeesAprStats value={collection.feesAPR || 0} />
            <br />
            <FeesAccruedStats value={collection.fees || 0} />
          </FieldWrapper>
          <VoteProgressBar
            totalVotes={collection.numCuratorVotes || 0}
            votes={collection.votes || 0}
            className="mr-5"
          />
          {!isReadOnly && (
            <>
              <FieldWrapper type="custom" className="">
                {votes > 0 && <NumericVoteInputBox collectionId={`${collection.chainId}:${collection.address}`} />}
                {votes === 0 && <StakeTokensButton variant="white" />}
              </FieldWrapper>
            </>
          )}
        </>
      </div>
    </div>
  );
};
