import { useCurationQuota } from 'src/hooks/api/useCurationQuota';
import { useRaffleEntrant } from 'src/hooks/api/useRaffleEntrant';
import { nFormatter } from 'src/utils';
import { InfoBox } from '../rewards/info-box';

export const EntrantTickets = ({ raffleId, userAddress }: { raffleId: string; userAddress?: string }) => {
  const { result: entrant } = useRaffleEntrant(raffleId, userAddress ?? '');
  const { result: quota } = useCurationQuota(userAddress ?? null);
  return (
    <InfoBox.Stats title="Your Stats">
      <div className="flex w-full justify-between border-b-2">
        <InfoBox.Stat label="Volume (USD)" value={nFormatter(entrant?.data?.volumeUSDC ?? 0)}></InfoBox.Stat>
        <InfoBox.Stat label="Offers" value={nFormatter(entrant?.data?.numValidOffers ?? 0)}></InfoBox.Stat>
        <InfoBox.Stat label="Listings" value={nFormatter(entrant?.data?.numValidListings ?? 0)}></InfoBox.Stat>
      </div>
      <div className="flex w-full justify-between">
        <InfoBox.Stat label="Stake Level" value={quota?.stakeLevel}></InfoBox.Stat>
        <InfoBox.Stat label="Tickets" value={nFormatter(entrant?.numTickets ?? 0)}></InfoBox.Stat>
        <InfoBox.Stat label="Probability" value={`${nFormatter(entrant?.probability ?? 0)}%`}></InfoBox.Stat>
      </div>
    </InfoBox.Stats>
  );
};
