import React from 'react';
import { Button } from 'src/components/common';
import { useOnboardContext } from 'src/utils/context/OnboardContext';

const OnboardPage = () => {
  const { signIn, signOut, wallet, isConnecting, user, signMessage } = useOnboardContext();

  return (
    <div className="flex flex-col items-center">
      <Button disabled={isConnecting} onClick={() => (wallet ? signOut() : signIn())}>
        {isConnecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect'}
      </Button>

      <Button
        onClick={async () => {
          const result = await signMessage('wat?');

          console.log(result);
        }}
      >
        Sign
      </Button>

      {user && (
        <>
          <div>{user.address}</div>
          <div>{user.username}</div>
        </>
      )}
    </div>
  );
};

export default OnboardPage;
