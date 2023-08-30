import { ellipsisAddress } from 'src/utils';
import { AButton } from '../astra/astra-button';
import { useAppContext } from 'src/utils/context/AppContext';

export const SignInButton = () => {
  const { signature, signIn, isSigning } = useAppContext();

  return (
    <AButton primary disabled={isSigning} onClick={signIn} className="text-sm py-2 px-4 truncate">
      {!signature ? 'Sign In' : `Welcome ${ellipsisAddress(signature.address)}`}
    </AButton>
  );
};
