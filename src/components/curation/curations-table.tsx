import { CuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useAppContext } from 'src/utils/context/AppContext';
import { mutate } from 'swr';
import { twMerge } from 'tailwind-merge';
import { Field, FieldProps } from '../analytics/field';
import { Button } from '../common';
import { FeesAprStats, FeesAccruedStats } from './statistics';
import { StakeTokensButton, VoteModal } from './vote-modal';
import { VoteProgressBar } from './vote-progress-bar';

const FieldWrapper: React.FC<FieldProps & { className?: string }> = ({ className, ...props }) => (
  <div className={twMerge('w-full h-full row-span-1 col-span-1', className)}>
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
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const { user, chainId } = useAppContext();

  // TODO: move vote modal to table component (row should be representational component only)

  return (
    <div className="mb-2">
      <VoteModal
        collection={collection}
        isOpen={isStakeModalOpen}
        onClose={() => setIsStakeModalOpen(false)}
        onVote={async (votes) => {
          const path = `/collections/${collection.slug}`;

          //TODO: remove code duplication with 'pages/collection/[name].tsx'

          // update local collection cache with latest amount of total votes
          await mutate(path, {
            ...collection,
            numCuratorVotes: (collection.numCuratorVotes || 0) + votes
          } as CuratedCollectionDto);

          // reload user votes and estimates from API
          await mutate(`${path}/curated/${chainId}:${user?.address}`);
        }}
      />
      <div className="w-full h-full p-8 overflow-hidden rounded-3xl bg-gray-100 grid grid-cols-analytics place-items-center">
        <>
          <FieldWrapper value={index} type="index" />
          <FieldWrapper value={collection.profileImage} type="image" />
          <FieldWrapper value={collection.name} type="string" onClick={onClick} />
          <FieldWrapper type="custom">
            <FeesAprStats value={collection.feesAPR || 0} />
            <br />
            <FeesAccruedStats value={collection.fees || 0} />
          </FieldWrapper>
          <VoteProgressBar
            totalVotes={collection.numCuratorVotes || 0}
            votes={collection.votes || 0}
            className="w-full h-full row-span-1 col-span-1 bg-white"
          />
          {!isReadOnly && (
            <>
              <FieldWrapper></FieldWrapper>
              <FieldWrapper type="custom">
                {votes > 0 && <Button onClick={() => setIsStakeModalOpen(true)}>Vote</Button>}
                {votes === 0 && <StakeTokensButton />}
              </FieldWrapper>
            </>
          )}
        </>
      </div>
    </div>
  );
};
