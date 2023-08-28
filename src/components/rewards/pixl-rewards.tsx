import { nFormatter } from 'src/utils';
import { ClipboardButton, Spacer } from '../common';
import { twMerge } from 'tailwind-merge';
import { RewardsSection } from './rewards-section';
import { SignInButton } from '../common/sign-in-button';
import { useUserPixlRewards } from 'src/hooks/api/useUserRewards';
import { buttonBorderColor, primaryShadow } from 'src/utils/ui-constants';
import { useSaveReferral } from 'src/hooks/api/useSaveReferral';
const tokenItemClassname = 'lg:w-1/6 sm:w-full gap-1 flex md:flex-col items-center justify-between text-sm mt-1';

export const PixlRewards = ({ isDesktop }: { isDesktop: boolean }) => {
  // save referrals based on query params
  useSaveReferral();
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
      subTitle={
        <div className="flex flex-col md:flex-row text-sm">
          <div className="mr-1 min-w-fit">Referral Code:</div>
          <div className="flex flex-row">
            {rewards.result.referralCode}
            <ClipboardButton
              className="ml-2 mt-[0.125rem]"
              textToCopy={`https://pixl.so/rewards?referrer=${rewards.result.referralCode}`}
            />
          </div>
        </div>
      }
      sideInfo={
        <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
          <div className="md:flex flex-wrap">
            <div className={tokenItemClassname}>
              <div>Referral Points</div>
              <div className="md:text-lg font-heading font-bold text-center">
                {nFormatter(rewards.result.referralPoints, 2)}
              </div>
            </div>
            <Spacer />

            <div className={tokenItemClassname}>
              <div>Airdrop</div>
              <div className="md:text-lg font-heading font-bold text-center">{rewards.result.airdropTier}</div>
            </div>
            <Spacer />

            <div className={tokenItemClassname}>
              <div>Total</div>
              <div className="md:text-lg font-heading font-bold text-center">
                {nFormatter(rewards.result.totalPoints, 2)}
              </div>
            </div>
            <Spacer />
          </div>
        </div>
      }
    />
  );
};
