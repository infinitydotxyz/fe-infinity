import { RaffleState } from '@infinityxyz/lib-frontend/types/core';
import { UserRaffleDto } from '@infinityxyz/lib-frontend/types/dto';
import { useRaffleLeaderboard } from 'src/hooks/api/useRaffleLeaderboard';
import useScreenSize from 'src/hooks/useScreenSize';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { twMerge } from 'tailwind-merge';
import { TooltipWrapper } from '../common';
import { PulseIconColor } from '../common/pulse-icon';
import { InfoBox } from '../rewards/info-box';
import { EarningTickets } from './earning-tickets';
import { EntrantTickets } from './entrant-tickets';
import { RaffleLeaderboardItem } from './raffle-leaderboard-item';
import { RaffleStats } from './raffle-stats';

const states = {
  [RaffleState.InProgress]: {
    color: PulseIconColor.Blue,
    title: 'Active',
    message: 'Raffle is currently active.',
    isPulsing: true
  },
  [RaffleState.Finalized]: {
    color: PulseIconColor.Orange,
    title: 'Finalized',
    message: 'Raffle tickets have been finalized and winners will be selected shortly.',
    isPulsing: true
  },
  [RaffleState.Locked]: {
    color: PulseIconColor.Orange,
    title: 'Locked',
    message: 'Raffle tickets are being calculated and winners will be selected shortly.',
    isPulsing: true
  },
  [RaffleState.Unstarted]: {
    color: PulseIconColor.Gray,
    title: 'Not Started',
    message: 'Raffle has not started yet.',
    isPulsing: false
  },
  [RaffleState.Completed]: {
    color: PulseIconColor.Green,
    title: 'Complete',
    message: 'Raffle has been completed and winners have been selected.',
    isPulsing: false
  }
};

export const RaffleDescription = ({ raffle }: { raffle: UserRaffleDto }) => {
  const { user } = useOnboardContext();
  const state = states[raffle.state];
  const { isMobile } = useScreenSize();
  const { result } = useRaffleLeaderboard(raffle.id); // TODO add loading states

  const isStarted = raffle.state !== RaffleState.Unstarted;

  const renderTooltip = (props: {
    isHovered: boolean;
    children?: React.ReactNode;
    title?: string;
    message?: string;
  }) => {
    return (
      <TooltipWrapper
        className="w-fit min-w-[200px]"
        show={props.isHovered}
        tooltip={{
          title: props.title ?? '',
          content: props.message ?? ''
        }}
      >
        {props.children}
      </TooltipWrapper>
    );
  };

  return (
    <InfoBox
      title={raffle.name}
      pulseIconColor={state.color}
      isPulsing={state.isPulsing}
      renderTooltip={renderTooltip}
      tooltipTitle={state.title}
      tooltipMessage={state.message}
    >
      {isStarted ? (
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
      ) : (
        <div className={twMerge('flex align-center justify-left', isMobile ? 'flex-col' : '')}>
          <InfoBox.SideInfo>
            <div className="mb-4">
              <InfoBox.Stats title="Earning Tickets" description={EarningTickets({ raffle })}></InfoBox.Stats>
            </div>
          </InfoBox.SideInfo>
        </div>
      )}
    </InfoBox>
  );
};
