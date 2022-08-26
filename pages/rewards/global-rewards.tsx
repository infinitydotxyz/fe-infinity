import React from 'react';
import { Heading } from 'src/components/common';
import { InfoBox } from 'src/components/rewards/info-box';

const GlobalRewards: React.FC = () => {
  return (
    <>
      <InfoBox
        title="Epoch 1"
        description={
          <>
            <p className="my-2">
              During this epoch, the exchange product is launched in beta alongside the $NFT token and the Infinity NFT
              collection. This epoch has 4 token rewards phases.
            </p>
            <Heading as="h3" className="text-3xl !font-body !font-medium">
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
        }
      >
        <InfoBox.SideInfo>
          <InfoBox.Stats
            title="Phase 1"
            description={
              <>
                <p>
                  <strong>2%</strong> of the total supply (<strong>40M tokens</strong>) are given out as trading rewards
                  in the form of in the form of fee refunds. Every <strong>1$</strong> in fees paid gets{' '}
                  <strong>50 $NFT</strong> tokens. These are split between the seller (30%). So a trade that has a 1$
                  fee will reward the buyer with 35 $NFT tokens and the seller with 15 $NFT tokens. Buyers with greater
                  than <strong>3 ETH volume</strong> will also get a <strong>free mint</strong> of the Infinity NFT.
                </p>
              </>
            }
          >
            <InfoBox.Stat label="Progress" value="0%" />
            <InfoBox.Stat label="Trading Rewards" value="2%" />
            <InfoBox.Stat label="$ / $NFT ratio" value="1 / 50" />
            <InfoBox.Stat label="Free Infinity NFT Mint" value="+3 ETH" />
          </InfoBox.Stats>
          <InfoBox.Stats
            title="Phase 2"
            description=" 3% of the total supply (60M tokens) are given out as trading rewards in the form of fee refunds. Every 1$ in fees paid gets 33 $NFT tokens. Buyers with greater than 5 ETH volume will also get a free mint of the Infinity NFT.
            "
          >
            <InfoBox.Stat label="Progress" value="0%" />
          </InfoBox.Stats>
          <InfoBox.Stats
            title="Phase 3"
            description="4% of the total supply (80M tokens) are given out as trading rewards in the form of fee refunds. Every 1$ in fees paid gets 25 $NFT tokens. Buyers with greater than 10 ETH volume will also get a free mint of the Infinity NFT.
            "
          >
            <InfoBox.Stat label="Progress" value="0%" />
          </InfoBox.Stats>
          <InfoBox.Stats
            title="Phase 4"
            description=" 5% of the total supply (100M tokens) are given out as trading rewards in the form of fee refunds. Every 1$ in fees paid gets 20 $NFT tokens. Buyers with greater than 20 ETH volume will also get a free mint of the Infinity NFT.
            "
          >
            <InfoBox.Stat label="Progress" value="0%" />
          </InfoBox.Stats>
        </InfoBox.SideInfo>
      </InfoBox>

      <InfoBox
        title="Epoch 2"
        description={
          <>
            <p className="my-2">
              In this epoch, in addition to token rewards for trading, curators of collections start earning curation
              rewards in ETH (see token utility section). The free Infinity NFT mint is no longer available starting
              this epoch.
            </p>
            <ul className="list-disc">
              <li>Curators earn ETH rewards. </li>
            </ul>
          </>
        }
      >
        <InfoBox.SideInfo>
          <InfoBox.Stats
            title="Phase"
            description="7% of the total supply (140M tokens) are given out as trading rewards in the form of fee refunds. Every
                1$ in fees paid gets 10 $NFT tokens."
          >
            <InfoBox.Stat label="Progress" value="0%" />
          </InfoBox.Stats>
        </InfoBox.SideInfo>
      </InfoBox>

      <InfoBox
        title="Epoch 3"
        description={
          <>
            <p className="my-2">Starting this epoch, token emissions go to zero. Curators still earn ETH rewards.</p>
            <ul className="list-disc my-2">
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
        }
      >
        <InfoBox.SideInfo>
          <InfoBox.Stats title="Phase">
            <InfoBox.Stat label="Progress" value="0%" />
          </InfoBox.Stats>
        </InfoBox.SideInfo>
      </InfoBox>
    </>
  );
};

export default GlobalRewards;
