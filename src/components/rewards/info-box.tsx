import React from 'react';
import useScreenSize from 'src/hooks/useScreenSize';
import { twMerge } from 'tailwind-merge';
import { Heading } from '../common';
import { useHover } from 'src/hooks/useHover';
import { PulseIcon, PulseIconColor } from '../common/pulse-icon';
import { State } from 'src/utils/state';
import { borderColor, secondaryBgColor } from 'src/utils/ui-constants';

type ChildrenProps = {
  children?: React.ReactNode;
};

type BaseInfoBoxTooltipProps = {
  tooltipTitle: string;
  tooltipMessage: string;
  renderTooltip: (props: { isHovered: boolean; message?: string; title?: string } & ChildrenProps) => JSX.Element;
};

type InfoBoxTooltipProps =
  | (BaseInfoBoxTooltipProps & { state: State })
  | (BaseInfoBoxProps & { pulseIconColor: PulseIconColor; isPulsing: boolean });

type BaseInfoBoxProps = {
  title: string;
} & ChildrenProps;

export type InfoBoxProps = BaseInfoBoxProps | (BaseInfoBoxProps & InfoBoxTooltipProps);

export function InfoBox(props: InfoBoxProps) {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  const content = (
    <span className="flex w-fit">
      <Heading as="h2" className="text-2xl font-heading font-bold">
        {props.title}
      </Heading>
      {'state' in props && <PulseIcon state={props.state} ref={hoverRef} className="ml-4 mt-1.5" />}
      {'pulseIconColor' in props && (
        <PulseIcon color={props.pulseIconColor} isPulsing={props.isPulsing} ref={hoverRef} className="ml-4 mt-1.5" />
      )}
    </span>
  );

  return (
    <div className={twMerge('flex-col px-10 py-7 rounded-lg align-center justify-center', borderColor)}>
      {'renderTooltip' in props
        ? props.renderTooltip({
          isHovered,
          children: content,
          message: props.tooltipMessage,
          title: props.tooltipTitle
        })
        : content}
      <div className="mt-6">{props.children}</div>
    </div>
  );
}

export type InfoBoxPhaseProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
} & ChildrenProps;

InfoBox.Stats = function Stats({ title, description, children }: InfoBoxPhaseProps) {
  return (
    <div className={twMerge(secondaryBgColor, ' py-4 px-6 rounded-lg')}>
      <div className="font-bold">{title}</div>
      {description && <div className="flex flex-wrap text-sm font-normal mt-2">{description}</div>}
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

InfoBox.SideInfo = function SideInfo({ children, className }: { className?: string } & ChildrenProps) {
  const { isMobile } = useScreenSize();
  return <div className={twMerge(isMobile ? 'w-full my-4' : 'w-1/2', className)}>{children}</div>;
};
