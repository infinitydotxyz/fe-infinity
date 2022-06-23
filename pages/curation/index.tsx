import { BaseCollection, CuratedCollection } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { Field, FieldProps } from 'src/components/analytics/field';
import { Button, Dropdown, PageBox, ScrollLoader } from 'src/components/common';
import { FeesAccruedStats, FeesAprStats } from 'src/components/curation/statistics';
import { VoteProgressBar } from 'src/components/curation/vote-progress-bar';
import { useTokenVotes } from 'src/hooks/contract/token/useTokenVotes';
import { apiGet } from 'src/utils';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import { useAppContext } from 'src/utils/context/AppContext';

enum Tab {
  MyCurated = 'my_curated',
  AllCurated = 'all_curated'
}

const FieldWrapper: React.FC<FieldProps> = (props) => (
  <div className="w-full h-full  row-span-1 col-span-1">
    <Field {...props} />
  </div>
);

export default function Curation() {
  const { user } = useAppContext();
  const [tab, setTab] = useState(Tab.AllCurated);
  const { votes } = useTokenVotes();
  const [cursor, setCursor] = useState('');
  const [orderBy, setOrderBy] = useState(CuratedCollectionsOrderBy.Votes);
  const [collections, setCollections] = useState<BaseCollection[]>([]);
  const [curations, setCurations] = useState<CuratedCollection[]>([]);
  const [error, setError] = useState<string>();
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetch = async () => {
    const requiresAuth = !!user?.address;

    // Query the API to get a list of the most voted collections.
    // If the user is logged in, fetch the user's votes and estimations too.
    const { result, error } = await apiGet(`/collections/curated/${user?.address || ''}`, {
      query: {
        orderBy,
        orderDirection: 'desc',
        limit: 10,
        cursor
      },
      requiresAuth
    });

    if (error) {
      setError(error);
      setCollections([]);
      setCursor('');
      setHasNextPage(false);
      return;
    }

    // Only update curation data when the user is authenticated.
    if (requiresAuth) {
      setCurations((state) => [...state, ...(result.data.curations || [])]);
      return;
    }

    setCollections((state) => [...state, ...result.data.collections]);
    setCursor(result.cursor);
    setHasNextPage(result.hasNextPage);
  };

  useEffect(() => void fetch(), [user?.address]);

  return (
    <PageBox title="Curation">
      <div className="flex justify-between mb-8">
        <div>
          <span className="p-4 border border-gray-300 rounded-3xl mr-2">
            <strong className="mr-2">120,350</strong>
            <span>veNFT available</span>
          </span>
          <Button>Confirm</Button>
        </div>
        <div>
          <Button
            variant={tab === Tab.AllCurated ? 'primary' : 'outline'}
            className="font-heading"
            onClick={() => setTab(Tab.AllCurated)}
          >
            All Curated
          </Button>
          <Button
            variant={tab === Tab.MyCurated ? 'primary' : 'outline'}
            className="font-heading ml-2"
            onClick={() => setTab(Tab.MyCurated)}
          >
            My Curated
          </Button>
          <Dropdown
            label="Sort"
            className="pointer-events-auto ml-8"
            items={[
              {
                label: 'Most votes',
                onClick: () => setOrderBy(CuratedCollectionsOrderBy.Votes)
              },
              {
                label: 'APR: High to low',
                onClick: () => setOrderBy(CuratedCollectionsOrderBy.AprHighToLow)
              },
              {
                label: 'APR: Low to high',
                onClick: () => setOrderBy(CuratedCollectionsOrderBy.AprLowToHigh)
              }
            ]}
          />
        </div>
      </div>
      <div>
        {error ? <div className="flex flex-col mt-10">Unable to load curated collections.</div> : null}

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

        {tab === Tab.MyCurated && collections?.length === 0 && (
          // TODO: match design
          <div className="text-center">
            <p className="font-body font-medium">You haven't curated any collections yet</p>
            <Button className="mt-2">Curate now</Button>
          </div>
        )}

        {hasNextPage && <ScrollLoader onFetchMore={fetch} />}
      </div>
    </PageBox>
  );
}
