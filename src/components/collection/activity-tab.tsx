import { CollectionStats } from '@infinityxyz/lib/types/core';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CollectionFeed } from '../feed/collection-feed';

type StatsData = {
  data: CollectionStats[];
};

interface ActivityTabProps {
  dailyStats?: StatsData | null;
  weeklyStats?: StatsData | null;
}

export function ActivityTab({ dailyStats, weeklyStats }: ActivityTabProps) {
  const data = dailyStats?.data.map((item) => {
    return {
      name: new Date(item.timestamp).toLocaleDateString(),
      average: item.avgPrice
    };
  });

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
          <tr className="font-bold font-heading text-xl">
            <td>{weeklyStats?.data[0]?.avgPrice.toLocaleString() ?? '—'} ETH</td>
            <td>{weeklyStats?.data[0]?.volume.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-8">
        <LineChart
          width={800}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="average" stroke="#0000ff" activeDot={{ r: 8 }} />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </div>

      <CollectionFeed header="Heading" forActivity={true} />
    </>
  );
}
