import { NextLink } from 'src/components/common';
import { DiscordIconLink, MediumIconLink, TwitterIconLink } from 'src/components/landing/icons';
import { bgColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { pageStyles } from '../astra/astra-page-box';

export const Footer = () => {
  return (
    <footer className={twMerge(bgColor, textColor)}>
      <div className={`${pageStyles} p-5 md:p-20`}>
        <p className="font-body w-[346px]">
          Infinity is building the best tools and infrastructure for NFT trading. Join us on discord to find out more.
        </p>
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-x-2 mt-20">
          <div className="flex items-center space-x-6">
            <DiscordIconLink />
            <MediumIconLink />
            <span className="mt-1">
              <TwitterIconLink />
            </span>
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
