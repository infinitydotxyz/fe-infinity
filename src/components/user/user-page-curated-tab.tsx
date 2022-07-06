import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import React, { useState } from 'react';
import { Sort } from '../curation/sort';
import { MyCuratedCollections } from '../curation/my-curated';
import { Divider } from '../common';
import { useStakerTotalStaked } from 'src/hooks/contract/staker/useStakerTotalStaked';
import { useCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useAppContext } from 'src/utils/context/AppContext';
import { useFetch } from 'src/utils';
import { UserProfileDto } from './user-profile-dto';
import { useTokenVotes } from 'src/hooks/contract/token/useTokenVotes';

const InfoBox: React.FC<{ title: string; subtitle: string | number }> = ({ title, subtitle }) => {
  return (
    <div>
      <p className="font-heading font-normal text-gray-500">{title}</p>
      <strong>{subtitle}</strong>
    </div>
  );
};

export const UserPageCuratedTab: React.FC = () => {
  const [orderBy, setOrderBy] = useState(CuratedCollectionsOrderBy.Votes);
  const { staked } = useStakerTotalStaked();
  const { result: quota } = useCurationQuota();
  const { user } = useAppContext();
  const { result: profile } = useFetch<UserProfileDto>(user?.address ? `/user/${user.address}` : null);

  return (
    <div className="min-h-[1024px] mt-[-66px]">
      <div className="flex flex-row-reverse mb-8 bg-transparent">
        <Sort onClick={setOrderBy} />
      </div>
      <Divider />
      <div className="flex flex-row justify-between my-4">
        <InfoBox title="Staked tokens" subtitle={staked} />
        <InfoBox
          title="Votes allocated"
          subtitle={`${
            (quota?.availableVotes || 0) === 0
              ? 100
              : ((profile?.totalCuratedVotes || 0) / (quota?.availableVotes || 0)) * 100
          }%`}
        />
        <InfoBox title="Curated" subtitle={profile?.totalCurated || 0} />
        {/* TODO: implement blended APR */}
        <InfoBox title="Blended APR" subtitle="0%" />
      </div>
      <MyCuratedCollections orderBy={orderBy} />
    </div>
  );
};
