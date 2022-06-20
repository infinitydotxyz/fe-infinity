import { Button, Props as ButtonProps } from '../common';

export const ButtonJoin: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      onClick={() => {
        window.open('https://www.premint.xyz/infinity-marketplace-v2-beta-allowlist/');
      }}
    >
      {children}
    </Button>
  );
};
