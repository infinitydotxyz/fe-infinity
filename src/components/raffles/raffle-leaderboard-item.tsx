import { RaffleLeaderboardUser } from '@infinityxyz/lib-frontend/types/dto';
import { ellipsisAddress, nFormatter } from 'src/utils';
import { EZImage, NextLink } from '../common';
import person from 'src/images/person.png';
import { twMerge } from 'tailwind-merge';
import { secondaryBgColor } from 'src/utils/ui-constants';
import { useEnsName } from 'wagmi';

export const RaffleLeaderboardItem = ({ entrant: item }: { entrant: RaffleLeaderboardUser }) => {
  const { data } = useEnsName({
    address: item.entrant.address as `0x${string}`
  });

  let name = item.entrant.username;
  if (!name) {
    name = data ?? '';
    if (!name) {
      name = ellipsisAddress(item.entrant.address);
    }
  }

  return (
    <div className={twMerge(secondaryBgColor, 'py-4 px-2 rounded-lg flex items-center font-heading my-2')}>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center w-full">
          <NextLink href={`/user/${item.entrant.address}`}>
            <EZImage
              className="w-12 h-12 rounded-lg overflow-clip"
              src={item.entrant.profileImage}
              missingImage={person.src}
            />
          </NextLink>
          <NextLink href={`/user/${item.entrant.address}`} className="md:inline-block ml-2">
            {name}
          </NextLink>
        </div>

        <div className="flex flex-row justify-between ml-4 w-full">
          <div className="w-1/9 max-w-20 min-w-20">
            <div className="font-header flex items-center">Tickets</div>
            <div>{nFormatter(item.numTickets)}</div>
          </div>

          <div className="w-1/9 max-w-20 min-w-20">
            <div className="font-body flex items-center">Probability</div>
            <div>{nFormatter(item.probability)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
