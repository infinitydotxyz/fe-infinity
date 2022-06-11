import { useRouter } from 'next/router';
import { Button } from '../common';

export const ButtonTryBeta: React.FC = ({ children }) => {
  const router = useRouter();
  return <Button onClick={() => router.push('/')}>{children}</Button>;
};
