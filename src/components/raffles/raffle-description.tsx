import { RaffleState } from '@infinityxyz/lib-frontend/types/core';
import { useRaffleLeaderboard } from 'src/hooks/api/useRaffleLeaderboard';
import { Raffle } from 'src/hooks/api/useRaffles';
import useScreenSize from 'src/hooks/useScreenSize';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { State } from 'src/utils/state';
import { twMerge } from 'tailwind-merge';
import { InfoBox } from '../rewards/info-box';
import { EarningTickets } from './earning-tickets';
import { EntrantTickets } from './entrant-tickets';
import { RaffleLeaderboardItem } from './raffle-leaderboard-item';
import { RaffleStats } from './raffle-stats';

const states = {
  [RaffleState.Finalized]: State.Active,
  [RaffleState.InProgress]: State.Active,
  [RaffleState.Unstarted]: State.Inactive,
  [RaffleState.Locked]: State.Active,
  [RaffleState.Completed]: State.Complete
};

export const RaffleDescription = ({ raffle }: { raffle: Raffle }) => {
  const { user } = useOnboardContext();
  const state = states[raffle.state];
  const { isMobile } = useScreenSize();
  const { result } = useRaffleLeaderboard(raffle.id); // TODO add loading states

  return (
    <InfoBox title={raffle.name} state={state}>
      <div className={twMerge('flex align-center justify-center', isMobile ? 'flex-col' : '')}>
        <InfoBox.SideInfo className="w-full">
          <div className="mb-4">
            <InfoBox.Stats title="Earning Tickets" description={EarningTickets({ raffle })}></InfoBox.Stats>
          </div>
          <div className="my-4">
            <EntrantTickets raffleId={raffle.id} userAddress={user?.address}></EntrantTickets>
          </div>
          <div className="my-4">
            <RaffleStats raffle={raffle} />
          </div>
        </InfoBox.SideInfo>
        <div className="ml-6 w-full">
          <InfoBox.SideInfo className="w-full">
            <InfoBox.Stats title="Leaderboard">
              <div className="flex-col w-full justify-between">
                {result.length > 0 &&
                  result.map((item) => {
                    return <RaffleLeaderboardItem entrant={item} key={item.entrant.address}></RaffleLeaderboardItem>;
                  })}
              </div>
            </InfoBox.Stats>
          </InfoBox.SideInfo>
        </div>
      </div>
    </InfoBox>
  );
};
