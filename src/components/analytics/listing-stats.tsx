import { OrderStats } from 'src/hooks/api/useOrderRewardStats';
import { RewardsSection } from '../rewards/rewards-section';
import { twMerge } from 'tailwind-merge';
import { buttonBorderColor, primaryShadow } from 'src/utils/ui-constants';
import useScreenSize from 'src/hooks/useScreenSize';
import { nFormatter } from 'src/utils';
import { Spacer } from '../common';

interface Props {
  stats: OrderStats;
  userStats: OrderStats;
  showUserStats: boolean;
}
export function ListingStats({ stats, userStats, showUserStats }: Props) {
  const { isDesktop } = useScreenSize();

  return (
    <>
      <div className="mb-4">
        <RewardsSection
          title="Listing totals"
          sideInfo={
            <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
              <div className="md:flex flex-wrap mt-4">
                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numListings, 2)}</div>
                  <div className="text-sm mt-1">Listings</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numActiveListings, 2)}</div>
                  <div className="text-sm mt-1">Active listings</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">
                    {nFormatter(stats.numActiveListingsBelowFloor, 2)}
                  </div>
                  <div className="text-sm mt-1">Active listings below floor</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numCancelledListings, 2)}</div>
                  <div className="text-sm mt-1">Cancelled listings</div>
                </div>
                <Spacer />
              </div>
            </div>
          }
        ></RewardsSection>
      </div>

      {showUserStats && (
        <div className="mb-4">
          <RewardsSection
            title="Your listing totals"
            sideInfo={
              <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
                <div className="md:flex flex-wrap mt-4">
                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">{nFormatter(userStats.numListings, 2)}</div>
                    <div className="text-sm mt-1">Listings</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">
                      {nFormatter(userStats.numActiveListings, 2)}
                    </div>
                    <div className="text-sm mt-1">Active listings</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">
                      {nFormatter(userStats.numActiveListingsBelowFloor, 2)}
                    </div>
                    <div className="text-sm mt-1">Active listings below floor</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">
                      {nFormatter(userStats.numCancelledListings, 2)}
                    </div>
                    <div className="text-sm mt-1">Cancelled listings</div>
                  </div>
                  <Spacer />
                </div>
              </div>
            }
          ></RewardsSection>
        </div>
      )}
    </>
  );
}
