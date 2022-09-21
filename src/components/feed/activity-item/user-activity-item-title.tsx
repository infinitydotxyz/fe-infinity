import { NextLink, SVG } from 'src/components/common';

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
      <div className="text-black font-bold mr-2">
        {props.titleRelativeLink ? (
          <NextLink
            href={props.titleRelativeLink}
            className="font-bold whitespace-pre-wrap flex items-center"
            title={props.title}
          >
            <div className="font-bold whitespace-pre-wrap flex items-center">
              <p>{props.title}</p>
            </div>
            {props?.hasBlueCheck && <SVG.blueCheck className="w-4 h-4 ml-1 shrink-0" />}
          </NextLink>
        ) : (
          <div className="font-bold whitespace-pre-wrap flex items-center">
            <p>{props.title}</p>
          </div>
        )}
      </div>
      {props.subtitle && (
        <div className="text-gray-400">
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
