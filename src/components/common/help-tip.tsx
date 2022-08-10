import { ReactNode } from 'react';
import { Placement } from '@floating-ui/core';
import { Tooltip } from 'flowbite-react';

interface Props {
  children: ReactNode;
  content: ReactNode;
  placement?: Placement;
}

export const HelpTip = ({ content, children, placement = 'bottom' }: Props) => {
  return (
    <Tooltip content={content} placement={placement}>
      {children}
    </Tooltip>
  );
};
