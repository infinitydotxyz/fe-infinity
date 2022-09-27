import React from 'react';
import { Heading } from '../common';

type ChildrenProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
};

export type InfoBoxProps = {
  title: React.ReactNode;
  description: React.ReactNode;
} & ChildrenProps;

export function InfoBox({ description, title, children }: InfoBoxProps) {
  return (
    <div className="flex bg-theme-gray-100 p-10 rounded-2xl my-4">
      <div className="w-1/2">
        <Heading as="h2" className="text-3xl font-body font-medium">
          {title}
        </Heading>
        <div className="mr-6 mt-5 text-theme-gray-700">{description}</div>
      </div>
      {children}
    </div>
  );
}

export type InfoBoxPhaseProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
} & ChildrenProps;

InfoBox.Stats = function Stats({ title, description, children }: InfoBoxPhaseProps) {
  return (
    <div className="bg-white py-6 px-6 rounded-2xl">
      <div>{title}</div>
      <div className="flex flex-wrap mt-4">{description}</div>
      <div className="flex flex-wrap mt-4">{children}</div>
    </div>
  );
};

export type InfoBoxStatProps = {
  label: string;
  value: React.ReactNode;
};

InfoBox.Stat = function Stat({ label, value }: InfoBoxStatProps) {
  return (
    <div className="lg:w-1/4 sm:w-full p-2">
      <div className="text-2xl font-heading font-bold">{value}</div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  );
};

InfoBox.SideInfo = function SideInfo({ children }: ChildrenProps) {
  return <div className="w-1/2 space-y-4">{children}</div>;
};
