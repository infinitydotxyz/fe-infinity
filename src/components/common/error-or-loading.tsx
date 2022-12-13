import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { CenteredContent, CenterFixed } from './centered-content';
import { Spinner } from './spinner';

interface Props2 {
  error: boolean;
  noData: boolean;
  message?: string;
  fixed?: boolean;
}

export const ErrorOrLoading = ({ error, noData, message = 'Nothing found', fixed = false }: Props2) => {
  let contents;

  if (error) {
    contents = <div>Unable to load data</div>;
  } else {
    if (noData) {
      contents = <div className="font-heading">{message}</div>;
    } else {
      contents = <Spinner />;
    }
  }

  if (fixed) {
    return (
      <div className={twMerge(textClr, 'h-full w-full   text-xl')}>
        <CenterFixed>{contents}</CenterFixed>
      </div>
    );
  }

  return (
    <div className="h-full w-full dark:text-dark-body text-light-body text-xl">
      <CenteredContent>{contents}</CenteredContent>
    </div>
  );
};
