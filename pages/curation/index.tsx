import { useState } from 'react';
import { Button, PageBox, ToggleTab, useToggleTab } from 'src/components/common';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import { useRouter } from 'next/router';
import { AllCuratedCollections } from 'src/components/curation/all-curated';
import { Sort } from 'src/components/curation/sort';
import { MyCuratedCollections } from 'src/components/curation/my-curated';
import { CuratedTab } from 'src/components/curation/types';
import { useCurationBulkVoteContext } from 'src/utils/context/CurationBulkVoteContext';

export default function Curation() {
  const [orderBy, setOrderBy] = useState(CuratedCollectionsOrderBy.Votes);
  const tabs = [CuratedTab.AllCurated, CuratedTab.MyCurated];
  const router = useRouter();
  const { options, onChange, selected } = useToggleTab(tabs, (router?.query?.tab as string) || 'My Curated');
  const { votes: availableVotes } = useCurationBulkVoteContext();

  return (
    <PageBox title="Curation">
      <div className="flex justify-between mb-8">
        <div>
          <span className="p-4 border border-gray-300 rounded-3xl mr-2">
            <strong className="mr-2">{availableVotes}</strong>
            <span>veNFT available</span>
          </span>
          <Button>Confirm</Button>
        </div>
        <div className="flex flex-row">
          <ToggleTab
            className="font-heading pointer-events-auto"
            options={options}
            selected={selected}
            onChange={onChange}
          />
          <Sort onClick={setOrderBy} />
        </div>
      </div>
      <div>
        {selected === CuratedTab.AllCurated && <AllCuratedCollections orderBy={orderBy} />}
        {selected === CuratedTab.MyCurated && <MyCuratedCollections orderBy={orderBy} />}
      </div>
    </PageBox>
  );
}
