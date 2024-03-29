import { DistributionType } from '@infinityxyz/lib-frontend/types/core';
import { UserCumulativeRewardsDto } from '@infinityxyz/lib-frontend/types/dto';
import { ethers } from 'ethers';
import { useTheme } from 'next-themes';
import { CenteredContent, ConnectButton, Spacer, toastError, toastSuccess } from 'src/components/common';
import { useUserRewards } from 'src/hooks/api/useUserRewards';
import { useClaim } from 'src/hooks/contract/cm-distributor/claim';
import useScreenSize from 'src/hooks/useScreenSize';
import { nFormatter } from 'src/utils';
import { FLOW_TOKEN } from 'src/utils/constants';
import { useAppContext } from 'src/utils/context/AppContext';
import { buttonBorderColor, primaryShadow } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useAccount } from 'wagmi';
import { AButton } from '../astra/astra-button';
import { useChain } from 'src/hooks/useChain';
import { RewardsSection } from './rewards-section';

const MyRewards = () => {
  const { theme } = useTheme();
  const { selectedChain: chainId } = useChain();
  const darkMode = theme === 'dark';

  const { isDesktop } = useScreenSize();

  const { address } = useAccount();
  const { result: userRewards } = useUserRewards(chainId);
  const cumulativeAmountWei = userRewards?.totals?.totalRewards?.claim?.cumulativeAmount ?? '0';
  const cumulativeAmount = parseFloat(ethers.utils.formatEther(cumulativeAmountWei));
  const claimableAmountWei = userRewards?.totals?.totalRewards?.claim?.claimableWei ?? '0';
  const claimableAmount = userRewards?.totals?.totalRewards?.claim?.claimableEth ?? 0;
  const claimedAmount = userRewards?.totals?.totalRewards?.claim?.claimedEth ?? 0;
  const merkleRoot = userRewards?.totals?.totalRewards?.claim?.merkleRoot;
  const merkleProof = userRewards?.totals?.totalRewards?.claim?.merkleProof;

  const { claim } = useClaim(chainId);
  const { setTxnHash } = useAppContext();

  const doClaim = async (type: DistributionType, props?: UserCumulativeRewardsDto) => {
    const claimableWei = props?.claimableWei || claimableAmountWei || '0';
    if (claimableWei === '0') {
      toastError('Nothing to claim', darkMode);
      return;
    }

    const { hash } = await claim({
      type,
      account: props?.account ?? address ?? '',
      cumulativeAmount: props?.cumulativeAmount ?? cumulativeAmountWei,
      merkleRoot: props?.merkleRoot ?? merkleRoot ?? '',
      merkleProof: props?.merkleProof ?? merkleProof ?? []
    });
    toastSuccess('Transaction submitted', darkMode);
    setTxnHash(hash);
  };

  if (!address) {
    return (
      <CenteredContent>
        <ConnectButton />
      </CenteredContent>
    );
  }

  return (
    <div className="space-y-5 mt-5 pb-6 mb-16 px-5">
      {/* <PixlRewards /> */}

      {/* {address && <TokenBalances isDesktop={isDesktop} address={address} chainId="1" />} */}

      {cumulativeAmount > 0 && (
        <RewardsSection
          title="Earned Rewards"
          subTitle={<div className="text-sm">Earned ${FLOW_TOKEN.symbol} rewards.</div>}
          sideInfo={
            <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
              <div>${FLOW_TOKEN.symbol}</div>
              <div className="md:flex flex-wrap mt-4">
                <div className="lg:w-1/3 sm:w-full md:block flex justify-between">
                  <div className="text-sm mt-1">Earned</div>
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(cumulativeAmount, 2)}</div>
                </div>
                <Spacer />

                <div className="lg:w-1/3 sm:w-full md:block flex justify-between">
                  <div className="text-sm mt-1">Claimed</div>
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(claimedAmount, 2)}</div>
                </div>
                <Spacer />

                <div className="lg:w-1/3 sm:w-full md:block flex justify-between">
                  <div className="text-sm mt-1">Claimable</div>
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(claimableAmount, 2)}</div>
                </div>
                <Spacer />
              </div>

              {claimableAmountWei !== '0' && (
                <div className="w-full flex mt-4 items-center flex-wrap space-x-3">
                  <AButton primary onClick={() => doClaim(DistributionType.XFL)}>
                    Claim
                  </AButton>
                </div>
              )}
            </div>
          }
        ></RewardsSection>
      )}
    </div>
  );
};

export default MyRewards;
