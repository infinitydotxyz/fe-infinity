import { Phase } from '@infinityxyz/lib-frontend/types/core';
import { PageBox, Spinner } from 'src/components/common';
import { useRaffleLeaderboard } from 'src/hooks/api/useRaffleLeaderboard';
import { useUserRaffleTickets } from 'src/hooks/api/useUserRaffleTickets';
import { ellipsisAddress } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export const Test = () => {
  const { user } = useOnboardContext();
  const {
    res: { result: userRaffleTickets }
  } = useUserRaffleTickets(Phase.One, user?.address);
  const res = useRaffleLeaderboard(Phase.One);
  return (
    <PageBox title="Local">
      {res.isLoading && <Spinner />}
      {res.error && <div>Unable to load raffle leaderboard. {JSON.stringify(res.error, null, 2)}</div>}
      <table>
        <thead>
          <th>Pic</th>
          <th>User</th>
          <th>Tickets</th>
          <th>Rank</th>
          <th>Chance</th>
        </thead>
        <tbody>
          {res.result.map((item) => {
            return (
              <tr key={item.userAddress}>
                <td>
                  <img src={item.user.profileImage} style={{ height: 24, width: 24 }} />
                </td>
                <td>{item.user.username || ellipsisAddress(item.user.address)}</td>
                <td>{item.numTickets}</td>
                <td>{item.rank}</td>
                <td>{item.chanceOfWinning}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>
        <p>You</p>
        {userRaffleTickets && (
          <table>
            <thead>
              <th>Pic</th>
              <th>User</th>
              <th>Tickets</th>
              <th>Rank</th>
              <th>Chance</th>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src={userRaffleTickets.user.profileImage} style={{ height: 24, width: 24 }} />
                </td>
                <td>{userRaffleTickets.user.username || ellipsisAddress(userRaffleTickets.user.address)}</td>
                <td>{userRaffleTickets.numTickets}</td>
                <td>{!userRaffleTickets.rank ? '--' : userRaffleTickets.rank}</td>
                <td>{userRaffleTickets.chanceOfWinning}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </PageBox>
  );
};
