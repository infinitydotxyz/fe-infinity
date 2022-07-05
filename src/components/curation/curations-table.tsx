import { Collection, CuratedCollection } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useCurationQuota } from 'src/hooks/api/useAvailableTokens';
import { useAppContext } from 'src/utils/context/AppContext';
import { mutate } from 'swr';
import { Field, FieldProps } from '../analytics/field';
import { Button } from '../common';
import { FeesAprStats, FeesAccruedStats } from './statistics';
import { VoteModal } from './vote-modal';
import { VoteProgressBar } from './vote-progress-bar';

const FieldWrapper: React.FC<FieldProps> = (props) => (
  <div className="w-full h-full  row-span-1 col-span-1">
    <Field {...props} />
  </div>
);

export type CurationTableProps = {
  collections: Collection[][];
  curations?: CuratedCollection[][];
};

export const CurationTable: React.FC<CurationTableProps> = ({
  collections: collectionsArray,
  curations: curationsArray
}) => {
  const router = useRouter();
  const { result: quota } = useCurationQuota();

  const collections = collectionsArray.flat();
  const curations = curationsArray?.flat();

  return (
    <>
      {collections.map((collection, i) => (
        <CurationRow
          key={i}
          collection={collection}
          curation={curations?.find(
            (curation) =>
              curation.collectionAddress === collection.address && curation.collectionChainId === collection.chainId
          )}
          index={i + 1}
          onClick={() => router.push(`/collection/${collection.slug}`)}
          votes={quota?.availableVotes || 0}
        />
      ))}
    </>
  );
};

export type CurationRowProps = {
  index: number;
  collection: Collection;
  curation?: CuratedCollection;
  onClick: () => void;
  votes: number;
};

export const CurationRow: React.FC<CurationRowProps> = ({ collection, curation, index, onClick, votes }) => {
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const { user } = useAppContext();

  // TODO: move vote modal to table component (row should be representational component only)

  return (
    <div className="mb-2">
      <VoteModal
        collection={collection}
        curated={curation}
        isOpen={isStakeModalOpen}
        onClose={() => setIsStakeModalOpen(false)}
        onVote={async (votes) => {
          const path = `/collections/${collection.slug}`;

          //TODO: remove code duplication with 'pages/collection/[name].tsx'

          // update local collection cache with latest amount of total votes
          await mutate(path, {
            ...collection,
            numCuratorVotes: (collection.numCuratorVotes || 0) + votes
          } as Collection);

          // reload user votes and estimates from API
          await mutate(`${path}/curated/${user?.address}`);
        }}
      />
      <div className="w-full h-full p-8 overflow-hidden rounded-3xl bg-gray-100 grid grid-cols-analytics place-items-center">
        <>
          <FieldWrapper value={index} type="index" />
          <FieldWrapper value={collection.metadata.profileImage} type="image" />
          <FieldWrapper value={collection.metadata.name} type="string" onClick={onClick} />
          <FieldWrapper type="custom">
            <FeesAprStats value={curation?.feesAPR || 0} />
            <br />
            <FeesAccruedStats value={curation?.fees || 0} />
          </FieldWrapper>
          <VoteProgressBar
            totalVotes={collection.numCuratorVotes || 0}
            votes={curation?.votes || 0}
            className="w-full h-full row-span-1 col-span-1 bg-white"
          />
          <FieldWrapper></FieldWrapper>
          <FieldWrapper type="custom">
            {votes > 0 && <Button onClick={() => setIsStakeModalOpen(true)}>Vote</Button>}
            {votes === 0 && <Button>Stake tokens to get votes</Button>}
          </FieldWrapper>
        </>
      </div>
    </div>
  );
};
