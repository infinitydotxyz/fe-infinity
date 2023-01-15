import { NextLink } from 'src/components/common';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface TextFieldProps {
  title: string;
  link?: string;
  children: React.ReactNode;
}

export const UserActivityItemTextField = (props: TextFieldProps) => {
  return (
    <div className="max-w-[120px] min-w-[120px] mx-2">
      <div className={twMerge(secondaryTextColor, 'font-medium')}>{props.title}</div>
      <div className="">{props.link ? <NextLink href={props.link}>{props.children}</NextLink> : props.children}</div>
    </div>
  );
};
