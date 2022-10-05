import { RaffleState } from '@infinityxyz/lib-frontend/types/core';
import { useRaffleLeaderboard } from 'src/hooks/api/useRaffleLeaderboard';
import { Raffle } from 'src/hooks/api/useRaffles';
import useScreenSize from 'src/hooks/useScreenSize';
import { ellipsisAddress, nFormatter } from 'src/utils';
import { State } from 'src/utils/state';
import { twMerge } from 'tailwind-merge';
import { EZImage, NextLink } from '../common';
import { InfoBox } from '../rewards/info-box';
import { RewardsProgressBar } from '../rewards/progressbar';

const states = {
  [RaffleState.Finalized]: State.Active,
  [RaffleState.InProgress]: State.Active,
  [RaffleState.Unstarted]: State.Inactive,
  [RaffleState.Locked]: State.Active,
  [RaffleState.Completed]: State.Complete
};

const earningTickets = ({ raffle }: { raffle: Raffle }) => {
  return (
    <>
      <div className="text-sm">
        <p>
          Tickets will be calculated according to each user's trading <strong>volume</strong>, <strong>listings</strong>
          , and <strong>offers</strong>.
          <p>
            For every <strong>{raffle.config.volume.ticketRateDenominator} USD</strong> of volume traded on Infinity,
            you will receive{' '}
            <strong>
              {raffle.config.volume.ticketRateNumerator} ticket
              {raffle.config.volume.ticketRateNumerator > 1 ? 's' : ''}
            </strong>
            . For each listing that is at most {raffle.config.listing.maxPercentAboveFloor}% above the floor price in a
            verified collection, you will receive <strong>{raffle.config.listing.ticketMultiplier} tickets</strong>. For
            each offer that is{' '}
            {raffle.config.offer.maxPercentBelowFloor === 0
              ? 'above'
              : `at least ${100 - raffle.config.offer.maxPercentBelowFloor}% of`}{' '}
            the floor price in a verified collection, you will receive{' '}
            <strong>{raffle.config.offer.ticketMultiplier} tickets</strong>.{/* </p> */}
          </p>
        </p>
      </div>
    </>
  );
};

export const RaffleDescription = ({ raffle }: { raffle: Raffle }) => {
  const state = states[raffle.state];
  const { isMobile } = useScreenSize();
  const { isLoading, result } = useRaffleLeaderboard(raffle.id);

  console.log(raffle.id, isLoading, result);

  const potSize = raffle.progress > 0 ? Math.floor((raffle.totals.prizePoolEth / raffle.progress) * 100) : 0;

  const userNumTickets = 100;
  const probability =
    userNumTickets > 0 && raffle.totals.totalNumTickets > 0 ? userNumTickets / raffle.totals.totalNumTickets : 0;

  return (
    <InfoBox title={raffle.name} state={state}>
      <div className={twMerge('flex align-center justify-center', isMobile ? 'flex-col' : '')}>
        <InfoBox.SideInfo className="w-full">
          <div className="mb-4">
            <InfoBox.Stats title="Earning Tickets" description={earningTickets({ raffle })}></InfoBox.Stats>
          </div>

          <div className="my-4">
            <InfoBox.Stats title="Stats">
              <div className="flex w-full justify-between border-b-2">
                <InfoBox.Stat
                  label="Tickets"
                  value={nFormatter(parseInt(raffle.totals.totalNumTickets.toString()), 10)}
                />
                <InfoBox.Stat label="Entrants" value={nFormatter(raffle.totals.numUniqueEntrants)} />
              </div>
              <div className="w-full py-2 border-b-2">
                <div className="text-sm mt-1">Pot</div>
                <div className="text-2xl font-heading font-bold flex">
                  <InfoBox.Stat label="Current" value={`${nFormatter(raffle.totals.prizePoolEth)}`} />
                  <InfoBox.Stat label="Expected" value={`${nFormatter(potSize)}`} />
                </div>
              </div>
              <div className="w-full py-2">
                <div className="text-sm mt-1">Progress</div>
                <div className="text-2xl font-heading font-bold">
                  <RewardsProgressBar
                    amount={raffle.progress !== 0 && raffle.progress < 1 ? Math.ceil(raffle.progress) : raffle.progress}
                    max={100}
                  />
                </div>
              </div>
            </InfoBox.Stats>
          </div>
          <div className="my-4">
            <InfoBox.Stats title="Your tickets">
              <div className="flex w-full justify-between border-b-2">
                <InfoBox.Stat label="Volume" value={nFormatter(2000)}></InfoBox.Stat>
                <InfoBox.Stat label="Offers" value={nFormatter(2)}></InfoBox.Stat>
                <InfoBox.Stat label="Listings" value={nFormatter(2)}></InfoBox.Stat>
              </div>
              <div className="flex w-full justify-between">
                <InfoBox.Stat label="Tickets" value={nFormatter(10_000)}></InfoBox.Stat>
                <InfoBox.Stat
                  label="Probability"
                  value={nFormatter(parseInt(probability.toString(), 10))}
                ></InfoBox.Stat>
              </div>
            </InfoBox.Stats>
          </div>
        </InfoBox.SideInfo>

        {/* <InfoBox.SideInfo> */}
        {/* <div className={isMobile ? '' : 'ml-6'}>
            <InfoBox.Stats title="Earning Tickets" description={earningTickets({ raffle })}></InfoBox.Stats>
          </div> */}
        {/* </InfoBox.SideInfo> */}

        <div className="ml-6 w-full">
          <InfoBox.SideInfo className="w-full">
            <InfoBox.Stats title="Leaderboard">
              <div className="flex-col w-full justify-between">
                {result.length > 0 &&
                  result.map((item) => {
                    return (
                      <div
                        key={item.entrant.address}
                        className="bg-theme-light-200 py-4 px-2 rounded-3xl flex items-center font-heading my-2"
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="flex items-center">
                            <NextLink href={`/user/${item.entrant.address}`}>
                              <EZImage
                                className="w-12 h-12 rounded-2xl overflow-clip"
                                src={item.entrant.profileImage}
                              />
                            </NextLink>
                            <NextLink
                              href={`/user/${item.entrant.address}`}
                              className="truncate hidden md:inline-block ml-2"
                            >
                              {item.entrant.username || ellipsisAddress(item.entrant.address)}
                            </NextLink>
                          </div>

                          <div className="w-1/9 max-w-[80px] min-w-[80px]">
                            <div className="text-black font-header flex items-center">Tickets</div>
                            <div>{nFormatter(item.numTickets)}</div>
                          </div>

                          <div className="w-1/9 max-w-[80px] min-w-[80px]">
                            <div className="text-black font-body flex items-center">Probability</div>
                            <div>{nFormatter(item.probability)}%</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* <InfoBox.Stat label="Volume" value={nFormatter(2000)}></InfoBox.Stat>
              <InfoBox.Stat label="Offers" value={nFormatter(2)}></InfoBox.Stat>
              <InfoBox.Stat label="Listings" value={nFormatter(2)}></InfoBox.Stat> */}
              </div>
            </InfoBox.Stats>
          </InfoBox.SideInfo>
        </div>
      </div>

      {/* <div className={twMerge('flex align-center justify-left mt-6', isMobile ? 'flex-col' : '')}>
        <InfoBox.SideInfo> */}
      {/* <InfoBox.Stats title="Your tickets">
            <div className="flex w-full justify-between border-b-2">
              <InfoBox.Stat label="Volume" value={nFormatter(2000)}></InfoBox.Stat>
              <InfoBox.Stat label="Offers" value={nFormatter(2)}></InfoBox.Stat>
              <InfoBox.Stat label="Listings" value={nFormatter(2)}></InfoBox.Stat>
            </div>
            <div className="flex w-full justify-between">
              <InfoBox.Stat label="Tickets" value={nFormatter(10_000)}></InfoBox.Stat>
              <InfoBox.Stat label="Probability" value={nFormatter(parseInt(probability.toString(), 10))}></InfoBox.Stat>
            </div>
          </InfoBox.Stats> */}
      {/* </InfoBox.SideInfo>
      </div> */}

      {/* <div className={twMerge('flex align-center justify-left mt-6', isMobile ? 'flex-col' : '')}> */}
      {/* <InfoBox.SideInfo>
          <InfoBox.Stats title="Leaderboard">
            <div className="flex-col w-full justify-between">
              {result.length > 0 &&
                result.map((item) => {
                  return (
                    <div
                      key={item.entrant.address}
                      className="bg-theme-light-200 px-6 py-2 rounded-3xl flex items-center font-heading my-4"
                    >
                      <div className="flex justify-between items-center w-full ml-6">
                        <NextLink href={`/user/${item.entrant.address}`}>
                          <EZImage className="w-16 h-16 rounded-2xl overflow-clip" src={item.entrant.profileImage} />
                        </NextLink>

                        <NextLink href={`/user/${item.entrant.address}`} className="truncate hidden md:inline-block">
                          {item.entrant.username || ellipsisAddress(item.entrant.address)}
                        </NextLink>

                        <div className="w-1/9 max-w-[80px] min-w-[80px]">
                          <div className="text-black font-bold font-body flex items-center">Tickets</div>
                          <div>{nFormatter(item.numTickets)}</div>
                        </div>

                        <div className="w-1/9 max-w-[80px] min-w-[80px]">
                          <div className="text-black font-bold font-body flex items-center">Probability</div>
                          <div>{nFormatter(item.probability)}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </InfoBox.Stats>
        </InfoBox.SideInfo> */}
      {/* </div> */}
    </InfoBox>
  );
};
