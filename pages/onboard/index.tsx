import React from 'react';
import { useOnboardContext } from 'src/utils/context/OnboardContext';

const OnboardPage = () => {
  const { signIn, signOut, wallet, isConnecting } = useOnboardContext();

  return (
    <div className="flex flex-col">
      <button disabled={isConnecting} onClick={() => (wallet ? signOut() : signIn())}>
        {isConnecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
};

export default OnboardPage;
