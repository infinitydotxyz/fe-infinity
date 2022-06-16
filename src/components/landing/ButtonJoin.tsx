import { useRouter } from 'next/router';
import { Button, Props as ButtonProps } from '../common';

export const ButtonJoin: React.FC<ButtonProps> = ({ children, ...props }) => {
  const router = useRouter();
  return (
    <Button {...props} onClick={() => router.push('/')}>
      {children}
    </Button>
  );
};
