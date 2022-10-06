import { RaffleLeaderboardUser } from '@infinityxyz/lib-frontend/types/dto';
import { ellipsisAddress, nFormatter } from 'src/utils';
import { EZImage, NextLink } from '../common';

export const RaffleLeaderboardItem = ({ entrant: item }: { entrant: RaffleLeaderboardUser }) => {
  return (
    <div className="bg-theme-light-200 py-4 px-2 rounded-3xl flex items-center font-heading my-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <NextLink href={`/user/${item.entrant.address}`}>
            <EZImage className="w-12 h-12 rounded-2xl overflow-clip" src={item.entrant.profileImage} />
          </NextLink>
          <NextLink href={`/user/${item.entrant.address}`} className="truncate hidden md:inline-block ml-2">
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
};
