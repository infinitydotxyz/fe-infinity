import { Button } from 'src/components/common';

const imgUrl =
  'https://lh3.googleusercontent.com/y_hVyUtNEgy2dAewTXkSAKlipHn3oehM3Pt7zV9M117zayWvwOcqOTxkcldQz_ibAZxF5R_pmUAol4oSenz2H-zPCJGsZQwce-H-=w600';
const TwitterSupporter = () => {
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

const TwitterSupporterList = () => {
  return (
    <>
      <div className="text-3xl mb-6 mt-16">Top Twitter supporters</div>
      <TwitterSupporter />
      <TwitterSupporter />
      <TwitterSupporter />
    </>
  );
};

export { TwitterSupporterList };
