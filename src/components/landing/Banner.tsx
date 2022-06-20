import React, { useState } from 'react';
import { Button } from '../common';

export const Banner: React.FC = ({ children }) => {
  const [hidden, setHidden] = useState(false); // TODO: store in local storage?

  const hide = () => setHidden(true);

  return (
    <div className={`flex flex-row justify-center p-5 bg-black ${hidden ? 'hidden' : ''}`}>
      <div className="text-center text-white font-medium">{children}</div>

      {/* todo: remove this */}
      {hidden && (
        <Button variant="ghost" className="text-white font-thin absolute top-0 right-0" onClick={hide}>
          hide
        </Button>
      )}
    </div>
  );
};
