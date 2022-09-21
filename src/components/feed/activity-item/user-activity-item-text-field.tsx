import { NextLink } from 'src/components/common';

type TextFieldProps =
  | {
      title: string;
      content: string;
      link?: string;
    }
  | { title: string; link?: string; children: React.ReactNode };

export const UserActivityItemTextField = (props: TextFieldProps) => {
  const content = 'content' in props ? props.content : props.children;
  return (
    <div className="w-1/6">
      <div className="text-gray-400">{props.title}</div>
      <div className="font-bold">{props.link ? <NextLink href={props.link}>{content}</NextLink> : content}</div>
    </div>
  );
};
