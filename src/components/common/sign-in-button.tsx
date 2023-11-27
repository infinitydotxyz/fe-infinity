import { ellipsisAddress } from 'src/utils';
import { AButton } from '../astra/astra-button';
import { useAppContext } from 'src/utils/context/AppContext';

export const SignInButton = () => {
  const { signature, signIn, isSigning } = useAppContext();
  return (
    <AButton
      primary
      disabled={isSigning}
      onClick={signIn}
      className="text-base font-semibold py-2 px-4 truncate border-0 rounded-4"
    >
      {!signature ? 'Sign In' : `Welcome ${ellipsisAddress(signature.address)}`}
    </AButton>
  );
};
