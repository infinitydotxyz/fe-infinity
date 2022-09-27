import { NextLink, pageStyles } from 'src/components/common';
import { DiscordIconLink, InstagramIconLink, MediumIconLink, TwitterIconLink } from 'src/components/landing/Icons';

export const StartFooter = () => {
  return (
    <footer className={'bg-black text-white'}>
      <div className={`${pageStyles} p-5 md:p-20`}>
        <p className="font-body w-[346px]">
          Infinity is building tools and infrastructure for culture exchange. Join us on discord to find out more and
          contribute. We are on a mission to onboard 100M people to NFTs.
        </p>
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-x-2 mt-20">
          <div className="flex items-center space-x-6">
            <DiscordIconLink />
            <MediumIconLink />
            <span className="mt-1">
              <TwitterIconLink />
            </span>
            <InstagramIconLink />
          </div>
          <div className="flex space-x-4">
            <NextLink href="/terms" className="underline">
              Terms of Service
            </NextLink>
            <NextLink href="/privacy-policy" className="underline">
              Privacy Policy
            </NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
};
