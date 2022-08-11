import { ReactNode } from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

interface Props {
  children: ReactNode;
  content: ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

export const HelpTip = ({ content, children, placement = 'bottom' }: Props) => {
  return (
    <Tooltip mouseEnterDelay={0.5} placement={placement} trigger={['hover']} overlay={<span>{content}</span>}>
      {/* can't use <>{children}</>, this shit is buggy */}
      <div>{children}</div>
    </Tooltip>
  );
};

// import { ReactNode } from 'react';
// import { Placement } from '@floating-ui/core';
// import { Tooltip } from 'flowbite-react';

// interface Props {
//   children: ReactNode;
//   content: ReactNode;
//   placement?: Placement;
// }

// export const HelpTip = ({ content, children, placement = 'bottom' }: Props) => {
//   return (
//     <Tooltip content={content} placement={placement}>
//       {children}
//     </Tooltip>
//   );
// };
