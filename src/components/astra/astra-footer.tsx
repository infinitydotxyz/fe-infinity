import { EZImage, NextLink } from '../common';
import { FooterNavItem } from './sidebar-nav';
import lightLogo from 'src/images/light-logo.png';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/router';
import { BookIcon, SocialXIcon } from 'src/icons';
import { AButton } from './astra-button';
import { FaDiscord } from 'react-icons/fa';
import Link from 'next/link';

export const AvFooter = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2.5">
      <div className="h-0.25 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="h-0.5 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="h-1 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="h-1.5 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="h-2.5 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="h-3.75 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="h-3.75 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="h-5.25 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="h-6.5 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="h-8.25 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="h-9.25 bg-zinc-300 dark:bg-neutral-400 w-full"> </div>
      <div className="flex flex-col items-center jusitfy-center bg-zinc-300 dark:bg-neutral-400 w-full pt-6.25 pb-2.5 px-5">
        <NextLink className="mb-5" href="/">
          <EZImage src={lightLogo.src} className="w-25 h-25 bg-light-borderLight dark:bg-neutral-200 rounded-5" />
        </NextLink>
        <div className="flex flex-col sm:flex-row items-center gap-3.75">
          <FooterNavItem
            title="Explore"
            highlighted={router.asPath.startsWith('/trending')}
            onClick={() => {
              router.push('/trending');
            }}
          ></FooterNavItem>
          <FooterNavItem
            title="Profile"
            highlighted={router.asPath.startsWith('/profile')}
            onClick={() => {
              router.push('/profile');
            }}
          ></FooterNavItem>
          <FooterNavItem
            title="Rewards"
            highlighted={router.asPath.startsWith('/rewards')}
            onClick={() => {
              router.push('/rewards');
            }}
          ></FooterNavItem>
          <FooterNavItem
            title="Analytics"
            highlighted={router.asPath.startsWith('/analytics')}
            onClick={() => {
              router.push('/analytics');
            }}
          ></FooterNavItem>
          <FooterNavItem
            title="Docs"
            highlighted={router.asPath.startsWith('/docs')}
            onClick={() => {
              router.push('/docs');
            }}
          ></FooterNavItem>
        </div>
        <div className="flex items-center justify-center gap-2.5 mt-5">
          <a
            aria-label="Twitter"
            href="https://twitter.com/pixlso"
            rel="external nofollow noopener noreferrer"
            target="_blank"
          >
            <AButton className="group rounded-lg p-5 bg-light-borderLight dark:bg-neutral-800 dark:hover:bg-yellow-700 hover:bg-yellow-700 hover:text-white">
              <SocialXIcon
                className={twMerge(
                  'text-neutral-300 group-hover:text-white group-hover:dark:text-neutral-200 h-5 w-5.5'
                )}
                aria-hidden="true"
              />
            </AButton>
          </a>
          <a
            aria-label="Discord"
            href="https://discord.gg/pixlso"
            rel="external nofollow noopener noreferrer"
            target="_blank"
          >
            <AButton className="group rounded-lg p-5 bg-light-borderLight dark:bg-neutral-800 dark:hover:bg-yellow-700 hover:bg-yellow-700 hover:text-white">
              <FaDiscord
                className={twMerge(
                  'text-neutral-300 group-hover:text-white group-hover:dark:text-neutral-200 h-5 w-6.5'
                )}
                aria-hidden="true"
              />
            </AButton>
          </a>
          <a aria-label="Docs" href="https://docs.pixl.so/" rel="external nofollow noopener noreferrer" target="_blank">
            <AButton className="group rounded-lg p-5 bg-light-borderLight dark:bg-neutral-800 dark:hover:bg-yellow-700 hover:bg-yellow-700 hover:text-white">
              <BookIcon
                className={twMerge(
                  'text-neutral-300 group-hover:text-white group-hover:dark:text-neutral-200 h-5 w-6.5'
                )}
              />
            </AButton>
          </a>
        </div>
        <div className="mt-3.75 flex items-center gap-5">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-300 dark:text-neutral-700 hover:text-neutral-700 dark:hover:text-white"
          >
            &copy; 2023 pixl.so, Inc
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm font-medium text-neutral-300 dark:text-neutral-700 hover:text-neutral-700 dark:hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium text-neutral-300 dark:text-neutral-700 hover:text-neutral-700 dark:hover:text-white"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
};
