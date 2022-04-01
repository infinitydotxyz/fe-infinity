import React from 'react';
import { ClipboardButton } from 'src/components/common/clipboard-button';

interface ShortAddressProps {
  address: string;
  href: string;
  label: string;
  tooltip: string;
}

export const ShortAddress: React.FC<ShortAddressProps> = ({ address, href, label, tooltip }) => {
  return (
    <div className="relative flex">
      <span className="text-body text-base">{label}</span>
      <a className="ml-4 text-heading text-base underline" href={href} title={tooltip}>
        {address && address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address}
      </a>
      <ClipboardButton textToCopy={address} />
    </div>
  );
};
