import { ReactNode, useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Button } from 'src/components/common';
import { Tooltip, TooltipIcon, TooltipSpec, TooltipWrapper } from './tool-tip';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: string;
  divide?: boolean;
  tooltip?: TooltipSpec;
  children: ReactNode;
}

export const Drawer = ({ open, tooltip, subtitle, divide, onClose, title, children }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const header = (
    <div className="px-12 py-10">
      <TooltipWrapper show={showTooltip} tooltip={tooltip}>
        <div className="flex   justify-between items-center">
          <>
            <div className="flex items-center">
              <div className="mr-2 text-2xl font-bold text-black">{title}</div>
              {tooltip && (
                <Tooltip setShow={setShowTooltip}>
                  <TooltipIcon />
                </Tooltip>
              )}
            </div>
            {subtitle && <div className="mt-3 text-sm text-gray-600">{subtitle}</div>}
          </>

          <Button className="ml-3" variant="round" size="plain" onClick={onClose}>
            <span className="sr-only">Close panel</span>
            <XIcon className={iconButtonStyle} aria-hidden="true" />
          </Button>
        </div>
      </TooltipWrapper>
      {divide && <hr className="mt-4 text-gray-700" />}
    </div>
  );

  return (
    <>
      <div
        className={twMerge(
          'pointer-events-none fixed inset-0 duration-500 z-10 bg-gray-800 bg-opacity-25',
          open ? 'pointer-events-auto transition-opacity opacity-100' : 'transition-opacity opacity-0'
        )}
        onClick={() => {
          onClose();
        }}
      />

      <div className="fixed pointer-events-none z-20 inset-0">
        <div
          className={
            'pointer-events-auto w-screen max-w-lg right-0 absolute bg-white h-full shadow-xl duration-500 ease-in-out transition-all transform  ' +
            (open ? 'translate-x-0' : 'translate-x-full')
          }
        >
          <div className="relative w-screen max-w-lg pb-10 flex flex-col space-y-6 overflow-y-scroll h-full">
            {header}
            <div className="flex h-full flex-col">{children}</div>{' '}
          </div>
        </div>
      </div>
    </>
  );
};
