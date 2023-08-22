import { nFormatter } from 'src/utils';
import { Spacer } from '../common';
import { twMerge } from 'tailwind-merge';
import { RewardsSection } from './rewards-section';
import { SignInButton } from '../common/sign-in-button';
import { useUserPixlRewards } from 'src/hooks/api/useUserRewards';
import { buttonBorderColor, primaryShadow } from 'src/utils/ui-constants';

export const PixlRewards = ({ isDesktop }: { isDesktop: boolean }) => {
  const { rewards } = useUserPixlRewards();
  if (!rewards.result) {
    return <div>Loading...</div>;
  }

  if ('error' in rewards.result) {
    return (
      <RewardsSection title="Points" subTitle="Sign in to view your rewards">
        <div className={twMerge(isDesktop && primaryShadow, 'md:py-4 md:px-6')}>
          <div className="md:flex flex-wrap mt-4">
            <SignInButton />
          </div>
        </div>
      </RewardsSection>
    );
  }

  return (
    <RewardsSection
      title="Points"
      sideInfo={
        <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
          <div className="md:flex flex-wrap mt-4">
            <div className="lg:w-1/3 sm:w-full md:block flex justify-between">
              <div className="md:text-2xl font-heading font-bold">{nFormatter(rewards.result.totalPoints ?? 0, 2)}</div>
              <div className="text-sm mt-1">Total {rewards.result.totalPoints ?? 0}</div>
            </div>
            <Spacer />

            <div className="lg:w-1/3 sm:w-full md:block flex justify-between">
              <div className="md:text-2xl font-heading font-bold">
                {nFormatter(rewards.result.airdropPoints ?? 0, 2)}
              </div>
              <div className="text-sm mt-1">Airdrop {rewards.result.airdropPoints ?? 0}</div>
            </div>
            <Spacer />

            <div className="lg:w-1/3 sm:w-full md:block flex justify-between">
              <div className="md:text-2xl font-heading font-bold">
                {nFormatter(rewards.result.referralPoints ?? 0, 2)}
              </div>
              <div className="text-sm mt-1">Referral {rewards.result.referralPoints ?? 0}</div>
            </div>
            <Spacer />

            <div className="lg:w-1/3 sm:w-full md:block flex justify-between">
              <div className="md:text-2xl font-heading font-bold">{nFormatter(rewards.result.buyPoints ?? 0, 2)}</div>
              <div className="text-sm mt-1">Buy {rewards.result.buyPoints ?? 0}</div>
            </div>
            <Spacer />

            <div className="lg:w-1/3 sm:w-full md:block flex justify-between">
              <div className="md:text-2xl font-heading font-bold">
                {nFormatter(rewards.result.listingPoints ?? 0, 2)}
              </div>
              <div className="text-sm mt-1">Listing {rewards.result.listingPoints ?? 0}</div>
            </div>
            <Spacer />
          </div>
        </div>
      }
    />
  );
};
