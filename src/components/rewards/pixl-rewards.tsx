import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useEffect, useState } from 'react';
import { useSaveReferral } from 'src/hooks/api/useSaveReferral';
import { useUserPixlRewards } from 'src/hooks/api/useUserRewards';
import { nFormatter } from 'src/utils';
import { borderColor, buttonBorderColor, primaryShadow, secondaryBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useAccount } from 'wagmi';
import chad from '../../images/chad.png';
import ngmi from '../../images/ngmi.png';
import pepe from '../../images/pepe.png';
import virgin from '../../images/virgin.png';
import rookie from '../../images/rookie.png';
import { AButton } from '../astra/astra-button';
import { ClipboardButton, EZImage, Spacer } from '../common';
import { SignInButton } from '../common/sign-in-button';
import { RewardsSection } from './rewards-section';
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

function airdropTierMapper(tier: string) {
  switch (tier) {
    case 'NONE':
      return 'NGMI';
    case 'BRONZE':
      return 'VIRGIN';
    case 'SILVER':
      return 'ROOKIE';
    case 'GOLD':
      return 'CHAD';
    case 'PLATINUM':
      return 'DEGEN';
    default:
      return 'NGMI';
  }
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

  const mappedAirdropTier = airdropTierMapper(rewards.airdropTier);

  return (
    <>
      <RewardsSection
        title="Airdrop"
        subTitle={
          <div className="flex flex-col">
            <div className="flex flex-col text-sm space-y-2">
              <div>
                Airdrop tier is based on your past NFT activity on Ethereum. Your tier is {mappedAirdropTier}. See{' '}
                <a target="_blank" href="https://docs.pixl.so/rewards#airdrop" className="underline cursor-pointer">
                  docs
                </a>{' '}
                for more info.
              </div>
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
              <div className={twMerge(tokenItemClassname)}>
                {isUnlocked ? (
                  <div
                    className={twMerge(
                      'flex flex-col items-center p-2 space-y-2',
                      mappedAirdropTier === 'NGMI' ? `border ${primaryShadow}` : ''
                    )}
                  >
                    <div>Tier</div>
                    <div className="flex flex-col space-y-2 items-center">
                      <EZImage src={ngmi.src} className="w-24 h-24" />
                      <div className="md:text-lg font-heading font-bold text-center">NGMI</div>
                    </div>
                  </div>
                ) : (
                  <AButton primary onClick={unlock} className="my-8">
                    Unlock Airdrop
                  </AButton>
                )}
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname)}>
                {isUnlocked ? (
                  <div
                    className={twMerge(
                      'flex flex-col items-center p-2 space-y-2',
                      mappedAirdropTier === 'VIRGIN' ? `border ${primaryShadow}` : ''
                    )}
                  >
                    <div>Tier</div>
                    <div className="flex flex-col space-y-2 items-center">
                      <EZImage src={virgin.src} className="w-24 h-24" />
                      <div className="md:text-lg font-heading font-bold text-center">VIRGIN</div>
                    </div>
                  </div>
                ) : null}
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname)}>
                {isUnlocked ? (
                  <div
                    className={twMerge(
                      'flex flex-col items-center p-2 space-y-2',
                      mappedAirdropTier === 'ROOKIE' ? `border ${primaryShadow}` : ''
                    )}
                  >
                    <div>Tier</div>
                    <div className="flex flex-col space-y-2 items-center">
                      <EZImage src={rookie.src} className="w-24 h-24" />
                      <div className="md:text-lg font-heading font-bold text-center">ROOKIE</div>
                    </div>
                  </div>
                ) : null}
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname)}>
                {isUnlocked ? (
                  <div
                    className={twMerge(
                      'flex flex-col items-center p-2 space-y-2',
                      mappedAirdropTier === 'CHAD' ? `border ${primaryShadow}` : ''
                    )}
                  >
                    <div>Tier</div>
                    <div className="flex flex-col space-y-2 items-center">
                      <EZImage src={chad.src} className="w-[5.5rem] h-24" />
                      <div className="md:text-lg font-heading font-bold text-center">CHAD</div>
                    </div>
                  </div>
                ) : null}
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname)}>
                {isUnlocked ? (
                  <div
                    className={twMerge(
                      'flex flex-col items-center p-2 space-y-2',
                      mappedAirdropTier === 'DEGEN' ? `border ${primaryShadow}` : ''
                    )}
                  >
                    <div>Tier</div>
                    <div className="flex flex-col space-y-2 items-center">
                      <EZImage src={pepe.src} className="w-24 h-24" />
                      <div className="md:text-lg font-heading font-bold text-center">DEGEN</div>
                    </div>
                  </div>
                ) : null}
              </div>
              <Spacer />
            </div>
          </div>
        }
      />

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
              <div className="min-w-fit mt-2">Referral link:</div>
              <div
                className={twMerge(secondaryBgColor, borderColor, 'flex flex-row mt-1 p-2 font-bold rounded-lg border')}
              >
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
    </>
  );
};
