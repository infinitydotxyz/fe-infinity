import { ReactNode, useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Button } from 'src/components/common';
import { Tooltip, TooltipIcon, TooltipSpec, TooltipWrapper } from './tool-tip';
import { iconButtonStyle } from 'src/utils/ui-constants';

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
    <main
      className={
        ' fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out ' +
        (open
          ? ' transition-opacity opacity-100 duration-500 translate-x-0  '
          : ' transition-all delay-500 opacity-0 translate-x-full  ')
      }
    >
      <section
        className={
          ' w-screen max-w-lg right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  ' +
          (open ? ' translate-x-0 ' : ' translate-x-full ')
        }
      >
        <article className="relative w-screen max-w-lg pb-10 flex flex-col space-y-6 overflow-y-scroll h-full">
          {header}
          <div className="flex h-full flex-col">{children}</div>{' '}
        </article>
      </section>
      <section
        className=" w-screen h-full cursor-pointer "
        onClick={() => {
          onClose();
        }}
      ></section>
    </main>
  );
};
