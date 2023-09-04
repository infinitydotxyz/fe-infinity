import { nFormatter } from 'src/utils';
import { Button, ClipboardButton, Spacer } from '../common';
import { twMerge } from 'tailwind-merge';
import { RewardsSection } from './rewards-section';
import { SignInButton } from '../common/sign-in-button';
import { useUserPixlRewards } from 'src/hooks/api/useUserRewards';
import { buttonBorderColor, primaryShadow, secondaryBgColor } from 'src/utils/ui-constants';
import { useSaveReferral } from 'src/hooks/api/useSaveReferral';
import { useEffect, useState } from 'react';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useAccount } from 'wagmi';
import { TwitterLink } from './twitter-link';

const tokenItemClassname = 'lg:w-1/6 sm:w-full gap-1 flex md:flex-col items-center justify-between text-sm mt-1';

function useIsAirdropUnlocked(user: string) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  useEffect(() => {
    if (user) {
      const isUnlocked = Boolean(localStorage.getItem(`airdrop:unlocked:${user}`));
      setIsUnlocked(isUnlocked);
    }
  }, [user]);

  return {
    isUnlocked,
    unlock: () => {
      const address = trimLowerCase(user);
      if (address) {
        localStorage.setItem(`airdrop:unlocked:${user}`, 'true');
        setIsUnlocked(true);
      }
    }
  };
}

export const PixlRewards = ({ isDesktop }: { isDesktop: boolean }) => {
  // save referrals based on query params
  useSaveReferral();
  const { address: user } = useAccount();
  const { rewards, boostAirdrop } = useUserPixlRewards();
  const { isUnlocked, unlock } = useIsAirdropUnlocked(user || '');

  if ('error' in rewards) {
    return (
      <RewardsSection title="Points" subTitle="Sign in to view your rewards">
        <div className="md:flex flex-wrap mt-4">
          <SignInButton />
        </div>
      </RewardsSection>
    );
  }

  return (
    <>
      <RewardsSection
        title="Referral Points"
        subTitle={
          <div className="flex flex-col">
            <div className="flex flex-col text-sm">
              <div>
                Earn referral points by sharing your referral link with friends. Direct as well as indirect referrals
                upto a 100 levels will earn you points. See{' '}
                <a target="_blank" href="https://docs.pixl.so/rewards#referrals" className="underline cursor-pointer">
                  docs
                </a>{' '}
                for more info.
              </div>
              <div className="mr-1 min-w-fit mt-2">Referral link:</div>
              <div className={twMerge(secondaryBgColor, 'flex flex-row mt-1 p-2 font-bold rounded-lg')}>
                {`https://pixl.so/rewards?referrer=${rewards.referralCode}`}
                <ClipboardButton
                  className="ml-2 mt-[0.5rem] w-6 h-6"
                  textToCopy={`https://pixl.so/rewards?referrer=${rewards.referralCode}`}
                />
              </div>
            </div>
          </div>
        }
        sideInfo={
          <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
            <div className="md:flex flex-wrap">
              <div className={tokenItemClassname}>
                <div>Earned</div>
                <div className="md:text-lg font-heading font-bold text-center">
                  {nFormatter(rewards.referralPoints, 2)}
                </div>
              </div>
              <Spacer />

              <div className={tokenItemClassname}>
                <div>Num referrals</div>
                <div className="md:text-lg font-heading font-bold text-center">
                  {nFormatter(rewards.numReferrals, 2)}
                </div>
              </div>
              <Spacer />
            </div>
          </div>
        }
      />

      <RewardsSection
        title="Airdrop points"
        subTitle={
          <div className="flex flex-col">
            <div className="flex flex-col text-sm space-y-2">
              Airdrop points are based on your past NFT activity. See{' '}
              <a target="_blank" href="https://docs.pixl.so/rewards#airdrop" className="underline cursor-pointer">
                docs
              </a>
              for more info.
            </div>
            {isUnlocked && !rewards.airdropBoosted && (
              <div className="flex flex-col mt-4 mb-1">
                <p>Share on twitter to boost your airdrop tier!</p>
                <TwitterLink
                  tweetText="I just claimed my airdrop on https://pixl.so, the greatest NFT aggregator on the planet. Check it out!"
                  linkText="Share"
                  onOpen={() => {
                    boostAirdrop();
                  }}
                />
              </div>
            )}
          </div>
        }
        sideInfo={
          <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
            <div className="md:flex flex-wrap">
              <div className={tokenItemClassname}>
                <div>Airdrop</div>
                {isUnlocked ? (
                  <div className="md:text-lg font-heading font-bold text-center">{rewards.airdropTier}</div>
                ) : (
                  <Button onClick={unlock}>Unlock Airdrop</Button>
                )}
              </div>
              <Spacer />
            </div>
          </div>
        }
      />
    </>
  );
};
