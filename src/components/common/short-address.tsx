import React from 'react';
import copy from 'src/images/copy.svg';

interface ShortAddressProps {
  address: string;
  href: string;
  label: string;
  tooltip: string;
}

const ShortAddress: React.FC<ShortAddressProps> = ({ address, href, label, tooltip }) => {
  return (
    <div className="relative flex">
      <span className="text-body text-base">{label}</span>
      <a className="ml-4 text-heading text-base underline" href={href} title={tooltip}>
        {address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address}
      </a>
      <img
        className="ml-4 cursor-pointer"
        src={copy.src}
        alt="copy icon"
        onClick={() => {
          navigator.clipboard.writeText(address);
        }}
      />
    </div>
  );
};

export default ShortAddress;
