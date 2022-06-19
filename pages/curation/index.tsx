import { BaseCollection, CreationFlow, TokenStandard } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { Field, FieldProps } from 'src/components/analytics/field';
import { Button, Dropdown, PageBox } from 'src/components/common';
import { FeesAccruedStats, FeesAprStats } from 'src/components/curation/statistics';
import { VoteProgressBar } from 'src/components/curation/vote-progress-bar';
import { useTokenVotes } from 'src/hooks/contract/token/useTokenVotes';

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
  const [tab, setTab] = useState(Tab.MyCurated);
  const { votes } = useTokenVotes();
  const curatedCollections: BaseCollection[] = [
    {
      address: '',
      chainId: '1',
      deployedAt: Date.now(),
      deployedAtBlock: 1,
      deployer: '',
      hasBlueCheck: true,
      indexInitiator: '',
      metadata: {
        bannerImage: '',
        description: 'this is a description',
        links: { timestamp: Date.now() },
        name: 'Foo Bar',
        profileImage:
          'https://lh3.googleusercontent.com/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTcUPFoG53VnLJezYi8hAs0OxNZwlw6Y-dmI=s120',
        symbol: 'STFU'
      },
      numNfts: 0,
      numOwnersUpdatedAt: 0,
      numTraitTypes: 0,
      owner: '',
      slug: '',
      state: {
        create: { progress: 100, step: CreationFlow.AggregateMetadata, updatedAt: Date.now() },
        export: { done: false },
        version: 1
      },
      tokenStandard: TokenStandard.ERC721
    }
  ];

  // TODO: we should refactor this 'field' stuff some time, it's become barely maintainable O.o (use React composition pattern and preferably an actual table instead)

  return (
    <PageBox title="Curation">
      <div className="flex justify-between mb-8">
        <div>
          <strong className="p-4 border border-gray-300 rounded-3xl mr-2">120,350 veNFT available</strong>
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
                onClick: () => console.log('clicked item 1')
              },
              {
                label: 'APR: High to low',
                onClick: () => console.log('clicked item 2')
              },
              {
                label: 'APR: Low to high',
                onClick: () => console.log('clicked item 3')
              }
            ]}
          />
        </div>
      </div>
      <div>
        {curatedCollections?.map((collection, idx) => {
          return (
            <div key={idx} className="mb-2">
              <div className="w-full h-full p-8 overflow-hidden rounded-3xl bg-gray-100 grid grid-cols-analytics place-items-center">
                <>
                  <FieldWrapper value={idx + 1} type="index" />
                  <FieldWrapper value={collection.metadata.profileImage} type="image" />
                  <FieldWrapper value={collection.metadata.name} type="string" />
                  <FieldWrapper type="custom">
                    <FeesAprStats value={'168'} />
                    <br />
                    <FeesAccruedStats value={'168'} />
                  </FieldWrapper>
                  <FieldWrapper type="custom">
                    <VoteProgressBar totalVotes={100} votes={80} />
                  </FieldWrapper>
                  <VoteProgressBar
                    totalVotes={100}
                    votes={80}
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
        {curatedCollections.length === 0 && (
          // TODO: match design
          <div className="text-center">
            <p className="font-body font-medium">You haven't curated any collections yet</p>
            <Button className="mt-2">Curate now</Button>
          </div>
        )}

        {/*  {data.isLoading && <LoadingAnalytics />}

        <ScrollLoader
          onFetchMore={() => {
            if (data?.result?.cursor) {
              setCursor(data?.result?.cursor);
            }
          }} */}
      </div>
    </PageBox>
  );
}
