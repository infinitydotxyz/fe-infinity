import { Epoch } from '@infinityxyz/lib-frontend/types/core';
import { RewardEpochDto, RewardsProgramByEpochDto } from '@infinityxyz/lib-frontend/types/dto/rewards';
import React, { useEffect } from 'react';
import { Heading, Spinner } from 'src/components/common';
import { InfoBox } from 'src/components/rewards/info-box';
import { RewardPhase } from 'src/components/rewards/reward-phase';
import { useFetch } from 'src/utils';

const getEpochDescription = (epoch: Epoch) => {
  switch (epoch) {
    case Epoch.One:
      return (
        <>
          <p className="my-2">
            During this epoch, the exchange product is launched in beta alongside the $NFT token and the Infinity NFT
            collection. This epoch has 4 token rewards phases.
          </p>
          <Heading as="h3" className="text-3xl !font-body !font-medium !text-black">
            Benefits
          </Heading>
          <p className="my-2">Holders of the Infinity NFT are MVPs with benefits including (but not limited to):</p>
          <ul className="ml-4 list-disc">
            <li>Early access to all future Infinity products</li>
            <li>
              Fee distribution from non-curated collections until then end of 2023 (see token utility section below)
            </li>
            <li>Partner offers, raffles, allowlists</li>
          </ul>
        </>
      );

    case Epoch.Two:
      return (
        <>
          <p className="my-2">
            In this epoch, in addition to token rewards for trading, curators of collections start earning curation
            rewards in ETH (see token utility section). The free Infinity NFT mint is no longer available starting this
            epoch.
          </p>
          <Heading as="h3" className="text-3xl !font-body !font-medium !text-black">
            Benefits
          </Heading>
          <ul className="list-disc ml-4">
            <li>Curators earn ETH rewards. </li>
          </ul>
        </>
      );
    case Epoch.Three:
      return (
        <>
          <p className="my-2">Starting this epoch, token emissions go to zero. Curators still earn ETH rewards.</p>
          <Heading as="h3" className="text-3xl !font-body !font-medium !text-black">
            Benefits
          </Heading>
          <ul className="list-disc my-2 ml-4">
            <li>All ETH rewards go to curators.</li>
            <li>
              Only the tokens in circulation are used for staking that gives users voting power. In other words, the
              only possible curators are the traders/collectors from epochs 1 and 2.
            </li>
          </ul>
          <p className="my-2">
            Trading rewards are distributed weekly or at the end of each phase/epoch, whichever comes first.
          </p>
        </>
      );
  }
};

const GlobalRewards: React.FC = () => {
  const data = useFetch<RewardsProgramByEpochDto>('/rewards');
  const [epochs, setEpochs] = React.useState<RewardEpochDto[]>([]);

  useEffect(() => {
    const orderedEpochs = [data?.result?.[Epoch.One], data?.result?.[Epoch.Two], data?.result?.[Epoch.Three]].filter(
      (item) => !!item
    );
    setEpochs(orderedEpochs as RewardEpochDto[]);
  }, [data.result]);

  return (
    <>
      {data.isLoading && <Spinner />}
      {epochs.length > 0 ? (
        epochs.map((item) => {
          return (
            <InfoBox title={item.name} description={getEpochDescription(item.name)}>
              <InfoBox.SideInfo>
                {item.phases.map((phase) => {
                  return <RewardPhase phase={phase} />;
                })}
              </InfoBox.SideInfo>
            </InfoBox>
          );
        })
      ) : (
        <div className="flex flex-col mt-10">Unable to load rewards.</div>
      )}
    </>
  );
};

export default GlobalRewards;
