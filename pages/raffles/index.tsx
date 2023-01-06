import { Spinner } from 'src/components/common';
import { RaffleDescription } from 'src/components/raffles/raffle-description';
import { useRaffles } from 'src/hooks/api/useRaffles';
import { APageBox } from 'src/components/astra/astra-page-box';
import { twMerge } from 'tailwind-merge';
import { textColor } from 'src/utils/ui-constants';

const RafflesPage = () => {
  const {
    result: { raffles, ethPrice },
    isLoading
  } = useRaffles();

  return (
    <APageBox title="Raffles">
      <div className={twMerge(textColor, 'flex flex-col h-full w-full overflow-y-auto overflow-x-hidden')}>
        {isLoading && <Spinner />}
        {!isLoading &&
          raffles.map((raffle) => {
            return <RaffleDescription raffle={raffle} key={raffle.id} ethPrice={ethPrice} />;
          })}
      </div>
    </APageBox>
  );
};

export default RafflesPage;
