import { Raffle } from 'src/hooks/api/useRaffles';

export const EarningTickets = ({ raffle }: { raffle: Raffle }) => {
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
