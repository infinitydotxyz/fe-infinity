import React from 'react';

/**
 * Simple component to group multiple socials input fields together with adequate spacing.
 */
export const SocialsInputGroup: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className="flex justify-between flex-col md:flex-row space-x-0 md:space-x-4">{children}</div>;
};
