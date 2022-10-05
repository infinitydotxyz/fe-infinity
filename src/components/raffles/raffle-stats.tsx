import { Raffle } from 'src/hooks/api/useRaffles';
import { nFormatter } from 'src/utils';
import { InfoBox } from '../rewards/info-box';
import { RewardsProgressBar } from '../rewards/progressbar';

export const RaffleStats = ({ raffle }: { raffle: Raffle }) => {
  const potSize = raffle.progress > 0 ? Math.floor((raffle.totals.prizePoolEth / raffle.progress) * 100) : 0;

  return (
    <InfoBox.Stats title="Raffle Stats">
      <div className="flex w-full justify-between border-b-2">
        <InfoBox.Stat label="Tickets" value={nFormatter(parseInt(raffle.totals.totalNumTickets.toString()), 10)} />
        <InfoBox.Stat label="Entrants" value={nFormatter(raffle.totals.numUniqueEntrants)} />
      </div>
      <div className="w-full py-2 border-b-2">
        <div className="text-sm mt-1">Pot</div>
        <div className="text-2xl font-heading font-bold flex">
          <InfoBox.Stat label="Current (ETH)" value={`${nFormatter(raffle.totals.prizePoolEth)}`} />
          <InfoBox.Stat label="Expected (ETH)" value={`${nFormatter(potSize)}`} />
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
  );
};
