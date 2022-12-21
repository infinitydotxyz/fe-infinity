import { Button, ButtonProps } from 'src/components/common';

export const ResetButton: React.FC<{ large: boolean; className?: string } & Omit<ButtonProps, 'children'>> = ({
  large,
  className,
  ...props
}) => {
  return (
    <div className={className}>
      <Button {...props} variant="primary" size={large ? 'normal' : 'small'}>
        Reset
      </Button>
    </div>
  );
};
