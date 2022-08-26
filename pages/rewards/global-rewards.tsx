import React from 'react';
import { Heading } from 'src/components/common';
import { InfoBox } from 'src/components/rewards/info-box';
import { RewardsProgressBar } from 'src/components/rewards/progressbar';

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
            <InfoBox.Stat label="Progress" value={<RewardsProgressBar amount={69} max={100} />} />
            <InfoBox.Stat label="Trading Rewards" value="2%" />
            <InfoBox.Stat label="$ / $NFT ratio" value="1 / 50" />
            <InfoBox.Stat label="Free Infinity NFT Mint" value="+3 ETH" />
          </InfoBox.Stats>
          <InfoBox.Stats
            title="Phase 2"
            description={
              <>
                <p>
                  <strong>3%</strong> of the total supply (<strong>60M tokens</strong>) are given out as trading rewards
                  in the form of fee refunds. Every <strong>1$</strong> in fees paid gets <strong>33 $NFT</strong>{' '}
                  tokens. Buyers with greater than <strong>5 ETH volume</strong> will also get a{' '}
                  <strong>free mint</strong> of the Infinity NFT.
                </p>
              </>
            }
          >
            <InfoBox.Stat label="Progress" value={<RewardsProgressBar amount={69} max={100} />} />
            <InfoBox.Stat label="Trading Rewards" value="3%" />
            <InfoBox.Stat label="$ / $NFT ratio" value="1 / 33" />
            <InfoBox.Stat label="Free Infinity NFT Mint" value="+5 ETH" />
          </InfoBox.Stats>
          <InfoBox.Stats
            title="Phase 3"
            description={
              <>
                <p>
                  <strong>4%</strong> of the total supply (<strong>80M tokens</strong>) are given out as trading rewards
                  in the form of fee refunds. Every <strong>1$</strong> in fees paid gets <strong>25 $NFT</strong>{' '}
                  tokens. Buyers with greater than <strong>10 ETH volume</strong> will also get a{' '}
                  <strong>free mint</strong> of the Infinity NFT.
                </p>
              </>
            }
          >
            <InfoBox.Stat label="Progress" value={<RewardsProgressBar amount={69} max={100} />} />
            <InfoBox.Stat label="Trading Rewards" value="4%" />
            <InfoBox.Stat label="$ / $NFT ratio" value="1 / 25" />
            <InfoBox.Stat label="Free Infinity NFT Mint" value="+10 ETH" />
          </InfoBox.Stats>
          <InfoBox.Stats
            title="Phase 4"
            description={
              <>
                <p>
                  <strong>5%</strong> of the total supply (<strong>100M tokens</strong>) are given out as trading
                  rewards in the form of fee refunds. Every <strong>1$</strong> in fees paid gets{' '}
                  <strong>20 $NFT</strong> tokens. Buyers with greater than <strong>20 ETH volume</strong> will also get
                  a <strong>free mint</strong> of the Infinity NFT.
                </p>
              </>
            }
          >
            <InfoBox.Stat label="Progress" value={<RewardsProgressBar amount={69} max={100} />} />
            <InfoBox.Stat label="Trading Rewards" value="5%" />
            <InfoBox.Stat label="$ / $NFT ratio" value="1 / 20" />
            <InfoBox.Stat label="Free Infinity NFT Mint" value="+20 ETH" />
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
            <Heading as="h3" className="text-3xl !font-body !font-medium !text-black">
              Benefits
            </Heading>
            <ul className="list-disc ml-4">
              <li>Curators earn ETH rewards. </li>
            </ul>
          </>
        }
      >
        <InfoBox.SideInfo>
          <InfoBox.Stats
            title="Phase"
            description={
              <>
                <p>
                  <strong>7%</strong> of the total supply (<strong>140M tokens</strong>) are given out as trading
                  rewards in the form of fee refunds. Every <strong>1$</strong> in fees paid gets{' '}
                  <strong>10 $NFT</strong> tokens.
                </p>
              </>
            }
          >
            <InfoBox.Stat label="Progress" value={<RewardsProgressBar amount={69} max={100} />} />
            <InfoBox.Stat label="Trading Rewards" value="7%" />
            <InfoBox.Stat label="$ / $NFT ratio" value="1 / 10" />
          </InfoBox.Stats>
        </InfoBox.SideInfo>
      </InfoBox>

      <InfoBox
        title="Epoch 3"
        description={
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
        }
      >
        <InfoBox.SideInfo>
          <InfoBox.Stats title="Phase" description="Token emissions go to zero. Curators still earn ETH rewards.">
            <InfoBox.Stat label="Progress" value={<RewardsProgressBar amount={69} max={100} />} />
          </InfoBox.Stats>
        </InfoBox.SideInfo>
      </InfoBox>
    </>
  );
};

export default GlobalRewards;
