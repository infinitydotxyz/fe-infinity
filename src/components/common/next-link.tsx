import React, { ReactNode } from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface Props {
  href?: string;
  className?: string;
  children: ReactNode;
}

// simplifies NextJS/Links and not confused with the react-router Link
// Use for local routing in NextJS.
export const NextLink = ({ children, className = '', href }: Props) => {
  if (!href) {
    return <></>;
  }

  return (
    <Link href={href}>
      <a className={twMerge('whitespace-nowrap cursor-pointer', className)}>{children}</a>
    </Link>
  );
};

// use for external links (https://infinity.xyz)
export const ExternalLink = ({ children, className = '', href }: Props) => {
  if (!href) {
    return <></>;
  }

  return (
    <div onClick={() => window.open(href)}>
      <a className={twMerge('whitespace-nowrap cursor-pointer', className)}>{children}</a>
    </div>
  );
};
