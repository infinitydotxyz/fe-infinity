import { Button, Props as ButtonProps } from '../common';

export const ButtonJoin: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button {...props} className="font-heading">
      {children}
    </Button>
  );
};
