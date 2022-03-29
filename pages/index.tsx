import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Button, PageBox } from 'src/components/common';

export const Home: FC = () => {
  const router = useRouter();

  return (
    <PageBox title="Home">
      <div className="flex flex-col items-center">
        <Button
          onClick={() => {
            router.push('/market');
          }}
        >
          Market
        </Button>

        <Button
          onClick={() => {
            router.push('/connect');
          }}
        >
          Connect
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
            router.push('/collection');
          }}
        >
          Collection
        </Button>
      </div>
    </PageBox>
  );
};

export default Home;
