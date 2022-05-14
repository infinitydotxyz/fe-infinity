// import { CollectionStats } from '@infinityxyz/lib/types/core';
// import { useEffect, useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CollectionFeed } from '../feed/collection-feed';

// type StatsData = {
//   data: CollectionStats[];
// };

interface ActivityTabProps {
  // dailyStats?: StatsData | null;
  // weeklyStats?: StatsData | null;
  collectionAddress?: string;
}

// type ChartData = {
//   name: string;
//   average: number;
// };

// export const ActivityTab = ({ dailyStats, weeklyStats }: ActivityTabProps)=> {
export const CollectionActivityTab = ({ collectionAddress }: ActivityTabProps) => {
  // const [type, setType] = useState<'DAY' | 'WEEK'>('DAY');
  // const [data, setData] = useState<ChartData[] | []>([]);

  // useEffect(() => {
  //   const dt = (type === 'DAY' ? dailyStats : weeklyStats)?.data.map((item) => {
  //     return {
  //       name: new Date(item.timestamp).toLocaleDateString(),
  //       average: item.avgPrice
  //     };
  //   });
  //   setData(dt ?? []);
  // }, [type]);

  // const onClickType = () => {
  //   if (type === 'DAY') {
  //     setType('WEEK');
  //   } else {
  //     setType('DAY');
  //   }
  // };

  return (
    <>
      {/* <div className="text-3xl mb-6">Activity trend</div>

      <div className="flex justify-between items-center w-1/2">
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

        <div className="space-x-4">
          <button
            className={type === 'DAY' ? `rounded-3xl bg-black text-white py-2 px-3` : 'py-2 px-3'}
            onClick={onClickType}
          >
            1d
          </button>
          <button
            className={type === 'WEEK' ? `rounded-3xl bg-black text-white py-2 px-3` : 'py-2 px-3'}
            onClick={onClickType}
          >
            1w
          </button>
        </div>
      </div>

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
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="average" stroke="#0000ff" activeDot={{ r: 8 }} />
        </LineChart>
      </div> */}

      <CollectionFeed forActivity={true} collectionAddress={collectionAddress ?? ''} />
    </>
  );
};
