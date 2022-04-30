import React, { ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  href: string;
  className?: string;
  children: ReactNode;
}

// simplifies NextJS/Links and not confused with the react-router Link
// Use for local routing in NextJS.
export const NextLink = ({ children, className = '', href }: Props) => {
  return (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  );
};

// use for external links (https://infinity.xyz)
export const ExternalLink = ({ children, className = '', href }: Props) => {
  return (
    <div onClick={() => window.open(href)}>
      <a className={className}>{children}</a>
    </div>
  );
};
