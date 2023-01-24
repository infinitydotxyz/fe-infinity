import { ClipboardButton } from 'src/components/common';
import { ellipsisAddress } from 'src/utils';
import { smallIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  address: string;
  href: string;
  label: string;
  tooltip: string;
  target?: string;
  className?: string;
  textToCopy?: string;
}

export const ShortAddress = ({ address, href, label, tooltip, className, textToCopy }: Props) => {
  return (
    <div className={twMerge('flex items-center', className)}>
      <div>{label}</div>

      {/* do we need: target="_self" */}
      {/* use "font-heading" per figma design */}
      <a className="ml-4 underline font-heading" href={href} title={tooltip} target="_blank">
        {ellipsisAddress(address)}
      </a>

      <ClipboardButton
        textToCopy={textToCopy ? textToCopy : address}
        className={twMerge('ml-2 cursor-pointer', smallIconButtonStyle)}
      />
    </div>
  );
};
