import { FunctionComponent } from 'react';
import { Button } from '../common';

const imgUrl =
  'https://lh3.googleusercontent.com/y_hVyUtNEgy2dAewTXkSAKlipHn3oehM3Pt7zV9M117zayWvwOcqOTxkcldQz_ibAZxF5R_pmUAol4oSenz2H-zPCJGsZQwce-H-=w600';
const TwitterSupporter: FunctionComponent = () => {
  return (
    <div className="rounded-xl border px-5 py-5 bg-theme-light-200 flex justify-between my-3 flex-wrap">
      <div className="flex mr-2 items-center">
        <img src={imgUrl} className="w-12 h-12 rounded-full" />
        <div className="ml-5">
          <p className="font-bold font-heading">Garrent Wallen</p>
          <p className="text-theme-light-800 font-body text-sm mt-1">312K Followers</p>
        </div>
      </div>
      <Button variant="outline" size="plain" className="px-6 py-1.5 my-3 float-right  border rounded-3xl bg-white">
        View Profile
      </Button>
    </div>
  );
};

const TopHolder = ({ index }: { index: number }) => {
  return (
    <div className="rounded-xl border px-5 py-5 bg-theme-light-200 flex my-3  items-center">
      <div className="w-12 rounded-full max-w-18 h-12 p-3 bg-white px-5 font-bold"> {index}</div>
      <div className="flex flex-wrap justify-between flex-1">
        <div className="ml-5 py-1">
          <p className="text-theme-light-800 text-sm">Address</p>
          <p className="font-heading mt-1">0xi74920f…</p>
        </div>
        <div className="ml-5 py-1">
          <p className="text-theme-light-800 text-sm">Owned</p>
          <p className="font-heading mt-1">182</p>
        </div>
        <div className="ml-5 py-1 float-right">
          <p className="text-theme-light-800 text-sm">Percentage</p>
          <p className="font-heading mt-1">3.9748%</p>
        </div>
      </div>
    </div>
  );
};

const TwitterSupporterList: FunctionComponent = () => {
  return (
    <>
      <div className="text-4xl mb-6 lg:mb-10 mt-24">Top Twitter supporters</div>
      <TwitterSupporter />
      <TwitterSupporter />
      <TwitterSupporter />

      <div className="text-4xl mb-6 lg:mb-10 mt-24">Top Holders</div>
      <TopHolder index={1} />
      <TopHolder index={2} />
      <TopHolder index={3} />
      <TopHolder index={4} />
      <TopHolder index={5} />
      <div className="text-center">
        <a className="underline font-heading cursor-pointer">View on Etherscan</a>
      </div>
    </>
  );
};

export { TwitterSupporterList };
