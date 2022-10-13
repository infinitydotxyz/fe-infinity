import React from 'react';

export type MessageProps = {
  children: React.ReactNode;
};

export const Message: React.FC<MessageProps> = ({ children }) => {
  return (
    <div className="bg-green-100 rounded-lg py-5 px-6 mb-4 mt-4 text-base text-green-700" role="alert">
      {children}
    </div>
  );
};
