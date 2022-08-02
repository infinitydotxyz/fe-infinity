import { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from './button';

interface Props {
  left?: ReactElement;
  content: string | ReactElement;
  right?: ReactElement;
  iconOnly?: boolean;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  disableClick?: boolean; // for menu.button, we want to let the click fall though
}

export const Chip = ({
  left,
  content,
  right,
  iconOnly,
  active,
  onClick,
  className = '',
  disabled = false,
  disableClick = false
}: Props) => {
  return (
    <Button
      type={disableClick ? 'submit' : 'button'}
      variant={active ? 'primary' : 'outline'}
      onClick={onClick}
      size={iconOnly ? 'round' : 'medium'}
      disabled={disabled}
    >
      <div className={twMerge(iconOnly ? ' flex justify-center' : 'flex items-center', className)}>
        {left && <div className="pr-2">{left}</div>}

        <div>{content}</div>

        {right && <div>{right}</div>}
      </div>
    </Button>
  );
};
