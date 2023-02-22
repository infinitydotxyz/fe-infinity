import { UserRaffleDto } from '@infinityxyz/lib-frontend/types/dto';

export const EarningTickets = ({ raffle }: { raffle: UserRaffleDto }) => {
  return (
    <>
      <div className="text-sm">
        <p>
          Tickets will be calculated according to each user's trading <strong>volume</strong>, <strong>listings</strong>
          , and <strong>offers</strong>.
        </p>
        <ul>
          <li>
            For every <strong>{raffle.config.volume.ticketRateDenominator} USD</strong> of volume traded on Flow, you
            will receive{' '}
            <strong>
              {raffle.config.volume.ticketRateNumerator} ticket
              {raffle.config.volume.ticketRateNumerator > 1 ? 's' : ''}
            </strong>
            .
          </li>
          <li>
            For each listing that is at most {raffle.config.listing.maxPercentAboveFloor}% above the floor price in a
            verified collection, you will receive <strong>{raffle.config.listing.ticketMultiplier} tickets</strong>{' '}
            multiplied by your stake level at the time the listing is created.
          </li>
          <li>
            For each offer that is{' '}
            {raffle.config.offer.maxPercentBelowFloor === 0
              ? 'above'
              : `at least ${100 - raffle.config.offer.maxPercentBelowFloor}% of`}{' '}
            the floor price in a verified collection, you will receive{' '}
            <strong>{raffle.config.offer.ticketMultiplier} tickets</strong> multiplied by your stake level at the time
            the offer is created.
          </li>
        </ul>
      </div>
    </>
  );
};
