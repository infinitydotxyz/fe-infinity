import { UserRaffleDto } from '@infinityxyz/lib-frontend/types/dto';
import { nFormatter } from 'src/utils';
import { ProgressBar } from '../common/progress-bar';
import { InfoBox } from '../rewards/info-box';

export const RaffleStats = ({ raffle, ethPrice }: { raffle: UserRaffleDto; ethPrice: number }) => {
  const potSize = raffle.progress > 0 ? Math.floor((raffle.totals.prizePoolEth / raffle.progress) * 100) : 0;
  const potSizeUSD = potSize * ethPrice;

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
          <InfoBox.Stat label="Expected (USD)" value={`${nFormatter(potSizeUSD)}`} />
        </div>
      </div>
      <div className="w-full py-2">
        <div className="text-sm mt-1">Progress</div>
        <ProgressBar percentage={raffle.progress} />
      </div>
    </InfoBox.Stats>
  );
};
