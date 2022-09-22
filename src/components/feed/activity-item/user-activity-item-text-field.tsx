import { NextLink } from 'src/components/common';

interface TextFieldProps {
  title: string;
  link?: string;
  children: React.ReactNode;
}

export const UserActivityItemTextField = (props: TextFieldProps) => {
  return (
    <div className="max-w-[120px] min-w-[120px] mx-2">
      <div className="text-gray-400">{props.title}</div>
      <div className="font-bold">
        {props.link ? <NextLink href={props.link}>{props.children}</NextLink> : props.children}
      </div>
    </div>
  );
};
