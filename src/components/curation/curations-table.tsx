import { Collection, CuratedCollection } from '@infinityxyz/lib-frontend/types/core';
import { FieldWrapper } from 'pages/curation';
import React from 'react';
import { useTokenVotes } from 'src/hooks/contract/token/useTokenVotes';
import { Button } from '../common';
import { FeesAprStats, FeesAccruedStats } from './statistics';
import { VoteProgressBar } from './vote-progress-bar';

export type CurationsTableProps = {
  collections: Collection[];
  curations: CuratedCollection[];
};

export const CurationsTable: React.FC<CurationsTableProps> = ({ collections, curations }) => {
  const { votes } = useTokenVotes();

  return (
    <>
      {collections?.map((collection, idx) => {
        return (
          <div key={idx} className="mb-2">
            <div className="w-full h-full p-8 overflow-hidden rounded-3xl bg-gray-100 grid grid-cols-analytics place-items-center">
              <>
                <FieldWrapper value={idx + 1} type="index" />
                <FieldWrapper value={collection.metadata.profileImage} type="image" />
                <FieldWrapper value={collection.metadata.name} type="string" />
                <FieldWrapper type="custom">
                  <FeesAprStats value={curations[idx]?.feesAPR || 0} />
                  <br />
                  <FeesAccruedStats value={curations[idx]?.fees || 0} />
                </FieldWrapper>
                <VoteProgressBar
                  totalVotes={collection.numCuratorVotes || 0}
                  votes={curations[idx]?.votes || 0}
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
      })}
    </>
  );
};
