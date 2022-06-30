import { Collection } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useTokenVotes } from 'src/hooks/contract/token/useTokenVotes';
import { Field, FieldProps } from '../analytics/field';
import { Button } from '../common';
import { FeesAprStats, FeesAccruedStats } from './statistics';
import { VoteProgressBar } from './vote-progress-bar';

const FieldWrapper: React.FC<FieldProps> = (props) => (
  <div className="w-full h-full  row-span-1 col-span-1">
    <Field {...props} />
  </div>
);

export type CurationTableProps = {
  collections: Collection[][];
};

export const CurationTable: React.FC<CurationTableProps> = ({ collections: collectionsArray }) => {
  const router = useRouter();
  const { votes } = useTokenVotes();

  return (
    <>
      {collectionsArray?.map((collections) => {
        return collections.map((collection, i) => (
          <CurationRow
            key={i}
            collection={collection}
            index={i + 1}
            onClick={() => router.push(`/collection/${collection.slug}`)}
            votes={votes}
          ></CurationRow>
        ));
      })}
    </>
  );
};

export type CurationRowProps = {
  index: number;
  collection: Collection;
  onClick: () => void;
  votes: number;
};

export const CurationRow: React.FC<CurationRowProps> = ({ collection, index, onClick, votes }) => {
  return (
    <div className="mb-2">
      <div className="w-full h-full p-8 overflow-hidden rounded-3xl bg-gray-100 grid grid-cols-analytics place-items-center">
        <>
          <FieldWrapper value={index} type="index" />
          <FieldWrapper value={collection.metadata.profileImage} type="image" />
          <FieldWrapper value={collection.metadata.name} type="string" onClick={onClick} />
          <FieldWrapper type="custom">
            <FeesAprStats value={0} />
            <br />
            <FeesAccruedStats value={0} />
          </FieldWrapper>
          <VoteProgressBar
            totalVotes={collection.numCuratorVotes || 0}
            votes={0}
            className="w-full h-full row-span-1 col-span-1 bg-white"
          />
          <FieldWrapper></FieldWrapper>
          <FieldWrapper type="custom">
            {votes > 0 && <Button>Vote</Button>}
            {votes === 0 && <Button>Stake tokens to get votes</Button>}
          </FieldWrapper>
        </>
      </div>
    </div>
  );
};
