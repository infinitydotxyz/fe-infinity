import { CollectionStats } from '@infinityxyz/lib/types/core';

type StatsData = {
  data: CollectionStats[];
};

interface ActivityTabProps {
  dailyStats?: StatsData | null;
  weeklyStats?: StatsData | null;
}

export function ActivityTab({ weeklyStats }: ActivityTabProps) {
  return (
    <>
      <div className="text-3xl mb-6">Activity trend</div>

      <table className="mt-8 text-sm w-1/2">
        <thead>
          <tr className="text-gray-400">
            <th className="text-left font-medium font-heading">Average Price</th>
            <th className="text-left font-medium font-heading">Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr className="font-bold font-heading">
            <td>{weeklyStats?.data[0]?.averagePrice ?? '—'}</td>
            <td>{weeklyStats?.data[0]?.volume.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
