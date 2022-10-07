import { Button, ButtonProps } from '../common';

export const ButtonJoin: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};
