import { HelpTip, SVG } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { IoMdEye } from 'react-icons/io';
import { numberWithCommas } from 'src/utils/astra-utils';
import { ARoundButton } from '../astra-button';

interface Props {
  val: number | string | undefined;
  tooltip: string;
  className?: string;
  numberSign?: boolean;
}

export const PillBadge = ({ val, tooltip, className = 'top-2 left-2', numberSign = false }: Props) => {
  if (val) {
    return (
      <div className={twMerge(className, 'absolute')}>
        <HelpTip content={tooltip}>
          <div className="bg-white rounded-full px-3 py-1 shadow-lg">
            {numberSign && <div className="inline-block text-gray-500">#</div>}
            <div className="inline-block font-bold">{numberWithCommas(val)}</div>
          </div>
        </HelpTip>
      </div>
    );
  }

  return <></>;
};

// ===============================================================

interface Props2 {
  val: boolean | undefined;
  tooltip?: string;
  className?: string;
}

export const BlueCheckBadge = ({ val, tooltip = 'Blue check verified', className = 'bottom-1 right-1' }: Props2) => {
  if (val) {
    return (
      <div className={twMerge(className, 'absolute')}>
        <HelpTip content={tooltip}>
          <div className="   rounded-full">
            <SVG.blueCheck className={'  h-5 w-5 '} />
          </div>
        </HelpTip>
      </div>
    );
  }

  return <></>;
};

// ===========================================================
interface Props3 {
  onClick: () => void;
  tooltip?: string;
  className?: string;
}

export const EyeBadge = ({ onClick, className = 'bottom-0 right-1' }: Props3) => {
  return (
    <div className={twMerge(className, 'absolute')}>
      <ARoundButton onClick={onClick}>
        <IoMdEye className={'h-8 w-8 dark:text-dark-body text-light-body opacity-50 hover:opacity-100'} />
      </ARoundButton>
    </div>
  );
};
