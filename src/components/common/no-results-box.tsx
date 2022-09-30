import React from 'react';
import { Button } from './button';
import { Heading } from './heading';

export type NoResultsBoxProps = {
  title: string;
  buttonText: string;
  onClick?: () => void;
};

export const NoResultsBox: React.FC<NoResultsBoxProps> = ({ title, buttonText, onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-theme-light-200 p-10 rounded-lg">
      <Heading as="h3" className="font-body font-medium text-4xl">
        <span>{title}</span>
      </Heading>
      <Button size="large" className="mt-4" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
};
