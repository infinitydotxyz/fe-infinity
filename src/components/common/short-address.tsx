import React from 'react';
import { ClipboardButton } from 'src/components/common';
import { ellipsisAddress } from 'src/utils';

interface Props {
  address: string;
  href: string;
  label: string;
  tooltip: string;
  target?: string;
}

export const ShortAddress = ({ address, href, label, tooltip }: Props) => {
  return (
    <div className="flex items-center">
      <div>{label}</div>

      {/* do we need: target="_self" */}
      <a className="ml-4 underline" href={href} title={tooltip} target="_blank">
        {ellipsisAddress(address)}
      </a>

      <ClipboardButton textToCopy={address} />
    </div>
  );
};
