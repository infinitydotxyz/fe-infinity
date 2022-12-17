import { AButton } from 'src/components/astra';
import { ButtonProps } from 'src/components/common';

export const ResetButton: React.FC<{ large: boolean; className?: string } & Omit<ButtonProps, 'children'>> = ({
  className,
  ...props
}) => {
  return (
    <div className={className}>
      <AButton {...props} primary>
        Reset
      </AButton>
    </div>
  );
};
