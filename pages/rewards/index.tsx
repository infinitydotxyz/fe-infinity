import React, { useState } from 'react';
import { Button, PageBox } from 'src/components/common';
import { StakeTokensModal } from 'src/components/rewards/stake-tokens';
import { UnstakeTokensModal } from 'src/components/rewards/unstake-tokens';
import { useCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useStakePower } from 'src/hooks/contract/staker/useStakerGetStakePower';
import { useStakerTotalStaked } from 'src/hooks/contract/staker/useStakerTotalStaked';
import { useTokenBalance } from 'src/hooks/contract/token/useTokenBalance';
import { numberFormatter } from 'src/utils/number-formatter';

const RewardsPage = () => {
  const [showStakeTokensModal, setShowStakeTokensModal] = useState(false);
  const [showUnstakeTokensModal, setShowUnstakeTokensModal] = useState(false);
  const { balance } = useTokenBalance();
  const { staked } = useStakerTotalStaked();
  const { stakePower } = useStakePower(); // TODO: not sure if this is the correct contract method to call
  const { result: quota } = useCurationQuota();

  return (
    <PageBox title="Rewards" showTitle={false}>
      <div className="flex bg-theme-gray-100 p-10 rounded-2xl">
        <div className="w-2/3">
          <div className="text-4xl">Token Balance</div>
          <div className="w-1/2 mt-5 text-theme-gray-700">
            Stake NFT tokens to gain curation power in the form of veNFT. The longer you lock, the more curation power
            you’ll earn.
          </div>
        </div>

        <div className="w-1/3">
          <div className="bg-white py-6 px-6 rounded-2xl">
            <div>NFT Tokens</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{numberFormatter.format(balance)}</div>
                <div className="text-sm mt-1">Wallet</div>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{numberFormatter.format(staked)}</div>
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
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">$60M</div>
                <div className="text-sm mt-1">TVL</div>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <Button className="font-heading" onClick={() => setShowStakeTokensModal(true)}>
                  Stake
                </Button>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <Button variant="outline" className="font-heading ml-3" onClick={() => setShowUnstakeTokensModal(true)}>
                  Unstake
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Curation Rewards --- */}
      <div className="flex bg-theme-gray-100 p-10 rounded-2xl mt-5">
        <div className="w-2/3">
          <div className="text-4xl">Curation Rewards</div>
          <div className="w-1/2 mt-5 text-theme-gray-700">
            Earn curation rewards for voting on collections with your veNFT tokens. You'll gain a portion of the
            transaction fees for each collection you curate.
          </div>
        </div>

        <div className="w-1/3">
          <div className="bg-white py-6 px-6 rounded-2xl">
            <div>veNFT Tokens</div>
            <div className="flex flex-wrap mt-4">
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">{stakePower}</div>
                <div className="text-sm mt-1">Voting Power</div>
              </div>
              <div className="lg:w-1/4 sm:w-full">
                <div className="text-2xl font-heading font-bold">0</div>
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
                <Button className="font-heading">Claim Rewards</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Trading Rewards --- */}
      <div className="flex bg-theme-gray-100 p-10 rounded-2xl mt-5">
        <div className="w-2/3">
          <div className="text-4xl">Trading Rewards</div>
          <div className="w-1/2 mt-5 text-theme-gray-700">
            Earn trading rewards for buying and selling NFTs on Infinity. We’ll distribute the rewards each [period of
            time].
          </div>
        </div>

        <div className="w-1/3">
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
                <Button className="font-heading">Claim Rewards</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStakeTokensModal && <StakeTokensModal onClose={() => setShowStakeTokensModal(false)} />}
      {showUnstakeTokensModal && <UnstakeTokensModal onClose={() => setShowUnstakeTokensModal(false)} />}
    </PageBox>
  );
};

export default RewardsPage;
