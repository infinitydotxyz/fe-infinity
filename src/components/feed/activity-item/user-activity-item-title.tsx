import { BlueCheck, NextLink } from 'src/components/common';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface TitleFieldProps {
  title: string;
  subtitle?: string;
  titleRelativeLink?: string;
  subtitleRelativeLink?: string;
  hasBlueCheck?: boolean;
}

export const UserActivityItemTitle = (props: TitleFieldProps) => {
  return (
    <>
      <div className="mr-2 w-[220px]">
        {props.titleRelativeLink ? (
          <NextLink
            href={props.titleRelativeLink}
            className="whitespace-pre-wrap flex items-center"
            title={props.title}
          >
            <div className={twMerge('whitespace-pre-wrap flex items-center font-medium', secondaryTextColor)}>
              <p>{props.title}</p>
            </div>
            {props?.hasBlueCheck && <BlueCheck className="ml-1" />}
          </NextLink>
        ) : (
          <div className="whitespace-pre-wrap flex items-center">
            <p>{props.title}</p>
          </div>
        )}
      </div>
      {props.subtitle && (
        <div className="">
          {props.subtitleRelativeLink ? (
            <NextLink
              href={props.subtitleRelativeLink}
              className="whitespace-pre-wrap flex items-center"
              title={props.subtitle}
            >
              {props.subtitle}
            </NextLink>
          ) : (
            <p>{props.subtitle}</p>
          )}
        </div>
      )}
    </>
  );
};
