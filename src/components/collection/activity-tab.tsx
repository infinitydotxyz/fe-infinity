import { CollectionStats } from '@infinityxyz/lib/types/core';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type StatsData = {
  data: CollectionStats[];
};

interface ActivityTabProps {
  dailyStats?: StatsData | null;
  weeklyStats?: StatsData | null;
}

export function ActivityTab({ weeklyStats }: ActivityTabProps) {
  const data = [
    {
      name: 'Apr 1',
      uv: 4000,
      pv: 2400,
      amt: 2400
    },
    {
      name: 'Apr 2',
      uv: 3000,
      pv: 1398,
      amt: 2210
    },
    {
      name: 'Apr 3',
      uv: 2000,
      pv: 9800,
      amt: 2290
    },
    {
      name: 'Apr 4',
      uv: 2780,
      pv: 3908,
      amt: 2000
    },
    {
      name: 'Apr 5',
      uv: 1890,
      pv: 4800,
      amt: 2181
    },
    {
      name: 'Apr 6',
      uv: 2390,
      pv: 3800,
      amt: 2500
    },
    {
      name: 'Apr 7',
      uv: 3490,
      pv: 4300,
      amt: 2100
    }
  ];
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
          <Line type="monotone" dataKey="pv" stroke="#0000ff" activeDot={{ r: 8 }} />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
      </div>
    </>
  );
}
