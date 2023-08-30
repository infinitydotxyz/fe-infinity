import { ellipsisAddress } from 'src/utils';
import { AButton } from '../astra/astra-button';
import { useUserSignature } from 'src/hooks/api/useUserSignature';

export const SignInButton = () => {
  const { sign, isSigning, error, signature } = useUserSignature();

  return (
    <AButton primary disabled={isSigning || !error} onClick={sign} className="text-sm py-2 px-4 truncate">
      {!signature ? 'Sign In' : `Welcome ${ellipsisAddress(signature.address)}`}
    </AButton>
  );
};
