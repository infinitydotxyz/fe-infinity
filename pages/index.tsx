import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Button } from 'src/components/common';
import { Layout } from 'src/components/common/layout';

export const Home: FC = () => {
  const router = useRouter();

  return (
    <Layout title="Home">
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
            router.push('/collection/boredapeyachtclub');
          }}
        >
          Collection
        </Button>

        <Button
          onClick={() => {
            router.push('/home');
          }}
        >
          Homepage Feed
        </Button>

        <Button
          onClick={() => {
            router.push('/analytics');
          }}
        >
          Analytics
        </Button>

        <Button
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
        <Button
          onClick={() => {
            router.push('/explore');
          }}
        >
          Explore
        </Button>
      </div>
    </Layout>
  );
};

export default Home;
