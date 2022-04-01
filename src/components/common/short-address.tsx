import React from 'react';
import { ClipboardButton } from 'src/components/common/clipboard-button';
import { ellipsisAddress } from 'src/utils';

interface ShortAddressProps {
  address: string;
  href: string;
  label: string;
  tooltip: string;
}

export const ShortAddress: React.FC<ShortAddressProps> = ({ address, href, label, tooltip }) => {
  return (
    <div className="relative flex items-center flex-wrap py-0.5">
      <span className="text-body text-base">{label}</span>
      <div>
        <a className="ml-4 text-heading text-base underline" href={href} title={tooltip}>
          {address ? `${ellipsisAddress(address)}` : address}
        </a>
        <ClipboardButton textToCopy={address} />
      </div>
    </div>
  );
};
