import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React, { useState } from 'react';
import { Sort } from '../curation/sort';
import { Divider, ScrollLoader, Spinner } from '../common';
import { useCurationQuota } from 'src/hooks/api/useCurationQuota';
import { UserProfileDto } from './user-profile-dto';
import { CuratedCollectionsDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { useRouter } from 'next/router';
import { useFetchInfinite } from 'src/utils';
import { CurationTable } from '../curation/curations-table';
import { NoResultsBox } from '../curation/no-results-box';
import { CuratedTab } from '../curation/types';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

const InfoBox: React.FC<{ title: string; subtitle: string | number }> = ({ title, subtitle }) => {
  return (
    <div>
      <p className="font-heading font-normal text-gray-500">{title}</p>
      <strong>{subtitle}</strong>
    </div>
  );
};

export const UserPageCuratedTab: React.FC<{ userInfo: UserProfileDto }> = ({ userInfo }) => {
  const { chainId } = useOnboardContext();

  const [orderBy, setOrderBy] = useState(CuratedCollectionsOrderBy.Votes);
  const { result: quota } = useCurationQuota(`${chainId}:${userInfo.address}`);

  const { result, setSize, error, isLoading } = useFetchInfinite<CuratedCollectionsDto>(
    `/user/${userInfo.address}/curated`,
    {
      query: {
        orderBy,
        orderDirection: 'desc',
        limit: 10
      },
      apiParams: { requiresAuth: true }
    }
  );
  const router = useRouter();

  const fetchMore = () => setSize((size) => size + 1);

  return (
    <div className="min-h-[50vh] mt-[-66px]">
      <div className="flex flex-row-reverse mb-8 bg-transparent">
        <Sort onClick={setOrderBy} />
      </div>
      <Divider />
      <div className="flex flex-row justify-between my-4">
        <InfoBox title="Staked tokens" subtitle={quota?.totalStaked || 0} />
        <InfoBox
          title="Votes allocated"
          subtitle={`${Math.round(
            (quota?.availableVotes || 0) === 0
              ? 100
              : ((quota?.stake?.totalCuratedVotes || 0) / (quota?.availableVotes || 0)) * 100
          )}%`}
        />
        <InfoBox title="Curated" subtitle={quota?.stake?.totalCurated || 0} />
        {/* TODO: implement blended APR */}
        <InfoBox title="Blended APR" subtitle="0%" />
      </div>
      <div>
        {error ? <div className="flex flex-col mt-10">Unable to load this users' curated collections.</div> : null}

        {result && result[0].data?.length > 0 && (
          <CurationTable curatedCollections={result?.map((result) => result.data)} isReadOnly />
        )}

        {result && result[0].data?.length === 0 && (
          <NoResultsBox onClick={() => router.replace(`curation?tab=${CuratedTab.AllCurated}`)}>
            This user hasn't curated any collections yet
          </NoResultsBox>
        )}

        <ScrollLoader onFetchMore={fetchMore} />

        {isLoading && <Spinner />}
      </div>
    </div>
  );
};
