import { CenteredContent, Spinner } from 'src/components/common';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props2 {
  error: boolean;
  noData: boolean;
  message?: string;
}

export const ErrorOrLoading = ({ error, noData, message = 'Nothing found' }: Props2) => {
  let contents;

  if (error) {
    contents = <div>Unable to load data</div>;
  } else {
    if (noData) {
      contents = <div>{message}</div>;
    } else {
      contents = <Spinner />;
    }
  }

  return (
    <div className={twMerge(textClr, 'h-full w-full  ')}>
      <CenteredContent>{contents}</CenteredContent>
    </div>
  );
};
