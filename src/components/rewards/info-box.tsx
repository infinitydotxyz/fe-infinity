import React from 'react';
import useScreenSize from 'src/hooks/useScreenSize';
import { twMerge } from 'tailwind-merge';
import { Heading } from '../common';

type ChildrenProps = {
  children?: React.ReactNode;
};

export type InfoBoxProps = {
  title: React.ReactNode;
} & ChildrenProps;

export function InfoBox({ title, children }: InfoBoxProps) {
  return (
    <div className={twMerge('flex-col bg-theme-gray-100 p-10 rounded-2xl my-8 align-center justify-center')}>
      <Heading as="h2" className="text-2xl font-heading font-bold">
        {title}
      </Heading>
      <div className="mt-6">{children}</div>
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
      {description && <div className="flex flex-wrap mt-4">{description}</div>}
      {children && <div className="flex flex-wrap mt-4">{children}</div>}
    </div>
  );
};

export type InfoBoxStatProps = {
  label: string;
  value: React.ReactNode;
};

InfoBox.Stat = function Stat({ label, value }: InfoBoxStatProps) {
  return (
    <div className="lg:w-1/2 sm:w-full p-2">
      <div className="text-2xl font-heading font-bold">{value}</div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  );
};

InfoBox.SideInfo = function SideInfo({ children }: ChildrenProps) {
  const { isMobile } = useScreenSize();
  return <div className={twMerge(isMobile ? 'w-full my-4' : 'w-1/2')}>{children}</div>;
};
