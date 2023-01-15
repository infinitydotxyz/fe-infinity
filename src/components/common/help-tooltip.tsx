import { ReactNode } from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

interface Props {
  children: ReactNode;
  content: ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

export const HelpToolTip = ({ content, children, placement = 'bottom' }: Props) => {
  return (
    <Tooltip mouseEnterDelay={0.1} placement={placement} trigger={['hover']} overlay={<span>{content}</span>}>
      {/* can't use <>{children}</>, this shit is buggy */}
      <div>{children}</div>
    </Tooltip>
  );
};
