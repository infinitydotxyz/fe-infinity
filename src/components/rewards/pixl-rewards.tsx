import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useEffect, useState } from 'react';
import { useSaveReferral } from 'src/hooks/api/useSaveReferral';
import { useUserPixlRewards } from 'src/hooks/api/useUserRewards';
import { nFormatter } from 'src/utils';
import { referralLink, rewardSectionItemLabel, rewardSectionItemValue } from 'src/utils/ui-constants';
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
import { UnlockIcon } from 'src/icons/UnlockIcon';

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

export const PixlRewards = () => {
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
  const airDropTiers = [
    { title: 'NGMI', img: ngmi.src },
    { title: 'VIRGIN', img: virgin.src },
    { title: 'ROOKIE', img: rookie.src },
    { title: 'CHAD', img: chad.src },
    { title: 'DEGEN', img: pepe.src }
  ];
  return (
    <>
      <RewardsSection
        title="Airdrop"
        subTitle={
          <div className="flex flex-col">
            <div className="flex flex-col text-base font-semibold space-y-2">
              <div>
                Airdrop tier is based on your past NFT activity on Ethereum. Your tier is NGMI. See{' '}
                <a
                  target="_blank"
                  href="https://docs.pixl.so/reward-points#airdrop"
                  className="underline cursor-pointer"
                >
                  docs
                </a>{' '}
                for more info. Share on twitter to boost your airdrop tier!
                {/* Airdrop tier is based on your past NFT activity on Ethereum. Your tier is {mappedAirdropTier}. See{' '}
                <a
                  target="_blank"
                  href="https://docs.pixl.so/reward-points#airdrop"
                  className="underline cursor-pointer"
                >
                  docs
                </a>{' '}
                for more info. */}
              </div>
            </div>
            {isUnlocked && !rewards.airdropBoosted && (
              <div className="flex flex-col mt-4 mb-1">
                <p className="text-base font-semibold">Share on twitter to boost your airdrop tier!</p>
                <TwitterLink
                  tweetText="I just claimed my airdrop from @pixlso, the greatest NFT aggregator on the planet. Check it out!"
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
          <div className={twMerge('h-full md:p-2')}>
            {isUnlocked ? (
              <div className="md:flex items-center space-x-0.25 justify-between flex-wrap h-full">
                {airDropTiers.map((tier, index) => (
                  <div
                    className={twMerge(
                      tokenItemClassname,
                      'flex-1 justify-center',
                      mappedAirdropTier === tier.title
                        ? 'bg-zinc-200 dark:bg-dark-tier'
                        : 'bg-zinc-300 dark:bg-dark-disabledTier',
                      index === 0 ? 'rounded-t sm:rounded-t-none sm:rounded-l' : '',
                      index + 1 === airDropTiers?.length ? 'rounded-b sm:rounded-b-none sm:rounded-r' : ''
                    )}
                  >
                    <div
                      className={twMerge(
                        'flex flex-col items-center p-2 space-y-2',
                        mappedAirdropTier === tier.title ? `` : 'mix-blend-soft-light '
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <EZImage src={tier.img} className="w-24 h-24" />
                        <div className="md:text-lg font-heading font-bold text-center">{tier.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <AButton primary className="flex items-center rounded px-5 py-2.5 border-0" onClick={unlock}>
                  <div className="flex items-center space-x-2.5 text-base leading-5 font-medium">
                    <UnlockIcon /> <span>Unlock Airdrop</span>
                  </div>
                </AButton>
              </div>
            )}
          </div>
        }
      />

      <RewardsSection
        title="Referral Points"
        subTitle={
          <div className="flex flex-col">
            <div className="flex flex-col text-base font-semibold">
              <div>
                Earn referral points by sharing your referral link with friends. Direct as well as indirect referrals
                upto a 100 levels will earn you points. Points earned from inorganic activity will be slashed. See{' '}
                <a
                  target="_blank"
                  href="https://docs.pixl.so/reward-points#referral-points"
                  className="underline cursor-pointer"
                >
                  docs
                </a>{' '}
                for more info.
              </div>
              <div className="flex flex-wrap-reverse items-center mt-2.5 w-full">
                <div
                  className={twMerge(
                    'flex flex-row items-center border-light-borderLight dark:border-zinc-700 bg-zinc-300 dark:bg-neutral-800  font-bold rounded-lg border mr-2 overflow-hidden',
                    referralLink
                  )}
                >
                  <p className="p-2.5 bg-light-borderLight my-[0.5px] dark:bg-zinc-700 overflow-hidden whitespace-nowrap text-sm">
                    https://pixl.so/rewards?referrer={rewards.referralCode}
                  </p>
                  <div className="p-2.5 flex items-center gap-1.25 bg-zinc-300 dark:bg-neutral-800 rounded-r-lg">
                    <div className="text-base font-semibold text-neutral-700 dark:text-white">Copy</div>
                    <ClipboardButton
                      className="mt-0.5 w-3.5 h-3.5"
                      textToCopy={`https://pixl.so/rewards?referrer=${rewards.referralCode}`}
                    />
                  </div>
                </div>
                <div className="text-amber-700 text-sm font-semibold">Referral link:</div>
              </div>
            </div>
          </div>
        }
        sideInfo={
          <div className={twMerge(' h-full md:p-5')}>
            <div className="md:flex items-center flex-wrap h-full">
              <div className={twMerge(tokenItemClassname, 'flex-1')}>
                <div className={rewardSectionItemLabel}>Earned</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.referralPoints, 2)}</div>
              </div>
              {/* <Spacer /> */}
              <div className={twMerge(tokenItemClassname, 'flex-1')}>
                <div className={rewardSectionItemLabel}>Num referrals</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.numReferrals, 2)}</div>
              </div>
              {/* <Spacer /> */}
            </div>
          </div>
        }
      />

      <RewardsSection
        title="Buy Points"
        subTitle={
          <div className="flex flex-col">
            <div className="flex flex-col text-base font-semibold">
              <div>
                Earn buy points by purchasing nfts on Pixl, the higher the price, the more points you will earn. Buying
                a NFT that was listed on Pixl will give you 100x more points than buying listings from other
                marketplaces. Points earned from inorganic activity will be slashed. See{' '}
                <a
                  target="_blank"
                  href="https://docs.pixl.so/reward-points#buy-points"
                  className="underline cursor-pointer"
                >
                  docs
                </a>{' '}
                for more info.
              </div>
            </div>
          </div>
        }
        sideInfo={
          <div className={twMerge(' h-full md:p-5')}>
            <div className="md:flex items-center flex-wrap h-full justify-center xl:justify-between gap-3 xl:gap-1">
              <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                <div className={rewardSectionItemLabel}>Earned</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.buyPoints, 2)}</div>
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                <div className={rewardSectionItemLabel}>Volume (USD)</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.volume, 2)}</div>
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                <div className={rewardSectionItemLabel}>Native volume (USD)</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.nativeVolume, 2)}</div>
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                <div className={rewardSectionItemLabel}>Num buys</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.numBuys, 2)}</div>
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-fit')}>
                <div className={rewardSectionItemLabel}>Num native buys</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.numNativeBuys, 2)}</div>
              </div>
              <Spacer />
            </div>
          </div>
        }
      />

      <RewardsSection
        title="Listing Points"
        subTitle={
          <div className="flex flex-col">
            <div className="flex flex-col text-base font-semibold">
              <div>
                Earn listing points by listing NFTs at or below the floor price. The longer the time a listing is active
                and higher the floor price of the collection, the more points you will earn. See{' '}
                <a
                  target="_blank"
                  href="https://docs.pixl.so/reward-points#listing-points"
                  className="underline cursor-pointer"
                >
                  docs
                </a>{' '}
                for more info.
              </div>
            </div>
          </div>
        }
        sideInfo={
          <div className={twMerge(' h-full md:p-5')}>
            <div className="md:flex items-center flex-wrap h-full  justify-center xl:justify-between gap-3 xl:gap-1">
              <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                <div className={rewardSectionItemLabel}>Earned</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.listingPoints, 2)}</div>
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                <div className={rewardSectionItemLabel}>Listings</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.numListings, 2)}</div>
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                <div className={rewardSectionItemLabel}>Listings below floor</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.numListingsBelowFloor, 2)}</div>
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                <div className={rewardSectionItemLabel}>Active</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.numActiveListings, 2)}</div>
              </div>
              <Spacer />

              <div className={twMerge(tokenItemClassname, 'md:!w-5/12 xl:!w-1/6')}>
                <div className={rewardSectionItemLabel}>Active below floor</div>
                <div className={rewardSectionItemValue}>{nFormatter(rewards.numActiveListingsBelowFloor, 2)}</div>
              </div>
              <Spacer />
            </div>
          </div>
        }
      />
    </>
  );
};
