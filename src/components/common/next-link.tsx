import React from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

type Props = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

// simplifies NextJS/Links and not confused with the react-router Link
// Use for local routing in NextJS.
export const NextLink = ({ children, className = '', href, title }: Props) => {
  if (!href) {
    return <></>;
  }

  return (
    <Link href={href}>
      <a className={twMerge('whitespace-nowrap cursor-pointer', className)} title={title ?? ''}>
        {children}
      </a>
    </Link>
  );
};

// export const NextLink = ({ children, className = '', href, title }: Props) => {
//   if (!href) {
//     return <></>;
//   }

//   return (
//     <Link href={href}>
//       <a className={twMerge('whitespace-nowrap cursor-pointer', className)} title={title ?? ''}>
//         {children}
//       </a>
//     </Link>
//   );
// };
// use for external links (https://infinity.xyz)
export const ExternalLink = ({ children, className = '', target = '_blank', ...props }: Props) => {
  if (!props.href) {
    return <></>;
  }

  return (
    <a className={twMerge('whitespace-nowrap cursor-pointer', className)} target={target} {...props}>
      {children}
    </a>
  );
};
