import { ClipboardButton } from 'src/components/common';
import { ellipsisAddress } from 'src/utils';
import { extraSmallIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  address: string;
  href: string;
  label?: string;
  tooltip: string;
  target?: string;
  className?: string;
  textToCopy?: string;
  hrefStyle?: string;
}

export const ShortAddress = ({ address, href, label, tooltip, className, textToCopy, hrefStyle }: Props) => {
  return (
    <div className={twMerge('flex items-center', className)}>
      {label ? <div className="mr-2">{label}</div> : null}
      <a className={twMerge('text-blue-500', hrefStyle)} href={href} title={tooltip} target="_blank">
        {ellipsisAddress(address)}
      </a>

      <ClipboardButton
        textToCopy={textToCopy ? textToCopy : address}
        className={twMerge('ml-2 cursor-pointer', extraSmallIconButtonStyle)}
      />
    </div>
  );
};
