import React, { useState } from 'react';
import { Button, Heading } from 'src/components/common';
import { StakeTokensModal } from 'src/components/rewards/stake-tokens-modal';
import { UnstakeTokensModal } from 'src/components/rewards/unstake-tokens-modal';
import { useUserCurationQuota } from 'src/hooks/api/useCurationQuota';
import { numberFormatter } from 'src/utils/number-formatter';

const MyRewardsPage: React.FC = () => {
  const [showStakeTokensModal, setShowStakeTokensModal] = useState(false);
  const [showUnstakeTokensModal, setShowUnstakeTokensModal] = useState(false);
  const { result: quota, mutate: mutateQuota } = useUserCurationQuota();

  return (
    <>
      {/* Token Balance */}
      <div className="flex bg-theme-gray-100 p-10 rounded-2xl">
        <div className="w-1/2">
          <Heading as="h2" className="text-4xl font-body font-medium">
            Token Balance
          </Heading>
          <div className="w-1/2 mt-5 text-theme-gray-700">
            Stake NFT tokens to gain curation power in the form of veNFT. The longer you lock, the more curation power
            you’ll earn.
          </div>
        </div>

        <div className="w-1/2">
          <div className="bg-white py-6 px-6 rounded-2xl">
            <div>NFT Tokens</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">
                  {numberFormatter.format(quota?.tokenBalance || 0)}
                </div>
                <div className="text-sm mt-1">Wallet</div>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{numberFormatter.format(quota?.totalStaked || 0)}</div>
                <div className="text-sm mt-1">Staked</div>
              </div>
            </div>
          </div>
          <div className="bg-white py-4 pl-6 pr-12 rounded-2xl mt-4">
            <div>Token staking</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">10%</div>
                <div className="text-sm mt-1">Fee APR</div>
              </div>
              <div className="lg:w-1/4 sm:w-full mb-2">
                <div className="text-2xl font-heading font-bold">$60M</div>
                <div className="text-sm mt-1">TVL</div>
              </div>
              <div className="-ml-2">
                <Button size="large" className="font-heading" onClick={() => setShowStakeTokensModal(true)}>
                  Stake
                </Button>
                <Button
                  size="large"
                  variant="outline"
                  className="font-heading lg:ml-3"
                  onClick={() => setShowUnstakeTokensModal(true)}
                >
                  Unstake
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Curation Rewards --- */}
      <div className="flex bg-theme-gray-100 p-10 rounded-2xl mt-5">
        <div className="w-1/2">
          <Heading as="h2" className="text-4xl font-body font-medium">
            Curation Rewards
          </Heading>
          <div className="w-1/2 mt-5 text-theme-gray-700">
            Earn curation rewards for voting on collections with your veNFT tokens. You'll gain a portion of the
            transaction fees for each collection you curate.
          </div>
        </div>

        <div className="w-1/2">
          <div className="bg-white py-6 px-6 rounded-2xl">
            <div>veNFT Tokens</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{quota?.availableVotes || 0}</div>
                <div className="text-sm mt-1">Voting Power</div>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{quota?.stake.totalCurated || 0}</div>
                <div className="text-sm mt-1">Voted</div>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{quota?.availableVotes || 0}</div>
                <div className="text-sm mt-1">Remaining Votes</div>
              </div>
            </div>
          </div>
          <div className="bg-white py-4 pl-6 pr-12 rounded-2xl mt-4">
            <div>Token staking</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">3,569</div>
                <div className="text-sm mt-1">Earned rewards</div>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">10%</div>
                <div className="text-sm mt-1">Earned APR</div>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <Button size="large" className="font-heading">
                  Claim Rewards
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Trading Rewards --- */}
      <div className="flex bg-theme-gray-100 p-10 rounded-2xl mt-5">
        <div className="w-1/2">
          <Heading as="h2" className="text-4xl font-body font-medium">
            Trading Rewards
          </Heading>
          <div className="w-1/2 mt-5 text-theme-gray-700">
            Earn trading rewards for buying and selling NFTs on Infinity. We’ll distribute the rewards each [period of
            time].
          </div>
        </div>

        <div className="w-1/2">
          <div className="bg-white py-6 px-6 rounded-2xl">
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/3 sm:w-full">
                <div className="mb-4">Volume Traded</div>
                <div className="text-2xl font-heading font-bold">5,000</div>
                <div className="text-sm mt-1">ETH</div>
              </div>
              <div className="lg:w-1/3 sm:w-full">
                <div className="mb-4">Buys</div>
                <div className="text-2xl font-heading font-bold">4</div>
                <div className="text-sm mt-1">NFTs</div>
              </div>
              <div className="lg:w-1/3 sm:w-full">
                <div className="mb-4">Sells</div>
                <div className="text-2xl font-heading font-bold">6</div>
                <div className="text-sm mt-1">NFTs</div>
              </div>
            </div>
          </div>
          <div className="bg-white py-4 pl-6 pr-12 rounded-2xl mt-4">
            <div>Token rewards</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">3,569</div>
                <div className="text-sm mt-1">Earned rewards</div>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold"></div>
                <div className="text-sm mt-1"></div>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <Button size="large" className="font-heading">
                  Claim Rewards
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStakeTokensModal && (
        <StakeTokensModal
          onClose={() => {
            setShowStakeTokensModal(false);
            mutateQuota();
          }}
        />
      )}
      {showUnstakeTokensModal && <UnstakeTokensModal onClose={() => setShowUnstakeTokensModal(false)} />}
    </>
  );
};

export default MyRewardsPage;
