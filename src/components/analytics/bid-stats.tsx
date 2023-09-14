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
export function BidStats({ stats, userStats, showUserStats }: Props) {
  const { isDesktop } = useScreenSize();

  return (
    <>
      <div className="mb-4">
        <RewardsSection
          title="Bid totals"
          sideInfo={
            <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
              <div className="md:flex flex-wrap mt-4">
                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numBids, 2)}</div>
                  <div className="text-sm mt-1">Bids</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numActiveBids, 2)}</div>
                  <div className="text-sm mt-1">Active bids</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">
                    {nFormatter(stats.numActiveBidsNearFloor, 2)}
                  </div>
                  <div className="text-sm mt-1">Active bids near floor</div>
                </div>
                <Spacer />

                <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                  <div className="md:text-2xl font-heading font-bold">{nFormatter(stats.numCancelledBids, 2)}</div>
                  <div className="text-sm mt-1">Cancelled bids</div>
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
            title="Your bid totals"
            sideInfo={
              <div className={twMerge(buttonBorderColor, isDesktop && primaryShadow, 'md:border md:py-4 md:px-6')}>
                <div className="md:flex flex-wrap mt-4">
                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">{nFormatter(userStats.numBids, 2)}</div>
                    <div className="text-sm mt-1">Bids</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">{nFormatter(userStats.numActiveBids, 2)}</div>
                    <div className="text-sm mt-1">Active bids</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">
                      {nFormatter(userStats.numActiveBidsNearFloor, 2)}
                    </div>
                    <div className="text-sm mt-1">Active bids near floor</div>
                  </div>
                  <Spacer />

                  <div className="lg:w-1/4 sm:w-full md:block flex justify-between">
                    <div className="md:text-2xl font-heading font-bold">
                      {nFormatter(userStats.numCancelledBids, 2)}
                    </div>
                    <div className="text-sm mt-1">Cancelled bids</div>
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
