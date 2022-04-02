import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Button, PageBox } from 'src/components/common';

export const Home: FC = () => {
  const router = useRouter();

  return (
    <PageBox title="Home">
      <div className="flex flex-col space-y-4 items-center">
        <Button
          onClick={() => {
            router.push('/connect');
          }}
        >
          Connect
        </Button>

        <Button
          onClick={() => {
            router.push('/market');
          }}
        >
          Market
        </Button>

        <Button
          onClick={() => {
            router.push('/collection/ens');
          }}
        >
          Collection
        </Button>

        <Button
          onClick={() => {
            router.push('/analytics');
          }}
        >
          Analytics
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            router.push('/sandbox');
          }}
        >
          SandBox
        </Button>
        <Button
          onClick={() => {
            router.push('/asset/1/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/8880');
          }}
        >
          Asset Detail
        </Button>
      </div>
    </PageBox>
  );
};

export default Home;
