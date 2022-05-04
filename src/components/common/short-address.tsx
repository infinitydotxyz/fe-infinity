import React from 'react';
import { ClipboardButton } from 'src/components/common';
import { ellipsisAddress } from 'src/utils';

interface ShortAddressProps {
  address: string;
  href: string;
  label: string;
  tooltip: string;
  target?: string;
}

export const ShortAddress: React.FC<ShortAddressProps> = ({ address, href, label, tooltip, target = '_self' }) => {
  return (
    <div className="relative flex items-center flex-wrap py-0.5">
      <span className="text-body text-base">{label}</span>
      <div>
        <a className="ml-4 font-heading text-base underline" href={href} title={tooltip} target={target}>
          {address ? `${ellipsisAddress(address)}` : address}
        </a>
        <ClipboardButton textToCopy={address} />
      </div>
    </div>
  );
};
