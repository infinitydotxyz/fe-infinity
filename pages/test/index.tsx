import { useRouter } from 'next/router';
import { Button } from 'src/components/common';
import { PageBox } from 'src/components/common';

export const TestPage = () => {
  const router = useRouter();

  return (
    <PageBox title="Test Page">
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
            router.push('/analytics/trending/hourly');
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
            router.push('/profile');
          }}
        >
          Profile
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
            router.push('/explore-collections');
          }}
        >
          All Collections
        </Button>
      </div>
    </PageBox>
  );
};

export default TestPage;
