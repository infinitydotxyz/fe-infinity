import { AButton } from '../astra/astra-button';
import { useUserSignature } from 'src/hooks/api/useUserSignature';

export const SignInButton = () => {
  const { sign, isSigning } = useUserSignature();
  return (
    <AButton primary disabled={isSigning} onClick={sign} className="text-sm py-2 px-4">
      {'Sign In'}
    </AButton>
  );
};
