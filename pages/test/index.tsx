import { useRouter } from 'next/router';
import { SBHeader } from 'pages/sandbox';
import { Button, PageBox } from 'src/components/common';

export const TestPage = () => {
  const router = useRouter();

  return (
    <PageBox title="Test Page">
      <SBHeader>View the Standard components</SBHeader>
      <div className="flex flex-col">
        <div className="flex flex-col items-start">
          <Button
            onClick={() => {
              void router.push('/sandbox');
            }}
          >
            Sandbox
          </Button>
        </div>

        <div className="flex flex-col">
          <SBHeader>Pages</SBHeader>
          <div className=" flex-wrap w-3/5 flex gap-4  items-center">
            <Button
              onClick={() => {
                void router.push('/connect');
              }}
            >
              Connect
            </Button>

            <Button
              onClick={() => {
                void router.push('/market');
              }}
            >
              Market
            </Button>

            <Button
              onClick={() => {
                void router.push('/collection/boredapeyachtclub');
              }}
            >
              Collection
            </Button>

            <Button
              onClick={() => {
                void router.push('/home');
              }}
            >
              Homepage Feed
            </Button>

            <Button
              onClick={() => {
                void router.push('/analytics/trending/hourly');
              }}
            >
              Analytics
            </Button>

            <Button
              onClick={() => {
                void router.push('/profile');
              }}
            >
              Profile
            </Button>

            <Button
              onClick={() => {
                void router.push('/asset/1/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/8880');
              }}
            >
              Asset Detail
            </Button>

            <Button
              onClick={() => {
                void router.push('/user/0x24c24f9ddce175039136bae9b3943b5b051a1514');
              }}
            >
              User
            </Button>

            <Button
              onClick={() => {
                void router.push('/explore-collections');
              }}
            >
              All Collections
            </Button>

            <Button
              onClick={() => {
                void router.push('/pixel-score');
              }}
            >
              Pixel Score
            </Button>

            <Button
              onClick={() => {
                void router.push('/terms-of-service');
              }}
            >
              Terms of Service
            </Button>
          </div>
        </div>
      </div>
    </PageBox>
  );
};

export default TestPage;
